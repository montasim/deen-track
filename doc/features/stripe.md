# Stripe Integration

Complete guide to Stripe payment integration and subscription management.

## Overview

The template includes a complete Stripe integration for:
- Subscription management (multiple tiers)
- One-time payments
- Checkout session creation
- Webhook handling
- Customer management
- Subscription lifecycle

## Database Schema

```prisma
model User {
  id                String    @id @default(cuid())
  stripeCustomerId  String?   @unique
  subscriptions     Subscription[]
}

model Subscription {
  id                   String               @id @default(cuid())
  userId               String
  user                 User                 @relation(fields: [userId], references: [id])
  stripeSubscriptionId String?              @unique
  stripePriceId        String?
  status               SubscriptionStatus
  tier                 SubscriptionTier
  cancelAtPeriodEnd    Boolean              @default(false)
  currentPeriodStart   DateTime?
  currentPeriodEnd     DateTime?
  createdAt            DateTime             @default(now())
  updatedAt            DateTime             @updatedAt
}

enum SubscriptionTier {
  FREE
  PREMIUM
  PREMIUM_PLUS
}

enum SubscriptionStatus {
  ACTIVE
  CANCELED
  PAST_DUE
  INCOMPLETE
  INCOMPLETE_EXPIRED
  TRIALING
  UNPAID
}
```

## Configuration

### Environment Variables

```env
# Stripe Keys
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here

# Subscription Price IDs
STRIPE_PRICE_FREE_MONTHLY=price_xxx
STRIPE_PRICE_FREE_YEARLY=price_xxx
STRIPE_PRICE_PREMIUM_MONTHLY=price_xxx
STRIPE_PRICE_PREMIUM_YEARLY=price_xxx
STRIPE_PRICE_PREMIUM_PLUS_MONTHLY=price_xxx
STRIPE_PRICE_PREMIUM_PLUS_YEARLY=price_xxx
```

### Stripe Config

Located at: `src/lib/stripe/config.ts`

```typescript
export const SUBSCRIPTION_PLANS = {
  free: {
    name: 'Free',
    priceId: {
      monthly: process.env.STRIPE_PRICE_FREE_MONTHLY,
      yearly: process.env.STRIPE_PRICE_FREE_YEARLY,
    },
    features: ['Feature 1', 'Feature 2'],
  },
  premium: {
    name: 'Premium',
    priceId: {
      monthly: process.env.STRIPE_PRICE_PREMIUM_MONTHLY,
      yearly: process.env.STRIPE_PRICE_PREMIUM_YEARLY,
    },
    features: ['All Free features', 'Feature 3', 'Feature 4'],
  },
  premiumPlus: {
    name: 'Premium Plus',
    priceId: {
      monthly: process.env.STRIPE_PRICE_PREMIUM_PLUS_MONTHLY,
      yearly: process.env.STRIPE_PRICE_PREMIUM_PLUS_YEARLY,
    },
    features: ['All Premium features', 'Feature 5', 'Feature 6'],
  },
}
```

## API Endpoints

```typescript
// Create checkout session
POST /api/stripe/create-checkout-session
{
  "plan": "PREMIUM",
  "interval": "month"
}

// Get subscription status
GET /api/stripe/subscription

// Cancel subscription
POST /api/stripe/subscription/cancel

// Handle webhooks
POST /api/stripe/webhook
```

## Usage Examples

### Creating Checkout Session

```typescript
// Client-side
import { loadStripe } from '@stripe/stripe-js'

const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

async function subscribe(plan: string, interval: string) {
  const response = await fetch('/api/stripe/create-checkout-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ plan, interval }),
  })

  const { sessionId } = await response.json()
  const { error } = await stripe!.redirectToCheckout({ sessionId })

  if (error) {
    console.error('Error:', error)
  }
}
```

### Checking Subscription Status

```typescript
// Server-side
import { findSubscriptionByUserId } from '@/lib/stripe'

const subscription = await findSubscriptionByUserId(userId)

if (subscription?.status === 'ACTIVE') {
  // User has active subscription
  if (subscription.tier === 'PREMIUM_PLUS') {
    // Grant premium plus features
  }
}
```

### Handling Webhooks

