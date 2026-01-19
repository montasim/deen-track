# Getting Started

A complete guide to setting up and running the Next.js Admin Template.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18.x or higher ([Download](https://nodejs.org/))
- **npm** or **yarn** or **pnpm** (comes with Node.js)
- **PostgreSQL** 14.x or higher ([Download](https://www.postgresql.org/download/))
- **Git** ([Download](https://git-scm.com/downloads))

### Optional but Recommended

- **VS Code** with the following extensions:
  - ESLint
  - Prettier
  - TypeScript and JavaScript Language Features
  - Tailwind CSS IntelliSense
  - Prisma

## Installation

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd next-shadcn-admin
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit the `.env` file with your configuration:

```env
# ==========================================
# APPLICATION CONFIGURATION
# ==========================================
NEXT_PUBLIC_APP_NAME="My App"
NEXT_PUBLIC_APP_DESCRIPTION="A modern Next.js application"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# ==========================================
# DATABASE
# ==========================================
DATABASE_URL="postgresql://user:password@localhost:5432/myapp"
DATABASE_POOL_SIZE="10"

# ==========================================
# AUTHENTICATION
# ==========================================
JWT_SECRET="your-super-secret-jwt-key-change-in-production-min-32-chars"

# ==========================================
# EMAIL (RESEND)
# ==========================================
RESEND_API_KEY="your-resend-api-key"
EMAIL_FROM="noreply@myapp.com"
EMAIL_REPLY_TO="noreply@myapp.com"

# ==========================================
# STRIPE (OPTIONAL)
# ==========================================
STRIPE_SECRET_KEY="sk_test_your_stripe_secret_key"
STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_your_publishable_key"

# Free plan
STRIPE_PRICE_FREE_MONTHLY="price_xxx"
STRIPE_PRICE_FREE_YEARLY="price_xxx"

# Premium plan
STRIPE_PRICE_PREMIUM_MONTHLY="price_xxx"
STRIPE_PRICE_PREMIUM_YEARLY="price_xxx"

# Premium Plus plan
STRIPE_PRICE_PREMIUM_PLUS_MONTHLY="price_xxx"
STRIPE_PRICE_PREMIUM_PLUS_YEARLY="price_xxx"

# ==========================================
# OPTIONAL APIs
# ==========================================
# Tinify for image optimization
TINIFY_API_KEY="your-tinify-api-key"

# APDF for PDF generation
APDF_API_KEY="your-apdf-api-key"

# Google Sheets integration
GOOGLE_CLIENT_EMAIL="your-service-account@project.iam.gserviceaccount.com"
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour-private-key\n-----END PRIVATE KEY-----\n"
GOOGLE_SPREADSHEET_ID="your-spreadsheet-id"
```

### 4. Set Up the Database

#### Create the Database

```bash
# Using psql
createdb myapp

# Or using PostgreSQL CLI
psql -U postgres
CREATE DATABASE myapp;
\q
```

#### Run Prisma Migrations

```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database (development)
npx prisma db push

# Or create a migration (production)
npx prisma migrate dev --name init
```

#### Seed the Database (Optional)

If you have seed files:

```bash
npx prisma db seed
```

### 5. Start the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Default Credentials

After running the seed script or manually creating an admin user:

```
Email: admin@example.com
Password: admin123
```

**Important**: Change these credentials in production!

## Project Structure

```
next-shadcn-admin/
├── doc/                         # Documentation
├── prisma/
│   └── schema.prisma           # Database schema
├── public/                      # Static assets
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── (auth)/            # Auth routes (sign-in, sign-up)
│   │   ├── (dashboard)/       # Dashboard routes
│   │   ├── api/               # API routes
│   │   └── layout.tsx         # Root layout
│   ├── components/            # React components
│   │   ├── ui/               # shadcn/ui components
│   │   ├── data-table/       # Reusable data table
│   │   ├── dashboard/        # Dashboard-specific components
│   │   └── layout/           # Layout components
│   ├── config/               # Configuration files
│   ├── hooks/                # Custom React hooks
│   ├── lib/                  # Utility libraries
│   │   ├── auth/            # Authentication utilities
│   │   ├── repositories/    # Database repositories
│   │   └── utils.ts         # General utilities
│   └── types/               # TypeScript type definitions
├── .env.example              # Environment variables template
├── next.config.js            # Next.js configuration
├── tailwind.config.ts        # Tailwind CSS configuration
├── tsconfig.json            # TypeScript configuration
└── package.json             # Dependencies
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npx prisma studio` - Open Prisma Studio (database GUI)
- `npx prisma generate` - Generate Prisma Client
- `npx prisma db push` - Push schema changes to database
- `npx prisma migrate dev` - Create and run migrations

## Next Steps

1. Read the [Authentication Guide](./features/authentication.md)
2. Explore the [Feature Documentation](./features/)
3. Check the [Customization Guide](./customization.md)
4. Deploy to production using the [Deployment Guide](./deployment.md)

## Troubleshooting

See the [Troubleshooting Guide](./troubleshooting.md) for common issues and solutions.
