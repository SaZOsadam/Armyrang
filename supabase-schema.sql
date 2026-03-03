-- ============================================
-- Armyrang - Supabase Schema
-- Run this in the Supabase SQL Editor
-- ============================================

-- Profiles table (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  role TEXT NOT NULL DEFAULT 'observer' CHECK (role IN ('analyst', 'observer', 'admin')),
  avatar_url TEXT,
  reputation_score INTEGER DEFAULT 0,
  correct_predictions INTEGER DEFAULT 0,
  total_predictions INTEGER DEFAULT 0,
  title TEXT DEFAULT 'Emerging Theorist',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Predictions table
CREATE TABLE predictions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  author_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('market_analysis', 'body_language', 'soft_conspiracy', 'prediction', 'general')),
  confidence_level INTEGER NOT NULL CHECK (confidence_level BETWEEN 1 AND 100),
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'resolved_correct', 'resolved_incorrect', 'expired')),
  evidence_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  resolved_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ
);

-- Votes table (confidence votes on predictions)
CREATE TABLE votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  prediction_id UUID REFERENCES predictions(id) ON DELETE CASCADE NOT NULL,
  voter_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  confidence_vote INTEGER NOT NULL CHECK (confidence_vote BETWEEN 1 AND 100),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(prediction_id, voter_id)
);

-- Comments on predictions
CREATE TABLE comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  prediction_id UUID REFERENCES predictions(id) ON DELETE CASCADE NOT NULL,
  author_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- Row Level Security Policies
-- ============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Profiles: anyone can read, users can update own
CREATE POLICY "Profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Predictions: anyone can read, analysts/admins can create
CREATE POLICY "Predictions are viewable by everyone" ON predictions FOR SELECT USING (true);
CREATE POLICY "Analysts can create predictions" ON predictions FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('analyst', 'admin'))
  );
CREATE POLICY "Authors can update own predictions" ON predictions FOR UPDATE
  USING (author_id = auth.uid());
CREATE POLICY "Admins can update any prediction" ON predictions FOR UPDATE
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Votes: anyone can read, analysts can vote
CREATE POLICY "Votes are viewable by everyone" ON votes FOR SELECT USING (true);
CREATE POLICY "Analysts can vote" ON votes FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('analyst', 'admin'))
  );
CREATE POLICY "Voters can update own vote" ON votes FOR UPDATE USING (voter_id = auth.uid());

-- Comments: anyone can read, authenticated users can comment
CREATE POLICY "Comments are viewable by everyone" ON comments FOR SELECT USING (true);
CREATE POLICY "Authenticated users can comment" ON comments FOR INSERT WITH CHECK (auth.uid() = author_id);

-- ============================================
-- Functions
-- ============================================

-- Function to calculate average confidence for a prediction
CREATE OR REPLACE FUNCTION get_prediction_avg_confidence(pred_id UUID)
RETURNS NUMERIC AS $$
  SELECT COALESCE(AVG(confidence_vote), 0) FROM votes WHERE prediction_id = pred_id;
$$ LANGUAGE SQL STABLE;

-- Function to auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, username, display_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'observer')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for auto-creating profiles
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
