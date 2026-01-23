# Next.js Admin Template Documentation

Welcome to the Next.js Admin Template documentation. This comprehensive guide covers all aspects of building applications with this modern, full-featured admin dashboard template.

## Table of Contents

- [Getting Started](#getting-started)
- [Core Features](#core-features)
- [Infrastructure](#infrastructure)
- [Development](#development)
- [Deployment](#deployment)

---

## Getting Started

### [SETUP.md](SETUP.md)
**Environment Setup Guide**

Complete guide for setting up your development environment:
- Prerequisites and dependencies
- Database configuration (PostgreSQL)
- Environment variables
- Infisical secret management (optional)
- Running the development server
- Troubleshooting common issues

**Best for:** New developers setting up the project

### [AUTH_README.md](AUTH_README.md)
**Authentication System**

Deep dive into the authentication system:
- OTP-based registration flow
- Secure session management
- Password reset functionality
- OAuth integration (Google, GitHub, etc.)
- Security features and best practices
- API endpoints for authentication
- Testing authentication flows

**Best for:** Developers implementing auth features

---

## Core Features

### [MARKETPLACE.md](MARKETPLACE.md)
**Marketplace System**

Complete marketplace documentation:
- Product listings and offers
- Real-time messaging with WebSocket
- Seller reviews and reputation
- Negotiation flows
- API endpoints and WebSocket events
- Security considerations

**Best for:** Developers building marketplace features

### [ADMIN_DASHBOARD.md](ADMIN_DASHBOARD.md)
**Admin Dashboard**

Admin interface documentation:
- Analytics and reporting
- User management
- Content management (blog, help center)
- Marketplace moderation
- Support ticket system
- Security and permissions

**Best for:** Admins and developers building admin tools

---

## Infrastructure

### [SUBSCRIPTION_SETUP.md](SUBSCRIPTION_SETUP.md)
**Stripe Subscription Integration**

Payment system setup:
- Stripe account configuration
- Subscription tiers and pricing
- Webhook handling
- Customer management
- Testing payments

**Best for:** Developers implementing payments

### [REFRESH_TOKENS.md](REFRESH_TOKENS.md)
**Token Refresh Mechanism**

Authentication security:
- JWT token architecture
- Refresh token flow
- Security best practices
- Implementation details

**Best for:** Developers working on authentication security

---

## Feature Overview

### Authentication & Authorization
- OTP-based email verification
- Secure session management with JWT
- Password reset with email tokens
- OAuth integration (Google, GitHub)
- Role-based access control (RBAC)
- Permission management

### User Management
- User CRUD operations
- Profile management
- Activity logging
- User preferences
- Connected accounts

### Content Management
- **Blog System**
  - Rich markdown editor
  - Category/tag management
  - SEO optimization
  - Comment system
- **Help Center**
  - FAQ management
  - Article categories
  - Search functionality
- **Legal Pages**
  - Privacy policy management
  - Terms of service
  - Custom legal content

### Marketplace
- Product listings with images
- Offer/negotiation system
- Real-time messaging
- Seller reviews and ratings
- Transaction management

### Support System
- Ticket creation and management
- Priority levels
- Admin responses
- Status tracking

### Analytics & Reporting
- User activity tracking
- Content views
- Engagement metrics
- Custom analytics

### Settings & Configuration
- User preferences
- Notification settings
- Appearance (theme, language)
- Site-wide settings
- Email templates

---

## Quick Reference

### Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:pass@host:5432/admin_template
DIRECT_URL=postgresql://user:pass@host:5432/admin_template

# Authentication
SESSION_SECRET=your-secret-key
JWT_SECRET=your-jwt-secret

# Email (Resend)
RESEND_API_KEY=re_xxxxxxxxxxxxx
FROM_EMAIL=noreply@yourdomain.com

# OAuth (Optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# Payment (Stripe - Optional)
STRIPE_SECRET_KEY=sk_test_xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# Application URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_WS_URL=ws://localhost:3001

# Redis (Optional - for caching and queues)
REDIS_URL=redis://localhost:6379
```

### Common Commands

```bash
# Development
npm run dev              # Start Next.js dev server with Infisical
npm run dev:plain        # Start without Infisical
npm run dev:ws           # Start WebSocket server

# Database
npx prisma generate      # Generate Prisma Client
npx prisma migrate dev   # Run migrations
npx prisma studio        # Visual database explorer
npx prisma db push       # Push schema changes

# Build
npm run build            # Build for production
npm start                # Start production server

# Linting
npm run lint             # Run ESLint
```

### API Base Paths

| Feature | Base Path | Description |
|---------|-----------|-------------|
| Auth | `/api/auth` | Authentication endpoints |
| Users | `/api/users` | User management |
| Blog | `/api/blog` | Blog CRUD operations |
| Marketplace | `/api/marketplace` | Marketplace APIs |
| Admin | `/api/admin` | Admin endpoints |
| Settings | `/api/settings` | Settings and preferences |
| Support | `/api/support` | Support tickets |

---

## Architecture Overview

```
┌───────────────────────────────────────────────┐
│                   Frontend                    │
│   (Next.js, React, Tailwind, Shadcn UI)      │
│   TanStack Query, Zustand, React Hook Form   │
└───────────────────────────────────────────────┘
                       │
┌───────────────────────────────────────────────┐
│                  API Layer                    │
│         (Next.js API Routes, Middleware)      │
└───────────────────────────────────────────────┘
                       │
┌───────────────────────────────────────────────┐
│              Business Logic                   │
│      (Services, Repositories, Validators)     │
└───────────────────────────────────────────────┘
                       │
┌───────────────────────────────────────────────┐
│               Data Layer                      │
│      (Prisma ORM, PostgreSQL, Redis)          │
└───────────────────────────────────────────────┘
                       │
┌───────────────────────────────────────────────┐
│            External Services                  │
│    (Stripe, Resend, OAuth Providers)         │
└───────────────────────────────────────────────┘
```

---

## Database Schema Overview

### Core Models (40+ total)

**User Management**
- User, UserSession, UserOtp
- OnlineStatus, ConnectedAccount

**Content**
- BlogPost, BlogCategory, BlogComment
- HelpCenterArticle, HelpCenterCategory
- Notice, Campaign
- LegalContent (Privacy, Terms)

**Marketplace**
- MarketplacePost, MarketplaceOffer
- Conversation, Message
- SellerReview

**Support**
- SupportTicket, SupportResponse

**Analytics**
- ActivityLog, ContentView
- UserSession

**Settings**
- SystemSettings, UserSettings
- EmailTemplate

**System**
- Maintenance, FeatureFlag

[View Full Schema](../prisma/schema.prisma)

---

## Project Structure

```
next-shadcn-admin/
├── prisma/
│   └── schema.prisma          # Database schema
├── public/                    # Static assets
│   ├── images/               # Images and logos
│   └── fonts/                # Custom fonts
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── (auth)/          # Authentication routes
│   │   │   └── auth/
│   │   │       └── sign-in/
│   │   ├── (public)/        # Public pages
│   │   │   ├── about/
│   │   │   ├── blog/
│   │   │   ├── contact/
│   │   │   ├── pricing/
│   │   │   └── ...
│   │   ├── dashboard/       # Dashboard routes
│   │   │   ├── users/
│   │   │   ├── blog/
│   │   │   ├── marketplace/
│   │   │   ├── settings/
│   │   │   └── ...
│   │   └── api/             # API endpoints
│   │       ├── auth/
│   │       ├── users/
│   │       ├── blog/
│   │       └── ...
│   ├── components/          # React components
│   │   ├── ui/             # Shadcn UI base
│   │   ├── dashboard/      # Dashboard components
│   │   ├── auth/           # Auth components
│   │   └── layout/         # Layout components
│   ├── lib/                # Business logic
│   │   ├── auth/           # Auth services
│   │   ├── db/             # Database utilities
│   │   ├── utils/          # Helper functions
│   │   └── prisma.ts       # Prisma client
│   ├── types/              # TypeScript types
│   ├── context/            # React contexts
│   ├── hooks/              # Custom hooks
│   └── stores/             # Zustand stores
├── docs/                   # Documentation
├── server.ts              # WebSocket server
└── README.md              # Main README
```

---

## Tech Stack Details

### Frontend
- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19
- **Styling**: Tailwind CSS
- **Components**: Shadcn UI (Radix UI primitives)
- **Icons**: Lucide React, Tabler Icons
- **Forms**: React Hook Form + Zod
- **Data Fetching**: TanStack Query (React Query)
- **State Management**: Zustand
- **Charts**: Recharts
- **Tables**: TanStack Table

### Backend
- **Runtime**: Node.js
- **API**: Next.js API Routes
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Caching**: Redis (optional)
- **Job Queue**: BullMQ (optional)
- **WebSocket**: Socket.io

### Third-party Services
- **Email**: Resend
- **Payments**: Stripe
- **OAuth**: Google, GitHub
- **File Storage**: Local / S3 compatible
- **Monitoring**: Winston (logging)

---

## Customization Guide

### Branding
Update the following to customize branding:
- Site name and logo in `SystemSettings`
- Colors in `tailwind.config.js`
- Metadata in `src/app/layout.tsx`

### Features
Enable/disable features via environment variables:
```env
# Enable/disable marketplace
FEATURE_MARKETPLACE=true

# Enable/disable blog
FEATURE_BLOG=true

# Enable/disable subscriptions
FEATURE_SUBSCRIPTIONS=false
```

### Components
All Shadcn UI components can be customized:
- Located in `src/components/ui/`
- Modify styles directly or use CSS variables
- Follow the [Shadcn UI docs](https://ui.shadcn.com/) for patterns

### Database
Extend the schema for your needs:
1. Edit `prisma/schema.prisma`
2. Run `npx prisma migrate dev --name your_migration`
3. Regenerate types: `npx prisma generate`

---

## Support

### Getting Help

1. **Documentation** - Check relevant docs above
2. **Issues** - Report bugs on GitHub
3. **Discussions** - Ask questions in discussions
4. **Contributing** - See the main [README.md](../README.md)

### Common Issues

**Database Connection**
- Ensure PostgreSQL is running
- Check `DATABASE_URL` in `.env.local`
- Run migrations: `npx prisma migrate deploy`

**Authentication**
- Verify email settings (Resend API key)
- Check `SESSION_SECRET` is set
- Ensure OTP templates are configured

**Build Errors**
- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Regenerate Prisma: `npx prisma generate`

---

## Deployment

### Production Checklist

- [ ] Set production environment variables
- [ ] Configure production database
- [ ] Set up Redis (if using)
- [ ] Configure email service (Resend)
- [ ] Set up Stripe (if using subscriptions)
- [ ] Configure OAuth providers
- [ ] Enable CORS for your domain
- [ ] Set up monitoring/logging
- [ ] Configure backup strategy
- [ ] Set up CDN for static assets

### Deployment Platforms

This template works with:
- **Vercel** (recommended for Next.js)
- **Netlify**
- **Railway**
- **Digital Ocean App Platform**
- **AWS Amplify**
- Self-hosted with Docker

---

## Contributing

We welcome contributions! Please see the main [README.md](../README.md) for contribution guidelines.

### Areas for Contribution

- New UI components
- Additional integrations
- Documentation improvements
- Bug fixes
- Performance improvements
- Test coverage

---

## Changelog

### Recent Updates

- **v1.0.0** (2025-01-23)
  - Initial template release
  - Authentication system
  - User management
  - Blog system
  - Marketplace functionality
  - Admin dashboard
  - Settings management
  - Support ticket system

---

**Last Updated:** January 23, 2025

**Maintained By:** Next.js Admin Template Team
