# Authentication & Authorization

Complete guide to the authentication and authorization system.

## Overview

The admin template uses a custom JWT-based authentication system with role-based access control (RBAC). Key features:

- JWT (JSON Web Token) based authentication
- Role-based access control (USER, ADMIN, SUPER_ADMIN)
- Protected routes and API endpoints
- Session management
- Password hashing with bcrypt
- Secure token validation

## User Roles

```typescript
enum UserRole {
  USER = 'USER',           // Regular user
  ADMIN = 'ADMIN',         // Admin with limited access
  SUPER_ADMIN = 'SUPER_ADMIN'  // Full system access
}
```

### Role Permissions

| Feature | USER | ADMIN | SUPER_ADMIN |
|---------|------|-------|-------------|
| View content | ✅ | ✅ | ✅ |
| Create support tickets | ✅ | ✅ | ✅ |
| Access dashboard | ❌ | ✅ | ✅ |
| Manage blog posts | ❌ | ✅ | ✅ |
| Manage users | ❌ | ❌ | ✅ |
| Manage site settings | ❌ | ❌ | ✅ |
| Manage system logs | ❌ | ❌ | ✅ |

## Authentication Flow

```
┌─────────────┐
│  Sign In    │
└──────┬──────┘
       │
       ▼
┌─────────────┐     ┌─────────────┐
│ Credentials │────►│  Validate   │
└─────────────┘     └──────┬──────┘
                          │
                          ▼
                   ┌─────────────┐
                   │ Generate JWT│
                   └──────┬──────┘
                          │
                          ▼
                   ┌─────────────┐
                   │   Set Cookie│
                   └──────┬──────┘
                          │
                          ▼
                   ┌─────────────┐
                   │  Redirect   │
                   └─────────────┘
```

## Session Management

### JWT Token Structure

```typescript
interface JWTPayload {
  userId: string
  email: string
  name: string
  role: string
  iat: number  // Issued at
  exp: number  // Expiration
}
```

### Session Helper Functions

Located at: `src/lib/auth/session.ts`

```typescript
import { requireAuth, requireAdmin, optionalAuth } from '@/lib/auth/session'

// Get current user session (throws if not authenticated)
const session = await requireAuth()

// Get current user session (returns null if not authenticated)
const session = await optionalAuth()

// Require admin role
const adminSession = await requireAdmin()

// Require specific role
const session = await requireAuth('SUPER_ADMIN')
```

## Protecting Routes

### Server Components (App Router)

```typescript
// app/dashboard/page.tsx
import { requireAuth } from '@/lib/auth/session'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const session = await requireAuth()

  if (!session) {
    redirect('/auth/sign-in')
  }

  return (
    <div>
      <h1>Welcome, {session.name}!</h1>
    </div>
  )
}
```

### Server Actions

```typescript
// app/actions.ts
'use server'

import { requireAuth } from '@/lib/auth/session'
import { revalidatePath } from 'next/cache'

export async function updateProfile(data: FormData) {
  const session = await requireAuth()

  // User is authenticated, proceed with action
  const userId = session.userId

  // Update user profile...

  revalidatePath('/dashboard/profile')
}
```

### API Routes

```typescript
// app/api/user/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth/session'

export async function GET(request: NextRequest) {
  const session = await requireAuth()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  return NextResponse.json({ user: session })
}
```

## Role-Based Access Control

### Checking User Roles

```typescript
// lib/auth/authorization.ts
import { UserRole } from '@prisma/client'

export function hasRole(userRole: UserRole, requiredRole: UserRole): boolean {
  const roleHierarchy = {
    [UserRole.USER]: 1,
    [UserRole.ADMIN]: 2,
    [UserRole.SUPER_ADMIN]: 3,
  }

  return roleHierarchy[userRole] >= roleHierarchy[requiredRole]
}

// Usage
const session = await requireAuth()
if (!hasRole(session.role as UserRole, UserRole.ADMIN)) {
  redirect('/unauthorized')
}
```

### Middleware Protection

```typescript
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from '@/lib/auth/jwt'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value

  if (!token) {
    return NextResponse.redirect(new URL('/auth/sign-in', request.url))
  }

  try {
    const payload = verifyToken(token)
    const response = NextResponse.next()
    response.headers.set('x-user-id', payload.userId)
    response.headers.set('x-user-role', payload.role)
    return response
  } catch (error) {
    return NextResponse.redirect(new URL('/auth/sign-in', request.url))
  }
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*'],
}
```