```typescript
// app/api/stripe/webhook/route.ts
import { headers } from 'next/headers'
import Stripe from 'stripe'
import { handleSubscriptionUpdated } from '@/lib/stripe/webhooks'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(request: Request) {
  const body = await request.text()
  const signature = headers().get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    return Response.json({ error: 'Invalid signature' }, { status: 400 })
  }

  switch (event.type) {
    case 'customer.subscription.updated':
      await handleSubscriptionUpdated(event.data.object)
      break
    case 'customer.subscription.deleted':
      await handleSubscriptionDeleted(event.data.object)
      break
  }

  return Response.json({ received: true })
}
```

## Repository Functions

Located at: `src/lib/stripe/`

```typescript
import {
  createCheckoutSession,
  findSubscriptionByUserId,
  cancelSubscription,
  hasActivePremiumSubscription,
} from '@/lib/stripe'

// Create checkout session
const session = await createCheckoutSession({
  userId: user.id,
  userEmail: user.email,
  plan: 'PREMIUM',
  interval: 'month',
})

// Find user's subscription
const subscription = await findSubscriptionByUserId(userId)

// Cancel subscription
await cancelSubscription(subscriptionId)

// Check if user has premium
const isPremium = await hasActivePremiumSubscription(userId)
```

## Setting Up Stripe

### 1. Create Stripe Account

Go to [stripe.com](https://stripe.com) and create an account.

### 2. Get API Keys

1. Go to Dashboard → Developers → API keys
2. Copy the publishable key and secret key
3. Add to `.env` file

### 3. Create Products & Prices

#### Option A: Stripe Dashboard

1. Go to Products in Dashboard
2. Create product for each tier
3. Add prices for monthly/yearly
4. Copy price IDs to `.env`

#### Option B: Stripe CLI

```bash
# Create product
stripe products create "Premium" --description="Premium plan"

# Create prices
stripe prices create \
  --unit-amount 999 \
  --currency usd \
  --recurring-interval month \
  --product prod_xxx
```

### 4. Configure Webhook

1. Go to Dashboard → Developers → Webhooks
2. Add endpoint: `https://your-domain.com/api/stripe/webhook`
3. Select events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
4. Copy webhook secret to `.env`

### 5. Test Webhooks Locally

```bash
# Install Stripe CLI
# https://stripe.com/docs/stripe-cli

# Forward webhooks to localhost
stripe listen --forward-to localhost:3000/api/stripe/webhook

# Test events
stripe trigger checkout.session.completed
```

## Testing

### Test Cards

```
Success: 4242 4242 4242 4242
Requires authentication: 4000 0025 0000 3155
Decline: 4000 0000 0000 0002
Insufficient funds: 4000 0000 0000 9995
Expired card: 4000 0000 0000 0069
```

### Testing Checkout Flow

1. Use test mode in Stripe Dashboard
2. Use test card numbers
3. Verify webhook events are received
4. Check database for subscription creation

### Testing Webhooks

```bash
# Trigger specific events
stripe trigger checkout.session.completed
stripe trigger customer.subscription.updated
stripe trigger invoice.payment_failed
```

## Best Practices

1. **Always verify webhook signatures**
2. **Use HTTPS in production**
3. **Never expose secret keys to client**
4. **Handle webhook events idempotently**
5. **Implement proper error handling**
6. **Log all webhook events**
7. **Monitor Stripe Dashboard for issues**
8. **Test in test mode before going live**

## Troubleshooting

### Webhook Not Firing

1. Check webhook URL is correct
2. Verify webhook secret matches
3. Check Stripe Dashboard logs
4. Ensure server is accessible from internet

### Checkout Failing

1. Verify price IDs are correct
2. Check API keys match mode (test/live)
3. Ensure user is authenticated
4. Check browser console for errors

### Subscription Not Activating

1. Check webhook events are received
2. Verify webhook signature validation
3. Check database logs
4. Verify Stripe secret key is correct

## Next Steps

- [Pricing Page](./pricing.md) - Create pricing display page
- [API Reference](./api-reference.md) - Complete Stripe API documentation
- [Deployment Guide](../deployment.md) - Configure Stripe in production
