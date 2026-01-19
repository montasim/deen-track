# Deployment Guide

Complete guide to deploying your Next.js admin application.

## Table of Contents

- [Pre-Deployment Checklist](#pre-deployment-checklist)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Vercel Deployment](#vercel-deployment)
- [Docker Deployment](#docker-deployment)
- [VPS Deployment](#vps-deployment)
- [Post-Deployment](#post-deployment)

## Pre-Deployment Checklist

Before deploying, ensure:

- [ ] All environment variables are set
- [ ] Database is configured and migrated
- [ ] Stripe webhooks are configured (if using payments)
- [ ] Email service is configured (if using emails)
- [ ] CORS settings are correct
- [ ] Authentication is working
- [ ] All secrets are secure
- [ ] Logging and monitoring are set up

## Environment Variables

### Production Environment Variables

Create a production `.env` file:

```env
# ==========================================
# APPLICATION CONFIGURATION
# ==========================================
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_APP_NAME=My App
NEXT_PUBLIC_APP_DESCRIPTION=A modern Next.js application

# ==========================================
# DATABASE
# ==========================================
DATABASE_URL=postgresql://user:password@host:5432/database
DATABASE_POOL_SIZE=20

# ==========================================
# AUTHENTICATION
# ==========================================
JWT_SECRET=your-super-secret-jwt-key-min-32-characters-long

# ==========================================
# EMAIL (RESEND)
# ==========================================
RESEND_API_KEY=re_xxxxxxxxxxxxxx
EMAIL_FROM=noreply@yourdomain.com
EMAIL_REPLY_TO=noreply@yourdomain.com

# ==========================================
# STRIPE (OPTIONAL)
# ==========================================
STRIPE_SECRET_KEY=sk_live_your_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_publishable_key

# Live Price IDs
STRIPE_PRICE_FREE_MONTHLY=price_xxx
STRIPE_PRICE_FREE_YEARLY=price_xxx
STRIPE_PRICE_PREMIUM_MONTHLY=price_xxx
STRIPE_PRICE_PREMIUM_YEARLY=price_xxx
STRIPE_PRICE_PREMIUM_PLUS_MONTHLY=price_xxx
STRIPE_PRICE_PREMIUM_PLUS_YEARLY=price_xxx
```

## Database Setup

### Production Database

1. **Choose a PostgreSQL provider**:
   - [Neon](https://neon.tech) - Serverless PostgreSQL
   - [Supabase](https://supabase.com) - PostgreSQL with extras
   - [Railway](https://railway.app) - Simple PostgreSQL hosting
   - [AWS RDS](https://aws.amazon.com/rds/) - Managed PostgreSQL
   - [DigitalOcean](https://www.digitalocean.com/products/managed-databases/) - Managed databases

2. **Get connection string**:

```env
DATABASE_URL=postgresql://user:password@host:5432/database?sslmode=require
```

3. **Run migrations**:

```bash
DATABASE_URL="your-production-url" npx prisma migrate deploy
```

4. **Generate Prisma Client**:

```bash
npx prisma generate
```

## Vercel Deployment

### Deploying to Vercel

1. **Install Vercel CLI**:

```bash
npm i -g vercel
```

2. **Login to Vercel**:

```bash
vercel login
```

3. **Deploy**:

```bash
vercel --prod
```

### Environment Variables on Vercel

1. Go to Project Settings → Environment Variables
2. Add all environment variables
3. Select appropriate environments (Production, Preview, Development)

### Vercel Postgres

If using Vercel Postgres:

1. Create a database in Vercel Dashboard
2. Install the Vercel Postgres SDK:

```bash
npm install @vercel/postgres
```

3. Update Prisma schema:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("POSTGRES_PRISMA_URL")
}
```

### Build Configuration

Add to `next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    serverActions: {
      allowedOrigins: ['your-domain.com'],
    },
  },
}

module.exports = nextConfig
```

## Docker Deployment

### Dockerfile

Create `Dockerfile` in root:

```dockerfile
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
COPY prisma ./prisma/
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

RUN npx prisma generate
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### Docker Compose

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: myapp
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://postgres:postgres@postgres:5432/myapp
      JWT_SECRET: your-jwt-secret
    depends_on:
      - postgres

volumes:
  postgres_data:
```

### Deploy with Docker

```bash
# Build and start
docker-compose up -d

# Run migrations
docker-compose exec app npx prisma migrate deploy

# View logs
docker-compose logs -f app
```

## VPS Deployment

### Deploying to a VPS (Ubuntu)

1. **Connect to VPS**:

```bash
ssh user@your-vps-ip
```

2. **Install dependencies**:

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install Nginx
sudo apt install -y nginx

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib
```

3. **Setup PostgreSQL**:

```bash
# Switch to postgres user
sudo -u postgres psql

# Create database and user
CREATE DATABASE myapp;
CREATE USER myapp WITH PASSWORD 'your-password';
GRANT ALL PRIVILEGES ON DATABASE myapp TO myapp;
\q
```

4. **Clone repository**:

```bash
cd /var/www
git clone https://your-repo-url.git myapp
cd myapp
npm install
```

5. **Configure environment**:

```bash
cp .env.example .env
nano .env
# Add your production variables
```

6. **Build and migrate**:

```bash
npx prisma generate
npx prisma migrate deploy
npm run build
```

7. **Start with PM2**:

```bash
# Create ecosystem file
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'myapp',
    script: 'node_modules/.bin/next',
    args: 'start',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}
EOF

# Start app
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

8. **Configure Nginx**:

```nginx
# /etc/nginx/sites-available/myapp
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

9. **Enable site**:

```bash
sudo ln -s /etc/nginx/sites-available/myapp /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

10. **Setup SSL with Certbot**:

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## Post-Deployment

### Health Checks

Create health check endpoint:

```typescript
// src/app/api/health/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`
    return NextResponse.json({ status: 'healthy', database: 'connected' })
  } catch (error) {
    return NextResponse.json({ status: 'unhealthy', database: 'disconnected' }, { status: 503 })
  }
}
```

### Monitoring

**Recommended tools**:
- [Vercel Analytics](https://vercel.com/analytics) - If using Vercel
- [Sentry](https://sentry.io) - Error tracking
- [LogRocket](https://logrocket.com) - Session replay
- [Datadog](https://www.datadoghq.com) - Infrastructure monitoring

### Backup Strategy

**Database backups**:

```bash
# Backup script
#!/bin/bash
BACKUP_DIR="/backups"
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump $DATABASE_URL > "$BACKUP_DIR/backup_$DATE.sql"

# Keep last 7 days
find $BACKUP_DIR -name "backup_*.sql" -mtime +7 -delete
```

**Automated backups** (cron):

```bash
# Add to crontab
0 2 * * * /path/to/backup-script.sh
```

### Performance Optimization

1. **Enable caching**:

```typescript
// next.config.js
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ['your-domain.com'],
    },
  },
  // Add caching headers
  async headers() {
    return [
      {
        source: '/:all*(svg|jpg|png|webp)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
}
```

2. **Optimize images**:

```typescript
import Image from 'next/image'

export function OptimizedImage({ src, alt }: { src: string; alt: string }) {
  return (
    <Image
      src={src}
      alt={alt}
      width={800}
      height={600}
      loading="lazy"
    />
  )
}
```

### Security Checklist

- [ ] HTTPS is enabled
- [ ] Environment variables are secure
- [ ] CORS is properly configured
- [ ] Rate limiting is enabled
- [ ] Input validation is in place
- [ ] SQL injection protection is active
- [ ] XSS protection is enabled
- [ ] CSRF tokens are used
- [ ] Secure headers are set
- [ ] Authentication is working

### Updating Production

```bash
# Pull latest changes
git pull origin main

# Install dependencies
npm install

# Run migrations
npx prisma migrate deploy

# Rebuild
npm run build

# Restart (PM2)
pm2 restart myapp

# Or (Docker)
docker-compose up -d --build
```

## Troubleshooting

### Build Failures

**Issue**: Build fails on Vercel

**Solution**:
1. Check build logs for specific errors
2. Ensure all environment variables are set
3. Verify dependencies are compatible
4. Check for TypeScript errors

### Database Connection Issues

**Issue**: Can't connect to database

**Solution**:
1. Verify DATABASE_URL is correct
2. Check database firewall settings
3. Ensure SSL is configured correctly
4. Test connection from production environment

### Environment Variables Not Working

**Issue**: Environment variables undefined

**Solution**:
1. Restart the application after adding variables
2. Check variable names match exactly
3. Verify variables are added to correct environment
4. Clear build cache and rebuild

## Next Steps

- [Getting Started](../getting-started.md) - Initial setup
- [Feature Documentation](./features/) - Explore features
- [Customization Guide](./customization.md) - Customize your app
