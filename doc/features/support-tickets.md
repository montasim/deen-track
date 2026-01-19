# Support Tickets

Complete guide to the support ticket management system.

## Overview

The support ticket system enables:
- User-submitted support requests
- Admin response and resolution tracking
- Priority levels (Low, Medium, High, Urgent)
- Status workflow (Open → In Progress → Waiting for User → Resolved → Closed)
- Ticket assignment
- Response history
- Resolution notes
- Category-based organization

## Database Schema

```prisma
model SupportTicket {
  id          String         @id @default(cuid())
  userId      String
  user        User           @relation(fields: [userId], references: [id])
  assignedToId String?
  assignedTo  User?          @relation("TicketAssignee", fields: [assignedToId], references: [id])
  subject     String
  description String         @db.Text
  category    String
  priority    TicketPriority @default(MEDIUM)
  status      TicketStatus   @default(OPEN)
  resolution  String?        @db.Text
  resolvedAt  DateTime?
  closedAt    DateTime?
  createdAt   DateTime       @default(now())
  updatedAt   DateTime       @updatedAt
  responses   TicketResponse[]

  @@index([userId])
  @@index([assignedToId])
  @@index([status])
  @@index([priority])
}

model TicketResponse {
  id          String   @id @default(cuid())
  ticketId    String
  ticket      SupportTicket @relation(fields: [ticketId], references: [id], onDelete: Cascade)
  senderId    String
  sender      User     @relation(fields: [senderId], references: [id])
  isFromAdmin Boolean  @default(false)
  message     String   @db.Text
  attachments Json?
  createdAt   DateTime @default(now())

  @@index([ticketId])
  @@index([senderId])
}

enum TicketPriority {
  LOW
  MEDIUM
  HIGH
  URGENT
}

enum TicketStatus {
  OPEN
  IN_PROGRESS
  WAITING_FOR_USER
  RESOLVED
  CLOSED
}
```

## Ticket Status Workflow

```
┌─────────┐
│  OPEN   │
└────┬────┘
     │
     ▼
┌─────────────┐     ┌──────────────────┐
│ IN_PROGRESS │◄────┤ WAITING_FOR_USER │
└──────┬──────┘     └──────────────────┘
       │
       ▼
  ┌─────────┐     ┌───────┐
  │ RESOLVED│────►│ CLOSED│
  └─────────┘     └───────┘
```

### Status Descriptions

- **OPEN**: New ticket, not yet assigned
- **IN_PROGRESS**: Ticket is being worked on
- **WAITING_FOR_USER**: Waiting for user response
- **RESOLVED**: Issue resolved, awaiting confirmation
- **CLOSED**: Ticket is closed (no further action needed)

## Priority Levels

| Priority | Description | Response Time |
|----------|-------------|---------------|
| LOW      | Minor issues, general inquiries | 48 hours |
| MEDIUM   | Standard issues | 24 hours |
| HIGH     | Important issues affecting usage | 8 hours |
| URGENT   | Critical issues, system down | 2 hours |

## API Endpoints

### User Endpoints

```typescript
// Get user's tickets
GET /api/support-tickets

// Get ticket by ID
GET /api/support-tickets/{id}

// Create ticket
POST /api/support-tickets
{
  "subject": "Issue with login",
  "description": "I cannot log in to my account...",
  "category": "technical",
  "priority": "HIGH"
}

// Add response
POST /api/support-tickets/{id}/respond
{
  "message": "Thank you for the update..."
}
```

### Admin Endpoints

```typescript
// Get all tickets (with filters)
GET /api/admin/support-tickets?status=open&priority=high

// Get ticket by ID
GET /api/admin/support-tickets/{id}

// Get ticket statistics
GET /api/admin/support-tickets/stats

// Update ticket
PATCH /api/admin/support-tickets/{id}
{
  "status": "IN_PROGRESS",
  "priority": "HIGH",
  "assignedToId": "admin-id"
}

// Respond to ticket
POST /api/admin/support-tickets/{id}/respond
{
  "message": "We're looking into this issue..."
}

// Close ticket
PATCH /api/admin/support-tickets/{id}/close
{
  "resolution": "Issue resolved by updating user permissions."
}
```

## Dashboard Pages

### Admin Support Tickets Page
Located at: `/dashboard/support-tickets`

Features:
- **Statistics Dashboard**: Shows total, open, in progress, waiting, and resolved tickets
- **Status Filtering**: Filter tickets by status
- **Priority Badges**: Visual indicators for priority levels
- **Ticket List**: Shows all tickets with key information
- **Detail Panel**: View ticket details and conversation history
- **Response System**: Admin can respond to tickets
- **Status Management**: Update ticket status with dropdown
- **Assignment**: Assign tickets to yourself or other admins

### Ticket Categories

Supported categories:
- `technical` - Technical issues
- `billing` - Billing and payment issues
- `feature` - Feature requests
- `bug` - Bug reports
- `other` - Other inquiries

