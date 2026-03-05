# 🛠️ Developer Guide

## Project Architecture

### Frontend Structure
```
src/
├── components/          # Reusable UI components
│   ├── Layout.jsx      # Main app layout with navigation
│   ├── PredictionCard.jsx  # Prediction display component
│   └── ConfidenceSlider.jsx # Voting interface
├── pages/              # Route components
│   ├── HomePage.jsx    # Landing page with stats
│   ├── AuthPage.jsx    # Login/signup
│   ├── LeaderboardPage.jsx # Analyst rankings
│   └── PredictionsPage.jsx # Prediction listings
├── contexts/           # React contexts
│   └── AuthContext.jsx # Authentication state
├── lib/               # Utilities
│   └── supabase.js    # Database client
└── index.css          # Global styles
```

### Database Schema
- **profiles**: User accounts with roles and reputation
- **predictions**: Core prediction data with categories
- **votes**: Confidence votes on predictions
- **comments**: Discussion threads

## Development Workflow

### 1. Local Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### 2. Database Development
- Use Supabase SQL Editor for schema changes
- Test RLS policies thoroughly
- Update `supabase-schema.sql` with any changes

### 3. Component Development
- Follow React functional component patterns
- Use Tailwind CSS v4 for styling
- Implement responsive design (mobile-first)
- Test across different screen sizes

### 4. State Management
- Use React Context for global state (auth, user profile)
- Local state with useState for component-specific data
- Supabase real-time subscriptions for live updates

## Code Standards

### React Patterns

### Styling Guidelines


### Database Queries
```javascript
// Always handle errors
const { data, error } = await supabase
  .from('table_name')
  .select('*')
  .eq('column', value)

if (error) {
  console.error('Query error:', error)
  return
}
```

## Testing Strategy

### Manual Testing Checklist
- [ ] Authentication flow (signup, login, logout)
- [ ] Responsive design on mobile/desktop
- [ ] Prediction creation and voting
- [ ] Leaderboard accuracy calculations
- [ ] Comment system functionality

### Browser Compatibility
- Chrome/Edge (primary)
- Firefox
- Safari (mobile)

## Deployment

### Production Build
```bash
npm run build
# Outputs to dist/ folder
```

### Environment Variables
```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

### Hosting Platforms
- **Netlify**: armyrang.netlify.app Project ID: 
Automatic deployments from Git
- **Vercel**: Zero-config React deployments  
- **Static hosting**: Upload dist/ folder

## Performance Considerations

### Optimization Techniques
- Lazy load components with React.lazy()
- Optimize images and assets
- Use Supabase RLS for security
- Implement proper loading states

### Monitoring
- Track Core Web Vitals
- Monitor Supabase usage quotas
- Watch for console errors

## Common Issues & Solutions

### Database Connection
```javascript
// Check if Supabase is configured
import { isConfigured } from './lib/supabase'

if (!isConfigured) {
  console.error('Supabase not configured')
}
```

### Authentication Errors
- Verify RLS policies are correct
- Check user roles in profiles table
- Ensure trigger creates profiles on signup

### Styling Issues
- Use browser dev tools to debug Tailwind classes
- Check for conflicting CSS
- Verify responsive breakpoints

## API Reference

### Auth Context Methods
```javascript
const { 
  user,           // Current user object
  profile,        // User profile data
  loading,        // Auth loading state
  signUp,         // (email, password, username, role)
  signIn,         // (email, password)
  signOut,        // ()
  isAnalyst       // Boolean helper
} = useAuth()
```

### Supabase Helpers
```javascript
// Get predictions with author info
const { data } = await supabase
  .from('predictions')
  .select(`
    *,
    profiles:author_id (display_name, username)
  `)
  .order('created_at', { ascending: false })
```
