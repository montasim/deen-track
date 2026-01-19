# Notices System

Complete guide to the notices and announcements system.

## Overview

The notices system enables:
- Site-wide announcements
- Time-restricted notices (valid from/to dates)
- Priority ordering
- Active/inactive toggle
- Rich text content support
- Multi-notice display

## Database Schema

```prisma
model Notice {
  id          String   @id @default(cuid())
  title       String
  content     String   @db.Text
  order       Int      @default(0)
  isActive    Boolean  @default(true)
  validFrom   DateTime?
  validTo     DateTime?
  entryById   String
  entryBy     User     @relation(fields: [entryById], references: [id])
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([isActive])
  @@index([order])
}
```

## API Endpoints

### Public Endpoints

```typescript
// Get active notices (for display on frontend)
GET /api/notices/active

// Response
{
  "success": true,
  "data": {
    "notices": [
      {
        "id": "notice-id",
        "title": "Scheduled Maintenance",
        "content": "<p>We will be performing maintenance...</p>",
        "order": 1
      }
    ]
  }
}
```

### Admin Endpoints

```typescript
// Get all notices (including inactive)
GET /api/admin/notices

// Get notice by ID
GET /api/admin/notices/{id}

// Create notice
POST /api/admin/notices
{
  "title": "Scheduled Maintenance",
  "content": "<p>We will be performing maintenance on Jan 15th from 2 AM to 4 AM EST.</p>",
  "order": 1,
  "isActive": true,
  "validFrom": "2025-01-10T00:00:00Z",
  "validTo": "2025-01-15T23:59:59Z"
}

// Update notice
PATCH /api/admin/notices/{id}
{
  "title": "Updated Title",
  "isActive": false
}

// Delete notice
DELETE /api/admin/notices/{id}

// Reorder notices
PATCH /api/admin/notices/reorder
{
  "notices": [
    { "id": "notice-1", "order": 1 },
    { "id": "notice-2", "order": 2 }
  ]
}
```

## Dashboard Pages

### Notice Management
Located at: `/dashboard/notices`

Features:
- List all notices with status indicators
- Create, edit, delete notices
- Toggle active/inactive status
- Reorder notices with drag-and-drop or buttons
- Set validity dates (optional)
- Rich text content support

## Usage Examples

### Creating a Notice

```typescript
async function createNotice(data: {
  title: string
  content: string
  order: number
  isActive?: boolean
  validFrom?: string
  validTo?: string
}) {
  const response = await fetch('/api/admin/notices', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  const result = await response.json()
  if (result.success) {
    console.log('Notice created:', result.data.notice)
  }
}

// Example
createNotice({
  title: 'New Feature Released',
  content: '<p>Check out our new dashboard analytics feature!</p>',
  order: 1,
  isActive: true
})
```

### Displaying Active Notices on Frontend

```typescript
// components/notice-banner.tsx
'use client'

import { useEffect, useState } from 'react'
import { Notice } from '@prisma/client'
import { X } from 'lucide-react'

export function NoticeBanner() {
  const [notices, setNotices] = useState<Notice[]>([])
  const [dismissed, setDismissed] = useState<string[]>([])

  useEffect(() => {
    fetch('/api/notices/active')
      .then(res => res.json())
      .then(result => setNotices(result.data.notices || []))
  }, [])

  const dismiss = (id: string) => {
    setDismissed([...dismissed, id])
  }

  return (
    <div className="space-y-2">
      {notices
        .filter(notice => !dismissed.includes(notice.id))
        .map(notice => (
          <div
            key={notice.id}
            className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg flex items-start gap-3"
          >
            <div className="flex-1">
              <h3 className="font-semibold">{notice.title}</h3>
              <div dangerouslySetInnerHTML={{ __html: notice.content }} />
            </div>
            <button
              onClick={() => dismiss(notice.id)}
              className="text-blue-600 hover:text-blue-800"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        ))}
    </div>
  )
}
```

### Using Notice Data Table

