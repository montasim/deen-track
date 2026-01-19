# Email Campaigns

Complete guide to the email campaign management system.

## Overview

The email campaign system enables:
- Create and manage email campaigns
- HTML email templates
- Recipient management
- Campaign scheduling
- Send tracking
- Status management (draft, scheduled, sending, sent, failed)

## Database Schema

```prisma
model EmailCampaign {
  id          String             @id @default(cuid())
  name        String
  subject     String
  content     String             @db.Text
  status      CampaignStatus     @default(DRAFT)
  scheduledAt DateTime?
  sentAt      DateTime?
  createdAt   DateTime           @default(now())
  updatedAt   DateTime           @updatedAt
  recipients  EmailRecipient[]

  @@index([status])
  @@index([scheduledAt])
}

model EmailRecipient {
  id          String              @id @default(cuid())
  campaignId  String
  campaign    EmailCampaign       @relation(fields: [campaignId], references: [id], onDelete: Cascade)
  email       String
  name        String?
  status      RecipientStatus     @default(PENDING)
  sentAt      DateTime?
  openedAt    DateTime?
  clickedAt   DateTime?
  errorMessage String?
  createdAt   DateTime            @default(now())

  @@index([campaignId])
  @@index([status])
}

enum CampaignStatus {
  DRAFT
  SCHEDULED
  SENDING
  SENT
  FAILED
}

enum RecipientStatus {
  PENDING
  SENT
  OPENED
  CLICKED
  FAILED
}
```

## Email Service Provider