## Usage Examples

### Creating a Support Ticket (User)

```typescript
// Client-side example
async function createTicket(data: {
  subject: string
  description: string
  category: string
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
}) {
  const response = await fetch('/api/support-tickets', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  const result = await response.json()
  if (result.success) {
    console.log('Ticket created:', result.data.ticket)
  }
}
```

### Responding to a Ticket (Admin)

```typescript
async function respondToTicket(ticketId: string, message: string) {
  const response = await fetch(`/api/admin/support-tickets/${ticketId}/respond`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  })

  const result = await response.json()
  if (result.success) {
    console.log('Response sent')
  }
}
```

### Updating Ticket Status

```typescript
async function updateTicketStatus(
  ticketId: string,
  status: 'OPEN' | 'IN_PROGRESS' | 'WAITING_FOR_USER' | 'RESOLVED' | 'CLOSED',
  resolution?: string
) {
  const response = await fetch(`/api/admin/support-tickets/${ticketId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status, resolution }),
  })

  const result = await response.json()
  if (result.success) {
    console.log('Status updated')
  }
}
```

## Repository Functions

Located at: `src/lib/support/support.repository.ts`

```typescript
import {
  getTickets,
  getTicketById,
  createTicket,
  updateTicket,
  addResponse,
  getTicketStats
} from '@/lib/support/support.repository'

// Get tickets with filters
const { tickets, total } = await getTickets({
  status: 'OPEN',
  priority: 'HIGH',
  skip: 0,
  take: 20
})

// Get ticket by ID
const ticket = await getTicketById('ticket-id')

// Create ticket
const newTicket = await createTicket({
  userId: 'user-id',
  userEmail: 'user@example.com',
  userName: 'John Doe',
  subject: 'Login issue',
  description: 'I cannot log in...',
  category: 'technical',
  priority: 'HIGH'
})

// Update ticket status
const updated = await updateTicket('ticket-id', {
  status: 'IN_PROGRESS',
  assignedToId: 'admin-id'
})

// Add response
const response = await addResponse({
  ticketId: 'ticket-id',
  senderId: 'admin-id',
  senderRole: 'ADMIN',
  isFromAdmin: true,
  message: 'We are looking into this...'
})

// Get statistics
const stats = await getTicketStats()
// Returns: { open, inProgress, resolved, closed, total }
```

## Email Notifications

The system can send email notifications for:

1. **Ticket Created**: Notify admins when user creates a ticket
2. **Admin Response**: Notify user when admin responds
3. **Status Change**: Notify user of status updates
4. **Ticket Closed**: Notify user when ticket is closed

Example email notification setup:

```typescript
// lib/email/ticket-emails.ts
export async function sendTicketCreatedEmail(ticket: SupportTicket) {
  await resend.emails.send({
    from: 'support@myapp.com',
    to: 'admin@myapp.com',
    subject: `New Support Ticket: ${ticket.subject}`,
    html: `
      <h2>New Support Ticket</h2>
      <p><strong>From:</strong> ${ticket.userEmail}</p>
      <p><strong>Category:</strong> ${ticket.category}</p>
      <p><strong>Priority:</strong> ${ticket.priority}</p>
      <p><strong>Subject:</strong> ${ticket.subject}</p>
      <p>${ticket.description}</p>
    `
  })
}
```

## Best Practices

1. **Response Time**: Respond to tickets based on priority level
2. **Status Updates**: Keep status updated to reflect current state
3. **Resolution Notes**: Always add resolution notes when closing tickets
4. **Professional Communication**: Maintain professional and helpful tone
5. **Categorization**: Use appropriate categories for better tracking
6. **Assignment**: Assign tickets to specific team members for accountability
7. **Follow-up**: Check back on tickets marked as "Waiting for User"

## UI Features

### Admin Panel Features
Located at: `/dashboard/support-tickets`

The admin panel includes:
- **Real-time Statistics**: Dashboard with ticket counts by status
- **Color-coded Badges**:
  - Priority: Gray (Low), Blue (Medium), Orange (High), Red (Urgent)
  - Status: Blue (Open), Yellow (In Progress), Purple (Waiting for User), Green (Resolved), Gray (Closed)
- **Ticket List**: Sortable list with quick preview
- **Detail View**: Full conversation history
- **Quick Response**: Textarea for admin responses
- **Status Dropdown**: Easy status updates
- **Keyboard Shortcut**: Press Enter to send response (Shift+Enter for new line)

### User-Facing Features
- Create new tickets with category and priority
- View all personal tickets
- Respond to admin messages
- Track ticket status

## Next Steps

- [Email Campaigns](./email-campaigns.md) - Set up email notifications
- [Authentication Guide](./authentication.md) - Configure permissions
- [Site Settings](./site-settings.md) - Configure support email settings
