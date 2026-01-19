# Customization Guide

Learn how to customize and extend the admin template for your needs.

## Table of Contents

- [Styling & Theming](#styling--theming)
- [Component Customization](#component-customization)
- [Adding New Features](#adding-new-features)
- [Database Modifications](#database-modifications)
- [API Routes](#api-routes)
- [Configuration](#configuration)

## Styling & Theming

### Tailwind CSS Configuration

The template uses Tailwind CSS for styling. Configuration is in `tailwind.config.ts`:

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        // Add your custom colors
        brand: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
        },
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
export default config
```

### CSS Variables

Global CSS variables are in `src/app/globals.css`:

```css
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;

    /* Add your custom variables */
    --brand-color: 210 100% 50%;
    --sidebar-width: 280px;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --primary: 217.2 91.2% 59.8%;
    --primary-foreground: 222.2 47.4% 11.2%;
  }
}
```

### Adding Custom Fonts

1. Add font to `src/app/layout.tsx`:

```typescript
import { Inter } from 'next/font/google'
import { JetBrains_Mono } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'] })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <body>{children}</body>
    </html>
  )
}
```

2. Update Tailwind config:

```typescript
theme: {
  extend: {
    fontFamily: {
      sans: ['var(--font-inter)'],
      mono: ['var(--font-jetbrains-mono)'],
    },
  }
}
```

## Component Customization

### Modifying shadcn/ui Components

All shadcn/ui components are in `src/components/ui/`. To customize:

1. Copy the component you want to modify
2. Make your changes
3. The component is already in your codebase, so changes are immediate

Example - Custom Button:

```typescript
// src/components/ui/button.tsx
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
```

### Creating New Components

1. Create component file:

```typescript
// src/components/my-component.tsx
import { cn } from '@/lib/utils'

interface MyComponentProps {
  className?: string
  children: React.ReactNode
}

export function MyComponent({ className, children }: MyComponentProps) {
  return (
    <div className={cn('p-4 bg-white rounded-lg', className)}>
      {children}
    </div>
  )
}
```

2. Use in your app:

```typescript
import { MyComponent } from '@/components/my-component'

export default function Page() {
  return <MyComponent>Hello World</MyComponent>
}
```

## Adding New Features

### Adding a New Dashboard Page

1. Create page component:

```typescript
// src/app/dashboard/my-feature/page.tsx
import { HeaderContainer } from '@/components/ui/header-container'

export default function MyFeaturePage() {
  return (
    <>
      <HeaderContainer>
        <h1 className="text-xl font-bold">My Feature</h1>
      </HeaderContainer>
      {/* Your content */}
    </>
  )
}
```

2. Add to navigation:

```typescript
// src/components/layout/data/sidebar-data.ts
export const sidebarData = [
  // ... existing items
  {
    title: 'My Feature',
    href: '/dashboard/my-feature',
    icon: Settings,
  },
]
```

### Adding a New API Route

```typescript
// src/app/api/my-endpoint/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth/session'

export async function GET(request: NextRequest) {
  const session = await requireAuth()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Your logic here
  return NextResponse.json({ data: 'Hello World' })
}

export async function POST(request: NextRequest) {
  const body = await request.json()

  // Your logic here
  return NextResponse.json({ success: true })
}
```

## Database Modifications

### Adding a New Model

1. Update Prisma schema:

```prisma
// prisma/schema.prisma
model MyModel {
  id          String   @id @default(cuid())
  name        String
  description String?
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([userId])
}
```

2. Add relation to User model:

```prisma
model User {
  // ... existing fields
  myModels    MyModel[]
}
```

3. Create migration:

```bash
npx prisma migrate dev --name add_my_model
```

4. Generate Prisma Client:

```bash
npx prisma generate
```

### Creating Repository Functions

```typescript
// src/lib/repositories/my-model.repository.ts
import { prisma } from '@/lib/prisma'
import type { Prisma } from '@prisma/client'

export async function getMyModels(params?: {
  skip?: number
  take?: number
  where?: Prisma.MyModelWhereInput
}) {
  const { skip = 0, take = 100, where } = params || {}

  const [items, total] = await Promise.all([
    prisma.myModel.findMany({
      skip,
      take,
      where,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.myModel.count({ where }),
  ])

  return { items, total }
}

export async function getMyModelById(id: string) {
  return prisma.myModel.findUnique({
    where: { id },
  })
}

export async function createMyModel(data: {
  name: string
  description?: string
  userId: string
}) {
  return prisma.myModel.create({
    data,
  })
}

export async function updateMyModel(
  id: string,
  data: {
    name?: string
    description?: string
  }
) {
  return prisma.myModel.update({
    where: { id },
    data,
  })
}

export async function deleteMyModel(id: string) {
  return prisma.myModel.delete({
    where: { id },
  })
}
```

## Configuration

### Environment Variables

Add custom environment variables:

1. Update `.env.example`:

```env
# My Custom Feature
MY_FEATURE_API_KEY=your_api_key_here
MY_FEATURE_ENABLED=true
```

2. Access in code:

```typescript
// src/config/my-feature.ts
export const myFeatureConfig = {
  apiKey: process.env.MY_FEATURE_API_KEY || '',
  enabled: process.env.MY_FEATURE_ENABLED === 'true',
}
```

### Adding External Services

```typescript
// src/lib/external/my-service.ts
import { myFeatureConfig } from '@/config/my-feature'

export class MyService {
  private apiKey: string

  constructor() {
    this.apiKey = myFeatureConfig.apiKey
  }

  async fetchData() {
    const response = await fetch('https://api.example.com/data', {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
      },
    })
    return response.json()
  }
}

export const myService = new MyService()
```

## Advanced Customization

### Custom Hooks

```typescript
// src/hooks/use-my-feature.ts
import { useState, useEffect } from 'react'

export function useMyFeature() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      const response = await fetch('/api/my-feature')
      const result = await response.json()
      setData(result.data)
      setLoading(false)
    }

    fetchData()
  }, [])

  return { data, loading }
}
```

### Context Providers

```typescript
// src/contexts/my-feature-context.tsx
'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface MyFeatureContextValue {
  value: string
  setValue: (value: string) => void
}