The template uses **Resend** for email sending. Get your API key at [resend.com](https://resend.com).

### Setup

```env
# .env
RESEND_API_KEY=re_xxxxxxxxxxxxx
EMAIL_FROM=noreply@myapp.com
EMAIL_REPLY_TO=noreply@myapp.com
```

## API Endpoints

### Admin Endpoints

```typescript
// Get all campaigns
GET /api/admin/email-campaigns

// Get campaign by ID
GET /api/admin/email-campaigns/{id}

// Create campaign
POST /api/admin/email-campaigns
{
  "name": "Welcome Email",
  "subject": "Welcome to Our Platform!",
  "content": "<h1>Welcome</h1><p>Thanks for joining...</p>",
  "recipients": [
    { "email": "user1@example.com", "name": "User One" },
    { "email": "user2@example.com", "name": "User Two" }
  ],
  "scheduledAt": "2025-01-20T10:00:00Z"
}

// Update campaign
PATCH /api/admin/email-campaigns/{id}

// Delete campaign
DELETE /api/admin/email-campaigns/{id}

// Send campaign immediately
POST /api/admin/email-campaigns/{id}/send

// Schedule campaign
POST /api/admin/email-campaigns/{id}/schedule
{
  "scheduledAt": "2025-01-20T10:00:00Z"
}

// Get campaign statistics
GET /api/admin/email-campaigns/{id}/stats

// Get campaign recipients
GET /api/admin/email-campaigns/{id}/recipients
```

## Dashboard Pages

### Email Campaign Management
Located at: `/dashboard/email-campaigns`

Features:
- List all campaigns with status indicators
- Create new campaigns
- Edit existing campaigns
- View campaign statistics
- Schedule campaigns
- Send campaigns immediately
- View recipient status

### Campaign Statistics

Track the following metrics:
- Total recipients
- Emails sent
- Emails opened
- Links clicked
- Failed deliveries

## Usage Examples

### Creating an Email Campaign

```typescript
async function createCampaign(data: {
  name: string
  subject: string
  content: string
  recipients: Array<{ email: string; name?: string }>
  scheduledAt?: string
}) {
  const response = await fetch('/api/admin/email-campaigns', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  const result = await response.json()
  if (result.success) {
    console.log('Campaign created:', result.data.campaign)
  }
}

// Example
createCampaign({
  name: 'Monthly Newsletter',
  subject: 'Your Monthly Update',
  content: `
    <div style="font-family: Arial, sans-serif;">
      <h1>Monthly Newsletter</h1>
      <p>Hello {{name}},</p>
      <p>Here's what's new this month...</p>
      <a href="https://myapp.com/updates">Read more</a>
    </div>
  `,
  recipients: [
    { email: 'user1@example.com', name: 'John' },
    { email: 'user2@example.com', name: 'Jane' },
  ],
})
```

### Sending a Campaign

```typescript
async function sendCampaign(campaignId: string) {
  const response = await fetch(`/api/admin/email-campaigns/${campaignId}/send`, {
    method: 'POST',
  })

  const result = await response.json()
  if (result.success) {
    console.log('Campaign sent!')
  }
}
```

### Scheduling a Campaign

```typescript
async function scheduleCampaign(
  campaignId: string,
  scheduledAt: Date
) {
  const response = await fetch(
    `/api/admin/email-campaigns/${campaignId}/schedule`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ scheduledAt: scheduledAt.toISOString() }),
    }
  )

  const result = await response.json()
  if (result.success) {
    console.log('Campaign scheduled')
  }
}

// Schedule for tomorrow at 10 AM
const tomorrow = new Date()
tomorrow.setDate(tomorrow.getDate() + 1)
tomorrow.setHours(10, 0, 0, 0)
scheduleCampaign('campaign-id', tomorrow)
```

### Viewing Campaign Statistics

```typescript
async function getCampaignStats(campaignId: string) {
  const response = await fetch(
    `/api/admin/email-campaigns/${campaignId}/stats`
  )
  const result = await response.json()
  return result.data.stats
}

// Returns:
// {
//   total: 1000,
//   sent: 950,
//   opened: 600,
//   clicked: 200,
//   failed: 50
// }
```

## Email Templates

### HTML Email Template

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Template</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
    <tr>
      <td style="padding: 20px 0; background-color: #f4f4f4;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="margin: 0 auto;">
          <!-- Header -->
          <tr>
            <td style="padding: 20px; background-color: #007bff; color: #ffffff; text-align: center;">
              <h1 style="margin: 0;">{{subject}}</h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 20px; background-color: #ffffff;">
              <p>Hello {{name}},</p>
              <div>{{content}}</div>

              <!-- CTA Button -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td style="border-radius: 4px; background-color: #007bff;">
                    <a href="{{link}}" style="padding: 12px 24px; color: #ffffff; text-decoration: none; display: inline-block;">
                      Learn More
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px; background-color: #f4f4f4; text-align: center; font-size: 12px; color: #666666;">
              <p>&copy; 2025 My App. All rights reserved.</p>
              <p>
                <a href="{{unsubscribe_url}}" style="color: #666666;">Unsubscribe</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
```

## Email Service Functions

Located at: `src/lib/email/resend.ts`

```typescript
import { sendEmail, sendBulkEmail } from '@/lib/email/resend'

// Send single email
await sendEmail({
  from: 'noreply@myapp.com',
  to: 'user@example.com',
  subject: 'Welcome!',
  html: '<h1>Welcome</h1><p>Thanks for joining!</p>'
})

// Send bulk emails
const emails = [
  { to: 'user1@example.com', subject: 'Hello 1', html: '<p>Content 1</p>' },
  { to: 'user2@example.com', subject: 'Hello 2', html: '<p>Content 2</p>' },
]
await sendBulkEmail(emails)
```

## Best Practices

1. **HTML Email Compatibility**: Keep email HTML simple for maximum client compatibility
2. **Responsive Design**: Test emails on mobile devices
3. **Subject Lines**: Keep subject lines under 50 characters
4. **Personalization**: Use recipient names for better engagement
5. **Plain Text Fallback**: Provide plain text version for accessibility
6. **Unsubscribe Link**: Always include an unsubscribe link
7. **Test Before Sending**: Send test emails before full campaigns
8. **Sender Reputation**: Monitor bounce rates and spam complaints
9. **Schedule Wisely**: Send emails at optimal times for your audience
10. **Compliance**: Follow CAN-SPAM and GDPR regulations

## Tracking & Analytics

### Open Tracking

```typescript
// Track email opens by including a tracking pixel
const trackingPixel = `
  <img src="${baseUrl}/api/track/open?recipientId=${recipientId}" width="1" height="1" />
`
```

### Click Tracking

```typescript
// Rewrite links to include tracking
const trackedLink = `${baseUrl}/api/track/click?recipientId=${recipientId}&url=${encodeURIComponent(originalUrl)}`
```

## Common Use Cases

### Welcome Email Series

```typescript
// Campaign 1: Immediate welcome
{
  name: 'Welcome Email',
  subject: 'Welcome to Our Platform!',
  content: '<h1>Welcome!</h1><p>Thanks for signing up...</p>',
  recipients: newUsers,
  scheduledAt: null // Send immediately
}

// Campaign 2: Day 3 follow-up
{
  name: 'Onboarding Day 3',
  subject: 'Getting Started Tips',
  content: '<h1>Tips for getting started</h1>...',
  recipients: newUsers,
  scheduledAt: getDaysFromNow(3)
}
```

### Monthly Newsletter

```typescript
{
  name: 'January 2025 Newsletter',
  subject: 'What\'s New in January',
  content: generateNewsletterContent(),
  recipients: allSubscribers,
  scheduledAt: '2025-01-15T09:00:00Z'
}
```

### Promotional Campaign

```typescript
{
  name: 'Holiday Sale',
  subject: '50% Off Everything!',
  content: generatePromoEmail(),
  recipients: customerSegment,
  scheduledAt: '2025-12-20T00:00:00Z'
}
```

## Troubleshooting

### Emails Not Sending

1. Check Resend API key is valid
2. Verify email domain is configured in Resend
3. Check recipient email addresses are valid
4. Review campaign status for error messages

### Low Open Rates

1. Improve subject lines
2. Send at optimal times
3. Segment your audience
4. A/B test different templates

### High Bounce Rates

1. Clean email list regularly
2. Use double opt-in for new subscribers
3. Remove hard bounces immediately
4. Verify email addresses before adding

## Next Steps

- [Support Tickets](./support-tickets.md) - Send ticket notifications via email
- [Site Settings](./site-settings.md) - Configure email settings
- [Deployment Guide](../deployment.md) - Set up email in production
