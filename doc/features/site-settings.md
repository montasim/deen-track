# Site Settings

Complete guide to the site settings management system.

## Overview

The site settings system enables:
- Dynamic site configuration
- SEO settings (meta tags, Open Graph)
- Logo and favicon management
- Social media links
- Contact information
- Feature flags
- Maintenance mode
- Custom CSS/JS injection

## Database Schema

```prisma
model SiteSettings {
  id                  String   @id @default(cuid())
  siteName            String   @default("My App")
  siteDescription     String   @db.Text
  siteUrl             String
  logoUrl             String?
  faviconUrl          String?
  metaTitle           String?
  metaDescription     String?  @db.Text
  metaKeywords        String?
  ogImage             String?

  // Contact
  contactEmail        String?
  contactPhone        String?
  contactAddress      String?  @db.Text

  // Social
  socialFacebook      String?
  socialTwitter       String?
  socialLinkedIn      String?
  socialInstagram     String?
  socialGithub        String?

  // Features
  enableBlog          Boolean  @default(true)
  enableSupport       Boolean  @default(true)
  enableRegistration  Boolean  @default(true)

  // Status
  maintenanceMode     Boolean  @default(false)
  maintenanceMessage  String?  @db.Text

  // Customization
  customCss           String?  @db.Text
  customJs            String?  @db.Text

  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt
}
```

## API Endpoints

```typescript
// Get public site settings
GET /api/site-settings

// Response
{
  "success": true,
  "data": {
    "settings": {
      "siteName": "My App",
      "siteDescription": "A modern Next.js application",
      "logoUrl": "https://example.com/logo.png",
      // ... other public settings
    }
  }
}

// Admin: Get all settings
GET /api/admin/site-settings

// Admin: Update settings
PATCH /api/admin/site-settings
{
  "siteName": "New Site Name",
  "enableBlog": false,
  "maintenanceMode": true
}
```

## Dashboard Pages

### Site Settings Management
Located at: `/dashboard/site-settings`

Features:
- General settings (name, description, URL)
- SEO settings (meta title, description, keywords)
- Logo and favicon upload
- Contact information
- Social media links
- Feature toggles
- Maintenance mode
- Custom CSS/JS injection

## Usage Examples

### Accessing Site Settings (Public)

```typescript
// app/layout.tsx
import { getSiteSettings } from '@/lib/repositories/site-settings.repository'

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const settings = await getSiteSettings()

  return (
    <html lang="en">
      <head>
        <title>{settings.metaTitle || settings.siteName}</title>
        <meta name="description" content={settings.metaDescription} />
        <meta property="og:title" content={settings.metaTitle} />
        <meta property="og:image" content={settings.ogImage} />
        {settings.customCss && (
          <style dangerouslySetInnerHTML={{ __html: settings.customCss }} />
        )}
      </head>
      <body>
        {children}
        {settings.customJs && (
          <script dangerouslySetInnerHTML={{ __html: settings.customJs }} />
        )}
      </body>
    </html>
  )
}
```

### Updating Site Settings (Admin)

```typescript
// Client-side example
async function updateSiteSettings(data: Partial<SiteSettings>) {
  const response = await fetch('/api/admin/site-settings', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  const result = await response.json()
  if (result.success) {
    console.log('Settings updated:', result.data.settings)
  }
}

// Example usage
updateSiteSettings({
  siteName: 'My Awesome App',
  enableBlog: true,
  enableRegistration: false,
  maintenanceMode: false,
})
```

## Repository Functions

Located at: `src/lib/repositories/site-settings.repository.ts`

```typescript
import { getSiteSettings, updateSiteSettings } from '@/lib/repositories/site-settings.repository'

// Get settings (public)
const settings = await getSiteSettings()

// Update settings (admin)
const updated = await updateSiteSettings({
  siteName: 'New Name',
  metaDescription: 'New description'
})
```

## Feature Flags

Control feature availability without code changes:

```typescript
// Using feature flags
const settings = await getSiteSettings()

if (settings.enableBlog) {
  // Show blog navigation
}

if (settings.enableSupport) {
  // Show support link
}

if (settings.enableRegistration) {
  // Show sign-up button
}
```

## Maintenance Mode

Temporarily disable public access:

```typescript
// middleware.ts
import { getSiteSettings } from '@/lib/repositories/site-settings.repository'
import { NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  const settings = await getSiteSettings()

  if (settings.maintenanceMode) {
    const isLoginPage = request.nextUrl.pathname.startsWith('/auth')
    const isAdmin = request.nextUrl.pathname.startsWith('/dashboard')

    if (!isLoginPage && !isAdmin) {
      return new NextResponse(settings.maintenanceMessage || 'Site under maintenance', {
        status: 503,
      })
    }
  }

  return NextResponse.next()
}
```