const MyFeatureContext = createContext<MyFeatureContextValue | undefined>(undefined)

export function MyFeatureProvider({ children }: { children: ReactNode }) {
  const [value, setValue] = useState('')

  return (
    <MyFeatureContext.Provider value={{ value, setValue }}>
      {children}
    </MyFeatureContext.Provider>
  )
}

export function useMyFeature() {
  const context = useContext(MyFeatureContext)
  if (!context) {
    throw new Error('useMyFeature must be used within MyFeatureProvider')
  }
  return context
}
```

### Server Actions

```typescript
// src/app/actions.ts
'use server'

import { revalidatePath } from 'next/action'
import { requireAuth } from '@/lib/auth/session'

export async function myServerAction(formData: FormData) {
  const session = await requireAuth()

  if (!session) {
    return { error: 'Unauthorized' }
  }

  // Your logic here
  const value = formData.get('value') as string

  // Revalidate related paths
  revalidatePath('/dashboard/my-feature')

  return { success: true }
}
```

## Best Practices

1. **Use TypeScript** - Always type your props and return values
2. **Server Components First** - Use server components by default
3. **Client Components When Needed** - Only use 'use client' when necessary
4. **Environment Variables** - Never expose sensitive data to client
5. **Error Handling** - Always handle errors gracefully
6. **Validation** - Validate user input with Zod
7. **Security** - Always check authentication on protected routes
8. **Performance** - Use React Server Components for better performance
9. **Accessibility** - Follow WCAG guidelines
10. **Testing** - Write tests for critical functionality

## Next Steps

- [Getting Started](../getting-started.md) - Setup and installation
- [Feature Documentation](./features/) - Explore built-in features
- [Deployment Guide](../deployment.md) - Deploy your application
