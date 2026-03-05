# 🎨 UI/UX Design Guide

## Design Philosophy

### Core Principles
- **Soft Aesthetics**: Calm, pastel-driven design that encourages thoughtful analysis
- **Analytical Tone**: Visual hierarchy supports data-driven insights over emotional reactions
- **Collective Intelligence**: UI emphasizes community wisdom and consensus building
- **Cultural Refinement**: Every element reflects sophistication and intentional design

### Brand Personality
- Sophisticated yet approachable
- Analytical but not cold
- Community-focused
- Aesthetically refined

## Visual Identity

### Color Palette
```css
/* Primary Colors */
--red-primary: #ff0000      /* Brand accent, CTAs */

/* Neutral Scale */
--gray-900: #111827         /* Primary text */
--gray-700: #374151         /* Secondary text */
--gray-600: #4b5563         /* Tertiary text */
--gray-400: #9ca3af         /* Muted text */
--gray-200: #e5e7eb         /* Borders */
--gray-100: #f3f4f6         /* Light backgrounds */
--gray-50: #f9fafb          /* Subtle backgrounds */

/* Background */
--background: #fdfcfb       /* Warm off-white */
--surface: #ffffff          /* Card backgrounds */
```

### Typography
```css
/* Font Families */
--font-sans: "Poppins", system-ui, sans-serif
--font-serif: "Playfair Display", Georgia, serif

## Component Design System

### Buttons
```jsx
/* Primary CTA */
className="px-12 py-5 bg-red-600 text-white rounded-2xl font-semibold 
           hover:bg-red-700 hover:shadow-lg transition-all text-lg"

/* Secondary */
className="px-12 py-5 bg-white text-gray-700 rounded-2xl font-medium 
           hover:bg-gray-50 border border-gray-200 transition-all text-lg"

/* Icon Button */
className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 
           rounded-xl transition-all"
```

### Cards
```jsx
/* Standard Card */
className="bg-white rounded-3xl border border-gray-200 p-8 
           hover:shadow-lg hover:border-gray-300 transition-all"

/* Prediction Card */
className="block bg-white rounded-3xl border border-gray-200 p-8 
           hover:shadow-lg hover:border-gray-300 transition-all 
           duration-300 no-underline group"
```

### Navigation
```jsx
/* Desktop Nav Link */
className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm 
           font-medium transition-all duration-150 no-underline"

/* Mobile Tab */
className="flex flex-col items-center gap-1 px-4 py-2 rounded-xl 
           no-underline transition-all min-w-[64px]"
```

## Layout Principles

### Content Hierarchy
1. **Page Title** - Large serif font, centered
2. **Section Headers** - Medium sans-serif, good spacing
3. **Body Content** - Readable line height, proper contrast
4. **Meta Information** - Smaller, muted text

### Responsive Design
```css
/* Mobile First Approach */
.container {
  max-width: 100%;
  padding: 1.5rem; /* 24px */
}

/* Tablet */
@media (min-width: 640px) {
  .container {
    padding: 2rem; /* 32px */
  }
}

/* Desktop */
@media (min-width: 768px) {
  .container {
    max-width: 80rem; /* 1280px */
    margin: 0 auto;
  }
}
```

### Grid Systems
- **Homepage Stats**: 3-column grid on desktop, single column on mobile
- **Prediction Cards**: 2-column on tablet+, single column on mobile
- **Leaderboard**: Single column with responsive internal layout

## Interaction Design

### Hover States
### Loading States

### Micro-interactions
- **Button press**: `active:scale-[0.98]`
- **Icon animations**: Subtle size changes on hover
- **Confidence bars**: Smooth width transitions

## Content Guidelines

### Voice & Tone
- **Analytical**: "Community confidence: 78%"
- **Observational**: "Recent observations suggest..."
- **Refined**: Avoid aggressive language or ALL CAPS
- **Inclusive**: "Join the Society" vs "Sign Up"


## Accessibility Standards

### Color Contrast
- **Text on white**: Minimum 4.5:1 ratio
- **Interactive elements**: Clear focus states
- **Status indicators**: Don't rely on color alone

### Keyboard Navigation
- **Tab order**: Logical flow through interface
- **Focus indicators**: Visible outline on interactive elements
- **Skip links**: For screen readers

### Screen Readers
- **Alt text**: Descriptive image alternatives
- **ARIA labels**: For complex interactions
- **Semantic HTML**: Proper heading hierarchy

## Mobile Considerations

### Touch Targets
- **Minimum size**: 44px × 44px
- **Adequate spacing**: 8px between targets
- **Thumb-friendly**: Bottom navigation on mobile

### Performance
- **Image optimization**: WebP format, proper sizing
- **Font loading**: System fonts as fallbacks
- **Animation**: Respect `prefers-reduced-motion`

## Design Tokens (Tailwind Classes)

### Spacing
```
gap-3     /* 12px - Small gaps */
gap-6     /* 24px - Standard gaps */
p-8       /* 32px - Card padding */
space-y-16 /* 64px - Section spacing */
```

### Borders & Radius
```
border-gray-200    /* Standard borders */
rounded-3xl        /* Card radius */
rounded-2xl        /* Button radius */
rounded-xl         /* Small elements */
```

### Shadows
```
shadow-sm          /* Subtle elevation */
shadow-lg          /* Hover states */
hover:shadow-lg    /* Interactive elevation */
```

## Quality Checklist

### Visual Design
- [ ] Consistent spacing throughout
- [ ] Proper color contrast ratios
- [ ] Readable typography hierarchy
- [ ] Appropriate use of white space

### Interaction Design
- [ ] Clear hover/focus states
- [ ] Smooth transitions
- [ ] Logical tab order
- [ ] Touch-friendly mobile interface

### Content Design
- [ ] Consistent voice and tone
- [ ] Appropriate emoji usage
- [ ] Clear, descriptive labels
- [ ] Helpful error messages

### Responsive Design
- [ ] Mobile-first approach
- [ ] Proper breakpoint behavior
- [ ] Readable text at all sizes
- [ ] Accessible touch targets
