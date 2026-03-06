# HAIM8 Website

A professional, board-ready McKinsey-style pitch deck transformed into a modern, multi-page B2B SaaS marketing website with glassmorphic design elements.

## 🎯 Overview

HAIM8 is a comprehensive AI orchestration platform that moves beyond simple AI tools to deliver integrated, coordinated AI solutions for SMEs. This website showcases HAIM8's value proposition through an elegant, accessible, and highly interactive web experience.

**Tagline:** *From tools to orchestration*

## 🎨 Design System

### Brand Colors
- **Electric Blue**: `#0080E4` - Primary brand color
- **Vision Purple**: `#7D41B9` - Secondary brand color
- **Dark Blue**: `#0A0E1A` - Consistent dark backgrounds

### Typography
- **Font Family**: Inter (Google Fonts)
- System follows WCAG AA accessibility standards

### Design Features
- Glassmorphic UI elements with backdrop blur effects
- Light splash gradient backgrounds on homepage featuring large elliptical splashes
- Soft blur effects for modern aesthetic
- Responsive design for desktop and mobile experiences

## 🏗️ Architecture

### Multi-Page Structure

The website has evolved from a single scrollable page to a proper multi-page architecture:

#### Core Pages
- **Home** (`/`) - Hero section with value proposition and CTAs
- **About Us** - Consolidated "Who we are" and team information
- **How It Works** - Detailed explanation of HAIM8's architecture and delivery
- **Customers** - Social proof, testimonials, and case studies
- **Pricing** - Transparent pricing tiers and plans
- **Contact** - Lead generation and inquiry forms

#### Solution Detail Pages
- **AI Concierge** - Intelligent customer service automation
- **GTM Engine** - Go-to-market acceleration platform
- **BPA (Business Process Automation)** - Process optimization solutions

### Component Structure

```
/
├── App.tsx                          # Main application entry
├── pages/                           # Page components
│   ├── HomePage.tsx
│   ├── AboutUsPage.tsx
│   ├── HowItWorksPage.tsx
│   ├── CustomersPage.tsx
│   ├── PricingPage.tsx
│   ├── ContactPage.tsx
│   ├── AIConciergeDetailPage.tsx
│   ├── GTMEngineDetailPage.tsx
│   └── BPADetailPage.tsx
├── components/                      # Reusable components
│   ├── Navigation.tsx               # Glassmorphic navigation ribbon
│   ├── Hero.tsx
│   ├── Footer.tsx
│   ├── GradientBackground.tsx
│   ├── sections/                    # Page sections
│   └── slides/                      # Original slide components
├── components/ui/                   # shadcn/ui components
└── styles/
    └── globals.css                  # Global styles and tokens
```

## 🚀 Technology Stack

- **Framework**: React 18+ with TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui component library
- **Icons**: Lucide React
- **Build Tool**: Vite (inferred from modern React setup)
- **Deployment**: GitHub Pages ready

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation

```bash
# Clone the repository
git clone https://github.com/mendisi-ctrl/haim8-website.git

# Navigate to project directory
cd haim8-website

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production

```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

## 🎯 Target Audience

**Primary**: SME owners and decision-makers
- Looking for AI transformation solutions
- Need coordinated AI platform rather than isolated tools
- Value professional, board-ready presentations
- Seek transparent pricing and clear ROI

## ✨ Key Features

### Design
- ✅ Glassmorphic navigation with backdrop blur
- ✅ Gradient splash backgrounds with Electric Blue and Vision Purple
- ✅ Fully responsive multi-page layout
- ✅ WCAG AA accessibility compliance
- ✅ Dark mode optimized color scheme

### Content
- ✅ Clear value proposition and positioning
- ✅ Detailed solution breakdowns
- ✅ Social proof and customer testimonials
- ✅ Transparent pricing models
- ✅ Professional team presentation

### User Experience
- ✅ Intuitive navigation between pages
- ✅ Fast page loads with optimized assets
- ✅ Smooth transitions and interactions
- ✅ Mobile-first responsive design

## 📄 Pages Overview

### Homepage
Main value proposition with gradient splash background, hero section, and clear CTAs directing visitors to solutions and contact.

### About Us
Combines company mission, vision, values, and team profiles in a cohesive narrative about HAIM8's approach to AI orchestration.

### How It Works
Technical deep-dive into HAIM8's architecture, delivery methodology, and integration capabilities.

### Solutions
Individual detailed pages for each core solution:
- AI Concierge for customer service automation
- GTM Engine for sales and marketing acceleration  
- BPA for business process optimization

### Customers
Social proof through case studies, testimonials, KPIs, and customer success stories.

### Pricing
Clear, transparent pricing tiers with feature breakdowns and ROI calculators.

### Contact
Lead capture forms, scheduling integration, and multiple contact methods.

## 🛠️ Development Guidelines

See `/guidelines/Guidelines.md` for detailed development standards and best practices.

### Code Standards
- TypeScript for type safety
- Component-based architecture
- Tailwind utility classes for styling
- Accessible HTML semantics
- Performance-optimized images

## 📝 Content Attribution

See `/Attributions.md` for image credits and third-party content licensing.

## 🚀 Deployment

### GitHub Pages

```bash
# Build the project
npm run build

# Deploy to GitHub Pages (if configured)
npm run deploy
```

### Custom Domain
Configure custom domain in repository settings → Pages → Custom domain

## 🤝 Contributing

This is a proprietary HAIM8 marketing website. For internal contributions:

1. Create feature branch from `main`
2. Make changes following guidelines
3. Test responsiveness and accessibility
4. Submit pull request for review

## 📊 Performance Targets

- **Lighthouse Score**: 90+ across all categories
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3.5s
- **Accessibility**: WCAG AA compliance

## 📧 Contact

For inquiries about HAIM8 solutions or website development:
- Website: [Live URL when deployed]
- Email: [contact@haim8.com]
- GitHub: https://github.com/mendisi-ctrl/haim8-website

## 📜 License

Proprietary - All rights reserved by HAIM8

---

**Built with ❤️ by the HAIM8 team**

*Last updated: March 2026*