```typescript
// Dashboard notices list
import { DataTable } from '@/components/data-table/data-table'

const columns = [
  { key: 'title', label: 'Title' },
  { key: 'content', label: 'Content' },
  { key: 'order', label: 'Order' },
  { key: 'isActive', label: 'Active' },
  { key: 'validFrom', label: 'Valid From' },
  { key: 'validTo', label: 'Valid To' },
]

export default function NoticesPage() {
  const [notices, setNotices] = useState([])

  useEffect(() => {
    fetch('/api/admin/notices')
      .then(res => res.json())
      .then(result => setNotices(result.data.notices))
  }, [])

  return (
    <DataTable
      columns={columns}
      data={notices}
      // ... other props
    />
  )
}
```

## Repository Functions

Located at: `src/lib/repositories/notice.repository.ts`

```typescript
import {
  getNotices,
  getNoticeById,
  getActiveNotices,
  createNotice,
  updateNotice,
  deleteNotice
} from '@/lib/repositories/notice.repository'

// Get all notices (admin)
const { notices, total } = await getNotices({
  skip: 0,
  take: 100,
  includeInactive: true
})

// Get active notices (public)
const activeNotices = await getActiveNotices()

// Create notice
const newNotice = await createNotice({
  title: 'Maintenance Notice',
  content: 'System maintenance scheduled...',
  order: 1,
  isActive: true,
  entryById: 'user-id'
})

// Update notice
const updated = await updateNotice('notice-id', {
  isActive: false,
  order: 2
})

// Delete notice
await deleteNotice('notice-id')
```

## Time-Restricted Notices

Notices can be set to display only during specific time periods:

```typescript
// Notice that displays from Jan 10 to Jan 15, 2025
await createNotice({
  title: 'New Year Sale',
  content: '<p>50% off everything!</p>',
  validFrom: new Date('2025-01-10T00:00:00Z'),
  validTo: new Date('2025-01-15T23:59:59Z'),
  isActive: true,
  order: 1,
  entryById: 'admin-id'
})
```

The `getActiveNotices()` function automatically checks:
- `isActive` is true
- Current date is after `validFrom` (if set)
- Current date is before `validTo` (if set)

## Ordering System

Notices are displayed in order of their `order` field (ascending):

```typescript
// Display order: 1, 2, 3
await createNotice({ title: 'First', order: 1, ... })
await createNotice({ title: 'Second', order: 2, ... })
await createNotice({ title: 'Third', order: 3, ... })
```

## Best Practices

1. **Keep it Brief**: Notice content should be concise and to the point
2. **Use HTML Sparingly**: Simple HTML tags like `<p>`, `<strong>`, `<em>` work best
3. **Clear Titles**: Use descriptive, attention-grabbing titles
4. **Set Validity Dates**: Use time restrictions for temporary announcements
5. **Order Matters**: Put important notices first (lower order number)
6. **Inactive Old Notices**: Deactivate notices when no longer relevant
7. **Rich Content**: Use HTML for links, formatting, and emphasis

## Common Use Cases

### Scheduled Maintenance Notice

```typescript
{
  title: 'Scheduled Maintenance',
  content: '<p>We will be performing system maintenance on <strong>Sunday, Jan 15th</strong> from <strong>2 AM to 4 AM EST</strong>. The site may be temporarily unavailable during this time.</p>',
  validFrom: '2025-01-10T00:00:00Z',
  validTo: '2025-01-16T00:00:00Z',
  isActive: true,
  order: 1
}
```

### Feature Announcement

```typescript
{
  title: '🎉 New Feature Released',
  content: '<p>Check out our new <a href="/analytics">Analytics Dashboard</a>! View detailed insights about your content performance.</p>',
  isActive: true,
  order: 2
}
```

### Urgent Alert

```typescript
{
  title: '⚠️ Important: Security Update',
  content: '<p>Please update your password to ensure account security. <a href="/settings/security">Update now</a></p>',
  isActive: true,
  order: 0  // Highest priority
}
```

## Integration Examples

### Display in Layout

```typescript
// app/layout.tsx
import { NoticeBanner } from '@/components/notice-banner'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <NoticeBanner />
        {children}
      </body>
    </html>
  )
}
```

### Display in Dashboard

```typescript
// app/dashboard/layout.tsx
import { NoticeBanner } from '@/components/notice-banner'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <NoticeBanner />
      <DashboardHeader />
      {children}
    </div>
  )
}
```

## Next Steps

- [Site Settings](./site-settings.md) - Configure notice-related settings
- [Authentication Guide](./authentication.md) - Configure admin permissions
- [Customization Guide](../customization.md) - Customize notice display styles
