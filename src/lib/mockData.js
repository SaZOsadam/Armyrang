export const MOCK_PREDICTIONS = [
  {
    id: '1',
    title: "K-pop's dominance in Western markets will plateau by Q3 2026",
    description: "Based on streaming data cycles and historical cultural wave patterns, the current K-pop penetration in Western markets is approaching natural saturation. Expect a plateau rather than decline.",
    category: 'Market Analysis',
    status: 'active',
    confidence_avg: 72,
    vote_count: 47,
    created_at: '2026-02-10T10:00:00Z',
    profiles: { display_name: 'The Archivist', username: 'the_archivist' },
  },
  {
    id: '2',
    title: 'Quiet luxury aesthetic will be replaced by maximalism in fashion',
    description: 'Observable signals from runway shows and influencer pivots suggest the minimalist quiet luxury trend has peaked. The pendulum swings back toward expressive maximalism.',
    category: 'Cultural Trends',
    status: 'active',
    confidence_avg: 58,
    vote_count: 31,
    created_at: '2026-02-14T14:00:00Z',
    profiles: { display_name: 'Signal Spotter Nine', username: 'signal_nine' },
  },
  {
    id: '3',
    title: 'A major streaming platform will adopt a social feed by mid-2026',
    description: 'Competitive analysis of platform engagement metrics suggests at least one major streaming service will integrate TikTok-style social discovery before end of Q2 2026.',
    category: 'Entertainment',
    status: 'active',
    confidence_avg: 84,
    vote_count: 89,
    created_at: '2026-01-28T09:00:00Z',
    profiles: { display_name: 'Prophet Zero', username: 'prophet_zero' },
  },
  {
    id: '4',
    title: 'Micro-celebrity culture will fragment into niche identity tribes',
    description: 'The era of mass social media influencers is giving way to hyper-niche micro-communities. Cultural tribes forming around very specific aesthetic identities.',
    category: 'Body Language',
    status: 'resolved_correct',
    confidence_avg: 91,
    vote_count: 124,
    created_at: '2026-01-05T11:00:00Z',
    profiles: { display_name: 'Timeline Architect', username: 'tl_architect' },
  },
  {
    id: '5',
    title: 'AI-generated music will chart in Billboard Hot 100 before 2027',
    description: 'With improving generation quality and strategic label partnerships, AI-generated tracks with human collaborators will achieve mainstream chart success.',
    category: 'Soft Conspiracy',
    status: 'active',
    confidence_avg: 63,
    vote_count: 56,
    created_at: '2026-02-20T16:00:00Z',
    profiles: { display_name: 'The Archivist', username: 'the_archivist' },
  },
  {
    id: '6',
    title: 'Second-hand luxury market will exceed new luxury sales in 5 years',
    description: 'Resale platforms and circular economy momentum are accelerating. Consumer behaviour signals a fundamental shift in how luxury goods are acquired.',
    category: 'Market Analysis',
    status: 'active',
    confidence_avg: 77,
    vote_count: 38,
    created_at: '2026-02-18T13:00:00Z',
    profiles: { display_name: 'Signal Spotter Nine', username: 'signal_nine' },
  },
]

export const MOCK_LEADERBOARD = [
  { id: '1', display_name: 'Timeline Architect', username: 'tl_architect', correct_predictions: 34, total_predictions: 41, title: 'Timeline Architect' },
  { id: '2', display_name: 'Prophet Zero', username: 'prophet_zero', correct_predictions: 28, total_predictions: 35, title: 'Timeline Architect' },
  { id: '3', display_name: 'The Archivist', username: 'the_archivist', correct_predictions: 19, total_predictions: 26, title: 'High Accuracy Analyst' },
  { id: '4', display_name: 'Signal Spotter Nine', username: 'signal_nine', correct_predictions: 12, total_predictions: 19, title: 'Cultural Prophet' },
  { id: '5', display_name: 'Observation Deck', username: 'obs_deck', correct_predictions: 8, total_predictions: 14, title: 'Cultural Prophet' },
  { id: '6', display_name: 'Pattern Witness', username: 'pat_witness', correct_predictions: 5, total_predictions: 9, title: 'Signal Spotter' },
  { id: '7', display_name: 'Quiet Observer', username: 'quiet_obs', correct_predictions: 4, total_predictions: 8, title: 'Signal Spotter' },
  { id: '8', display_name: 'Emergence Scout', username: 'emg_scout', correct_predictions: 2, total_predictions: 5, title: 'Emerging Theorist' },
]

export const MOCK_STATS = {
  total_analysts: 247,
  total_predictions: 1834,
  avg_accuracy: 68,
}

export const CATEGORIES = [
  'All',
  'Market Analysis',
  'Body Language',
  'Soft Conspiracy',
  'Cultural Trends',
  'Entertainment',
]

export function getAnalystTitle(correctPredictions) {
  if (correctPredictions >= 30) return 'Timeline Architect'
  if (correctPredictions >= 15) return 'High Accuracy Analyst'
  if (correctPredictions >= 7) return 'Cultural Prophet'
  if (correctPredictions >= 3) return 'Signal Spotter'
  return 'Emerging Theorist'
}