## SEO Optimization

### Meta Tags

```typescript
// app/layout.tsx
export async function generateMetadata() {
  const settings = await getSiteSettings()

  return {
    title: settings.metaTitle || settings.siteName,
    description: settings.metaDescription || settings.siteDescription,
    keywords: settings.metaKeywords,
    openGraph: {
      title: settings.metaTitle,
      description: settings.metaDescription,
      images: [settings.ogImage],
      url: settings.siteUrl,
    },
  }
}
```

### Structured Data

```typescript
// Add JSON-LD structured data
const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": settings.siteName,
  "url": settings.siteUrl,
  "description": settings.siteDescription,
}

<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
/>
```

## Customization

### Custom CSS

Add custom styles via site settings:

```css
/* Custom CSS field in site settings */
:root {
  --primary-color: #007bff;
  --secondary-color: #6c757d;
}

body {
  font-family: 'Custom Font', sans-serif;
}

.custom-class {
  /* Your custom styles */
}
```

### Custom JavaScript

Add custom scripts via site settings:

```javascript
// Custom JS field in site settings
console.log('Site loaded!')

// Add analytics
window.dataLayer = window.dataLayer || []
function gtag(){dataLayer.push(arguments)}

// Add custom functionality
document.addEventListener('DOMContentLoaded', function() {
  // Your custom code
})
```

## Contact Information Display

```typescript
// components/contact-info.tsx
import { getSiteSettings } from '@/lib/repositories/site-settings.repository'

export async function ContactInfo() {
  const settings = await getSiteSettings()

  return (
    <div>
      <h2>Contact Us</h2>
      {settings.contactEmail && (
        <p>Email: <a href={`mailto:${settings.contactEmail}`}>{settings.contactEmail}</a></p>
      )}
      {settings.contactPhone && (
        <p>Phone: <a href={`tel:${settings.contactPhone}`}>{settings.contactPhone}</a></p>
      )}
      {settings.contactAddress && (
        <p>Address: {settings.contactAddress}</p>
      )}
    </div>
  )
}
```

## Social Media Links

```typescript
// components/social-links.tsx
import { Facebook, Twitter, Linkedin, Instagram, Github } from 'lucide-react'
import { getSiteSettings } from '@/lib/repositories/site-settings.repository'

export async function SocialLinks() {
  const settings = await getSiteSettings()

  const links = [
    { href: settings.socialFacebook, icon: Facebook, label: 'Facebook' },
    { href: settings.socialTwitter, icon: Twitter, label: 'Twitter' },
    { href: settings.socialLinkedIn, icon: Linkedin, label: 'LinkedIn' },
    { href: settings.socialInstagram, icon: Instagram, label: 'Instagram' },
    { href: settings.socialGithub, icon: Github, label: 'GitHub' },
  ].filter(link => link.href)

  return (
    <div className="flex gap-4">
      {links.map(link => (
        <a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={link.label}
        >
          <link.icon className="h-5 w-5" />
        </a>
      ))}
    </div>
  )
}
```

## Best Practices

1. **Cache Settings**: Cache site settings for performance
2. **Default Values**: Always provide sensible defaults
3. **Validation**: Validate settings on the server side
4. **Public vs Admin**: Separate public and admin-only settings
5. **Revalidation**: Clear cache when settings are updated
6. **Type Safety**: Use TypeScript types for settings
7. **Custom Code**: Be careful with custom CSS/JS injection
8. **SEO**: Keep meta descriptions under 160 characters
9. **Images**: Use optimized images for logos and OG images
10. **Testing**: Test maintenance mode before using

## Caching Strategy

```typescript
// lib/cache/site-settings.ts
let settingsCache: SiteSettings | null = null
let cacheTime = 0
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

export async function getCachedSiteSettings(): Promise<SiteSettings> {
  const now = Date.now()

  if (settingsCache && (now - cacheTime) < CACHE_DURATION) {
    return settingsCache
  }

  settingsCache = await getSiteSettings()
  cacheTime = now
  return settingsCache
}

export function invalidateSettingsCache() {
  settingsCache = null
  cacheTime = 0
}
```

## Configuration Updates

When settings are updated, revalidate related paths:

```typescript
// app/api/admin/site-settings/route.ts
import { revalidatePath } from 'next/cache'

export async function PATCH(request: NextRequest) {
  // Update settings...

  revalidatePath('/')
  revalidatePath('/api/site-settings')

  return NextResponse.json({ success: true })
}
```

## Next Steps

- [Blog Management](./blog-management.md) - Configure blog-related settings
- [Email Campaigns](./email-campaigns.md) - Set up email-related settings
- [Customization Guide](../customization.md) - Customize the site further
