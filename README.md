# Next.js Admin Template

A production-ready, feature-rich admin dashboard template built with Next.js 15, React 19, TypeScript, and shadcn/ui. Perfect for building modern web applications quickly.

![Dashboard Preview](public/dashboard.png)

## Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/next-shadcn-admin.git
cd next-shadcn-admin

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Run database migrations
npx prisma generate
npx prisma db push

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Features

### Core Functionality
- **Authentication** - Email-based registration with OTP verification
- **User Management** - Admin-only user management with role assignments
- **Blog System** - Full-featured blog with categories and tags
- **Support Tickets** - Ticket-based support with WebSocket updates
- **Notices** - Site-wide announcement system
- **Email Campaigns** - Resend integration for emails
- **Site Settings** - Dynamic configuration with caching
- **Analytics** - Activity logging and dashboard statistics
- **Stripe Integration** - Subscription management

### UI/UX
- Built with **shadcn/ui** and **Tailwind CSS**
- Mobile-optimized with bottom navigation
- Data tables with sorting and filtering
- Form validation with Zod
- Toast notifications
- Skeleton loading states

## Documentation

Complete documentation is available in the `/doc` folder:

### Essential Reading
- [Getting Started Guide](doc/getting-started.md) - Installation and setup
- [Deployment Guide](doc/deployment.md) - Deploy to production
- [Customization Guide](doc/customization.md) - Tailor to your needs
- [Troubleshooting](doc/troubleshooting.md) - Common issues and solutions

### Feature Documentation
- [Authentication & Authorization](doc/features/authentication.md) - JWT auth and RBAC
- [Blog Management](doc/features/blog-management.md) - Blog system
- [Support Tickets](doc/features/support-tickets.md) - Ticket system
- [Notices](doc/features/notices.md) - Announcement system
- [Email Campaigns](doc/features/email-campaigns.md) - Email system
- [Site Settings](doc/features/site-settings.md) - Configuration
- [Stripe Integration](doc/features/stripe.md) - Payment processing

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **UI**: [React 19](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) with [Prisma](https://www.prisma.io/)
- **Authentication**: Custom JWT-based system
- **Email**: [Resend](https://resend.com/)
- **Payments**: [Stripe](https://stripe.com/)

## Project Structure

```
next-shadcn-admin/
├── doc/                     # Documentation
├── prisma/
│   └── schema.prisma       # Database schema
├── public/                  # Static assets
├── src/
│   ├── app/                # Next.js app directory
│   │   ├── (auth)/        # Auth routes
│   │   ├── (dashboard)/   # Dashboard routes
│   │   └── api/           # API routes
│   ├── components/        # React components
│   │   ├── ui/           # shadcn/ui components
│   │   └── dashboard/    # Dashboard components
│   ├── lib/              # Utility libraries
│   └── config/           # Configuration files
├── .env.example          # Environment variables template
└── package.json         # Dependencies
```

## Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/myapp"

# Authentication
JWT_SECRET="your-super-secret-jwt-key-min-32-chars"

# Email (Resend)
RESEND_API_KEY="your-resend-api-key"
EMAIL_FROM="noreply@myapp.com"

# Stripe (optional)
STRIPE_SECRET_KEY="sk_test_your_stripe_secret_key"
STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_your_publishable_key"

# Application
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

See `.env.example` for all available variables.

## Default Credentials

After setting up the application:

```
Email: admin@example.com
Password: admin123
```

**Important**: Change these credentials in production!

## Scripts

```bash
# Development
npm run dev              # Start dev server

# Building
npm run build            # Build for production
npm run start            # Start production server

# Database
npx prisma generate      # Generate Prisma Client
npx prisma db push       # Push schema to database
npx prisma studio        # Open Prisma Studio
npx prisma migrate dev   # Create migration

# Linting
npm run lint            # Run ESLint
```

## Role-Based Access Control

| Feature | USER | ADMIN | SUPER_ADMIN |
|---------|------|-------|-------------|
| View content | ✅ | ✅ | ✅ |
| Create support tickets | ✅ | ✅ | ✅ |
| Access dashboard | ❌ | ✅ | ✅ |
| Manage blog posts | ❌ | ✅ | ✅ |
| Manage users | ❌ | ❌ | ✅ |
| Manage site settings | ❌ | ❌ | ✅ |

## Support

- 📖 Read the [documentation](doc/)
- 🐛 Report issues on [GitHub Issues](https://github.com/yourusername/next-shadcn-admin/issues)
- 💬 Ask questions in [Discussions](https://github.com/yourusername/next-shadcn-admin/discussions)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

Built with:
- [Next.js](https://nextjs.org/)
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Prisma](https://www.prisma.io/)
- [Resend](https://resend.com/)
- [Stripe](https://stripe.com/)
