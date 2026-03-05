# 🔭 Armyrang

A refined platform for cultural prediction and pop culture analysis. Submit observations, vote confidence levels, and track who sees the future clearest.

## 🎯 Project Goals & Objectives

### Primary Mission
Create a sophisticated community platform for cultural analysts to make predictions, vote on confidence levels, and track accuracy over time. The platform emphasizes **soft aesthetics**, **analytical discourse**, and **collective intelligence** over aggressive debate.

### Core Objectives
- **Signal Detection**: Enable analysts to identify emerging cultural trends before they become mainstream
- **Collective Wisdom**: Aggregate individual predictions into community confidence scores
- **Reputation System**: Reward accurate analysts with titles and recognition
- **Aesthetic Refinement**: Maintain a calm, pastel-driven design that encourages thoughtful analysis
- **Cultural Documentation**: Build a historical record of predictions and their outcomes

### Success Metrics
- Active analyst engagement and prediction accuracy
- Quality of analytical discourse in comments
- Community growth while maintaining culture
- Successful resolution of predictions over time

## ✨ Features

- **Prediction Ledger** — Community-driven cultural predictions with categories (Market Analysis, Body Language, Soft Conspiracy, etc.)
- **Confidence Voting** — Analysts vote their confidence level (1-100%) on each prediction. Collective signal emerges.
- **Role System** — Join as an **Analyst** (make predictions, vote) or **Observer** (browse, follow along)
- **Leaderboard** — Track accuracy and earn analyst titles (Emerging Theorist → Signal Spotter → Cultural Prophet → Timeline Architect)
- **Discussion** — Comment on predictions with analytical observations
- **Modern UI** — Clean, responsive design with consistent spacing and typography

## Tech Stack

- **Frontend**: React (Vite) + Tailwind CSS v4
- **Backend**: Supabase (Auth, Database, Row Level Security)
- **Icons**: Lucide React
- **Fonts**: Inter + Playfair Display

## Setup

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a free project
2. In the SQL Editor, run the contents of `supabase-schema.sql` to create all tables, policies, and functions

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your Supabase project URL and anon key (found in Project Settings → API):

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Install & Run

```bash
npm install
npm run dev
```

### 4. Deploy

Build for production:

```bash
npm run build
```

Deploy the `dist/` folder to Netlify, Vercel, or Hostinger static hosting.

## Aesthetic Rules 🌸

- Soft pastel emojis only 🌸🌿🕊️✨
- Analytical tone > emotional reaction
- No aggressive caps lock
- Frame everything as observation/analysis

## User Roles

| Role | Can Browse | Can Predict | Can Vote | Can Resolve |
|------|-----------|-------------|----------|-------------|
| Observer | ✅ | ❌ | ❌ | ❌ |
| Analyst | ✅ | ✅ | ✅ | Own only |
| Admin | ✅ | ✅ | ✅ | All |

## Analyst Titles

| Correct Predictions | Title |
|-------------------|-------|
| 0+ | Emerging Theorist |
| 3+ | Signal Spotter |
| 7+ | Cultural Prophet |
| 15+ | High Accuracy Analyst |
| 30+ | Timeline Architect |
