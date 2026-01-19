# Troubleshooting Guide

Common issues and their solutions.

## Table of Contents

- [Development Issues](#development-issues)
- [Build Issues](#build-issues)
- [Database Issues](#database-issues)
- [Authentication Issues](#authentication-issues)
- [API Issues](#api-issues)
- [Deployment Issues](#deployment-issues)
- [Performance Issues](#performance-issues)

## Development Issues

### Port Already in Use

**Error**: `Port 3000 is already in use`

**Solutions**:

```bash
# Kill process on port 3000 (Windows)
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Kill process on port 3000 (Mac/Linux)
lsof -ti:3000 | xargs kill -9

# Or use a different port
npm run dev -- -p 3001
```

### Module Not Found

**Error**: `Module not found: Can't resolve '@/components/...'`

**Solutions**:

1. Check file path is correct
2. Restart dev server:
```bash
npm run dev
```

3. Clear Next.js cache:
```bash
rm -rf .next
npm run dev
```

### Prisma Client Not Generated

**Error**: `Prisma Client is not generated`

**Solutions**:

```bash
# Generate Prisma Client
npx prisma generate

# Or reinstall dependencies
rm -rf node_modules
npm install
npx prisma generate
```

### Hot Reload Not Working

**Issue**: Changes not reflecting in browser

**Solutions**:

1. Restart dev server
2. Clear `.next` folder:
```bash
rm -rf .next
npm run dev
```

3. Check if file is in correct directory
4. Verify file has correct extension (`.tsx`, `.ts`)

## Build Issues

### Build Fails with TypeScript Errors

**Error**: TypeScript errors during build

**Solutions**:

1. Check specific error messages
2. Fix type errors in source files
3. Update type definitions:
```bash
npm install --save-dev @types/node
```

4. Temporarily disable strict mode (not recommended):
```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": false
  }
}
```

### Build Memory Error

**Error**: `JavaScript heap out of memory`

**Solutions**:

```bash
# Increase Node memory limit
NODE_OPTIONS=--max-old-space-size=8192 npm run build

# Or set in package.json
"scripts": {
  "build": "NODE_OPTIONS='--max-old-space-size=8192' next build"
}
```

### Static Generation Errors

**Error**: `Error: Static generation failed`

**Solutions**:

1. Ensure all async data fetching is properly handled
2. Add loading states for async components
3. Use dynamic imports where appropriate:
```typescript
import dynamic from 'next/dynamic'

const Component = dynamic(() => import('./Component'), {
  loading: () => <div>Loading...</div>,
})
```

## Database Issues

### Database Connection Failed

**Error**: `Can't reach database server`

**Solutions**:

1. Verify DATABASE_URL is correct
2. Check database is running
3. Ensure firewall allows connection
4. Test connection:
```bash
npx prisma db pull
```

### Migration Failed

**Error**: `Migration failed with error`

**Solutions**:

1. Check migration file for errors
2. Reset database (WARNING: deletes all data):
```bash
npx prisma migrate reset
```

3. Create new migration:
```bash
npx prisma migrate dev --name fix_migration
```

4. Or push schema without migration:
```bash
npx prisma db push
```

### Seed Data Not Loading

**Issue**: Seed script not running

**Solutions**:

1. Check seed file is correctly configured
2. Run seed manually:
```bash
npx prisma db seed
```

3. Verify seed script in package.json:
```json
{
  "prisma": {
    "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
  }
}
```

## Authentication Issues

### JWT Token Not Validating

**Error**: `Invalid token`

**Solutions**:

1. Verify JWT_SECRET is set
2. Check token hasn't expired
3. Ensure token format is correct
4. Verify token is being sent in headers:
```typescript
headers: {
  'Authorization': `Bearer ${token}`
}
```

### Session Not Persisting

**Issue**: User logged out on refresh

**Solutions**:

1. Check cookies are being set
2. Verify cookie settings:
```typescript
cookies().set('auth-token', token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 60 * 60 * 24 * 7, // 7 days
})
```

3. Check middleware isn't blocking cookies

### Auth Redirect Loop

**Error**: Infinite redirect loop

**Solutions**:

1. Check auth logic in middleware
2. Ensure public routes are accessible
3. Verify redirect paths are correct:
```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const isAuthPage = request.nextUrl.pathname.startsWith('/auth')

  if (isAuthPage && session) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}
```

## API Issues

### API Route Not Found

**Error**: `404 - API route not found`

**Solutions**:

1. Verify file path matches route
2. Check file is in `app/api/` directory
3. Ensure file is named `route.ts` (not `routes.ts`)
4. Restart dev server

### CORS Error

**Error**: `CORS policy blocked request`

**Solutions**:

1. Add CORS headers to API route:
```typescript
export async function OPTIONS(request: Request) {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}
```

2. Or use next-cors library

### Rate Limiting Issues

**Error**: `Too many requests`

**Solutions**:

1. Implement rate limiting:
```typescript
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s'),
})

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for') ?? 'anonymous'
  const { success } = await ratelimit.limit(ip)

  if (!success) {
    return new Response('Too Many Requests', { status: 429 })
  }

  // Your logic here
}
```

## Deployment Issues

### Build Works Locally but Fails on Vercel

**Error**: Build succeeds locally but fails on Vercel

**Solutions**:

1. Check environment variables are set on Vercel
2. Ensure all dependencies are listed
3. Check Node version matches:
```json
// package.json
{
  "engines": {
    "node": ">=18.0.0"
  }
}
```

4. Review build logs in Vercel dashboard

### Environment Variables Undefined

**Error**: `process.env.VARIABLE is undefined`

**Solutions**:

1. Check variable names match exactly
2. Ensure variables are added to correct environment
3. Restart deployment after adding variables
4. Use `NEXT_PUBLIC_` prefix for client-side variables

### Database Connection Timeout

**Error**: `Database connection timeout on production`

**Solutions**:

1. Check database allows external connections
2. Verify IP whitelist includes production server
3. Ensure SSL is enabled:
```env
DATABASE_URL="postgresql://user:pass@host:5432/db?sslmode=require"
```

4. Increase connection pool size:
```env
DATABASE_POOL_SIZE=20
```

## Performance Issues

### Slow Page Load

**Issue**: Pages take long to load

**Solutions**:

1. Use dynamic imports for heavy components
2. Implement code splitting
3. Optimize images:
```typescript
import Image from 'next/image'

<Image
  src="/image.jpg"
  alt="Description"
  width={800}
  height={600}
  loading="lazy"
  placeholder="blur"
/>
```

4. Enable caching:
```typescript
export const revalidate = 3600 // Revalidate every hour
```

### High Memory Usage

**Issue**: Application uses too much memory

**Solutions**:

1. Optimize database queries
2. Use pagination for large lists
3. Implement proper data fetching with React Query or SWR
4. Avoid storing large data in state

### Slow Database Queries

**Issue**: Database queries are slow

**Solutions**:

1. Add indexes to frequently queried fields:
```prisma
model User {
  id    String @id @default(cuid())
  email String @unique
  name  String

  @@index([email])
  @@index([name])
}
```

2. Use select to limit returned fields:
```typescript
const users = await prisma.user.findMany({
  select: {
    id: true,
    name: true,
  },
})
```

3. Use cursor-based pagination for large datasets

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)

## Getting Help

If you're still stuck:

1. Check GitHub Issues
2. Search Stack Overflow
3. Ask in Discord/Community
4. Review official documentation

## Next Steps

- [Getting Started](../getting-started.md) - Setup and installation
- [Feature Documentation](./features/) - Explore features
- [Deployment Guide](./deployment.md) - Deploy your application
