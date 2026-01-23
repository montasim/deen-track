<div align="center">

# Next.js Admin Template

### Modern, Full-Featured Admin Dashboard Template

[![Next.js](https://img.shields.io/badge/Next.js-16.1-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

</div>

---

## Overview

**Next.js Admin Template** is a comprehensive, production-ready admin dashboard template built with modern technologies. It provides a complete foundation for building web applications with authentication, user management, content management, marketplace functionality, and more.

Built with Next.js 16, TypeScript, and PostgreSQL, this template offers a solid architecture with extensive features to accelerate your development.

## Features

### Core Functionality
- **Authentication System** - OTP-based registration, secure sessions, password reset
- **User Management** - Role-based access control, permissions, user profiles
- **Dashboard Analytics** - Comprehensive analytics and reporting tools
- **Activity Logging** - Track user actions and system events
- **Settings Management** - User preferences, notifications, appearance settings

### Content Management
- **Blog System** - Create, edit, and manage blog posts with markdown support
- **Help Center** - FAQ management and documentation pages
- **Legal Pages** - Privacy policy, terms of service management
- **Notices** - Announcements and system notifications
- **Campaigns** - Marketing campaign management

### Advanced Features
- **Marketplace** - Product listings, offers, messaging, and reviews
- **Support Tickets** - Customer support system with ticket management
- **Subscription System** - Stripe-powered premium tiers
- **Multi-tenancy** - Site-wide settings and configuration
- **OAuth Integration** - Support for external authentication providers

### UI/UX
- **Shadcn UI Components** - Beautiful, accessible component library
- **Dark Mode** - Theme switching with user preference persistence
- **Responsive Design** - Mobile-first approach with tailwind CSS
- **Real-time Updates** - WebSocket support for live features
- **Data Tables** - Sortable, filterable tables with pagination

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 15+
- Redis 7+ (optional, for caching and queues)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/next-shadcn-admin.git
cd next-shadcn-admin

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Generate Prisma Client
npx prisma generate

# Run database migrations
npx prisma migrate deploy

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Documentation

For detailed documentation, see the [docs/](docs/) folder:

| Category | Documents |
|----------|-----------|
| **Getting Started** | [INDEX.md](docs/INDEX.md) • [SETUP.md](docs/SETUP.md) |
| **Authentication** | [AUTH_README.md](docs/AUTH_README.md) • [REFRESH_TOKENS.md](docs/REFRESH_TOKENS.md) |
| **Features** | [MARKETPLACE.md](docs/MARKETPLACE.md) • [ADMIN_DASHBOARD.md](docs/ADMIN_DASHBOARD.md) |
| **Infrastructure** | [SUBSCRIPTION_SETUP.md](docs/SUBSCRIPTION_SETUP.md) |

**[View Full Documentation Index →](docs/INDEX.md)**

## Project Structure

```
next-shadcn-admin/
├── prisma/
│   └── schema.prisma          # Database schema (40+ models)
├── public/                    # Static assets
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── (auth)/           # Authentication routes
│   │   ├── (public)/         # Public pages
│   │   ├── (user)/           # User pages
│   │   ├── dashboard/        # Dashboard routes
│   │   └── api/              # API endpoints
│   ├── components/           # React components
│   │   ├── ui/              # Shadcn UI base components
│   │   ├── dashboard/       # Dashboard-specific components
│   │   └── auth/            # Authentication components
│   ├── lib/                  # Business logic
│   │   ├── auth/            # Authentication services
│   │   ├── db/              # Database utilities
│   │   └── utils/           # Helper functions
│   └── types/                # TypeScript types
├── docs/                     # Documentation
└── server.ts                 # WebSocket server
```

## Tech Stack

**Frontend:** Next.js 16, React 19, TypeScript, Tailwind CSS, Shadcn UI, TanStack Query

**Backend:** Node.js, Next.js API Routes, Prisma ORM, PostgreSQL

**Services:** Stripe, Resend, Firebase (optional OAuth providers)

**Real-time:** Socket.io, Redis, BullMQ

**UI Components:** Radix UI primitives, Lucide Icons, Recharts, React Hook Form

## Pages & Routes

### Public Pages
- `/` - Landing page
- `/about` - About page
- `/blog` - Blog listing
- `/blog/[slug]` - Blog post details
- `/contact` - Contact form
- `/help-center` - Help center
- `/pricing` - Pricing plans
- `/notices` - System notices
- `/privacy` - Privacy policy
- `/terms` - Terms of service

### Authentication
- `/auth/sign-in` - Sign in
- `/sign-up` - Sign up
- `/otp` - OTP verification
- `/forgot-password` - Password reset

### Dashboard
- `/dashboard` - Main dashboard
- `/dashboard/users` - User management
- `/dashboard/activities` - Activity logs
- `/dashboard/blog` - Blog management
- `/dashboard/marketplace` - Marketplace
- `/dashboard/settings` - User settings
- `/dashboard/support-tickets` - Support system

## API Endpoints

### Authentication
- `POST /api/auth/register/send-otp` - Send registration OTP
- `POST /api/auth/register/verify-otp` - Verify OTP
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `POST /api/auth/refresh` - Refresh access token

### Users
- `GET /api/users` - List users
- `GET /api/users/[id]` - Get user details
- `PUT /api/users/[id]` - Update user
- `DELETE /api/users/[id]` - Delete user

### Content
- `GET /api/blog` - List blog posts
- `POST /api/blog` - Create blog post
- `PUT /api/blog/[id]` - Update blog post
- `DELETE /api/blog/[id]` - Delete blog post

### Marketplace
- `GET /api/marketplace/posts` - Browse listings
- `POST /api/marketplace/offers` - Make an offer
- `GET /api/marketplace/conversations` - Get conversations

## Development

```bash
# Development with Infisical (recommended)
npm run dev

# Plain development (using .env.local)
npm run dev:plain

# WebSocket server (in separate terminal)
npm run dev:ws

# Build for production
npm run build

# Start production server
npm start
```

## Database

The application uses PostgreSQL with Prisma ORM. The schema includes 40+ models covering:

- User management and authentication
- Content management (blog, help center, legal pages)
- Marketplace and transactions
- Activity logging and analytics
- Support tickets and campaigns
- Settings and configuration

View the database with:
```bash
npx prisma studio
```

## Customization

This template is designed to be easily customizable:

1. **Branding** - Update logos, colors, and site name in settings
2. **Features** - Enable/disable features in `.env` configuration
3. **Components** - Use the included Shadcn UI components as building blocks
4. **Database** - Extend the Prisma schema for your specific needs
5. **API Routes** - Add or modify API endpoints in `/src/app/api`

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Built with ❤️ using Next.js and Shadcn UI**

</div>