## Client-Side Authentication

### Using Auth Context

```typescript
// 'use client'
import { useAuth } from '@/hooks/use-auth'

export default function ProfileForm() {
  const { user, loading, signOut } = useAuth()

  if (loading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return <div>Please sign in</div>
  }

  return (
    <div>
      <h1>Welcome, {user.name}</h1>
      <button onClick={signOut}>Sign Out</button>
    </div>
  )
}
```

### Protecting Client Components

```typescript
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'

export default function AdminPanel() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && (!user || user.role !== 'ADMIN')) {
      router.push('/unauthorized')
    }
  }, [user, loading, router])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!user || user.role !== 'ADMIN') {
    return null
  }

  return <div>Admin Panel Content</div>
}
```

## Authentication API Endpoints

### Sign Up

```typescript
POST /api/auth/sign-up

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}

Response:
{
  "success": true,
  "message": "Account created successfully",
  "data": {
    "user": { "id": "...", "name": "...", "email": "..." }
  }
}
```

### Sign In

```typescript
POST /api/auth/sign-in

{
  "email": "john@example.com",
  "password": "securepassword123"
}

Response:
{
  "success": true,
  "message": "Signed in successfully",
  "data": {
    "user": { "id": "...", "name": "...", "email": "...", "role": "USER" }
  }
}
```

### Sign Out

```typescript
POST /api/auth/sign-out

Response:
{
  "success": true,
  "message": "Signed out successfully"
}
```

### Get Current Session

```typescript
GET /api/auth/session

Response:
{
  "success": true,
  "data": {
    "user": {
      "id": "...",
      "name": "...",
      "email": "...",
      "role": "USER"
    }
  }
}
```

## Best Practices

1. **Always Validate on Server**: Never trust client-side authentication
2. **Use Server Components**: Leverage Next.js 15 server components for secure data fetching
3. **HTTPS Only**: Always use HTTPS in production to protect tokens
4. **Secure Token Storage**: Store JWT tokens in HTTP-only cookies
5. **Short Token Expiration**: Set reasonable token expiration times
6. **Role Checks**: Verify roles before performing sensitive operations
7. **Log Out**: Properly implement sign-out to invalidate tokens

## Security Considerations

### Password Requirements

```typescript
// lib/auth/password.ts
export function validatePassword(password: string): {
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters')
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number')
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}
```

### Token Expiration

```typescript
// lib/auth/jwt.ts
import jwt from 'jsonwebtoken'

const TOKEN_EXPIRY = '7d' // 7 days

export function generateToken(payload: any): string {
  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: TOKEN_EXPIRY,
  })
}
```

### Environment Variables

```env
# .env
JWT_SECRET=your-super-secret-jwt-key-min-32-characters-long
```

**Important**: Use a strong, random JWT secret in production!

## Common Patterns

### Protected Page with Role Check

```typescript
import { requireAuth } from '@/lib/auth/session'
import { redirect } from 'next/navigation'
import { UserRole } from '@prisma/client'

export default async function AdminPage() {
  const session = await requireAuth()

  if (!session || session.role !== UserRole.ADMIN) {
    redirect('/unauthorized')
  }

  return <div>Admin Content</div>
}
```

### Conditional Rendering Based on Role

```typescript
import { requireAuth } from '@/lib/auth/session'
import { AdminPanel } from '@/components/admin-panel'
import { UserPanel } from '@/components/user-panel'

export default async function DashboardPage() {
  const session = await requireAuth()

  return (
    <div>
      {session.role === 'ADMIN' ? <AdminPanel /> : <UserPanel />}
    </div>
  )
}
```

### API Route with Role Check

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth/session'
import { UserRole } from '@prisma/client'

export async function DELETE(request: NextRequest) {
  const session = await requireAuth()

  if (!session || session.role !== UserRole.SUPER_ADMIN) {
    return NextResponse.json(
      { error: 'Insufficient permissions' },
      { status: 403 }
    )
  }

  // Proceed with deletion...
}
```

## Next Steps

- [Site Settings](./site-settings.md) - Configure authentication settings
- [API Reference](./api-reference.md) - Complete authentication API documentation
- [Troubleshooting](../troubleshooting.md) - Common authentication issues
