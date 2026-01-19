/**
 * Application Configuration
 * Central location for all app-wide settings and constants
 */

export const config = {
  app: {
    name: process.env.NEXT_PUBLIC_APP_NAME || 'My App',
    description: process.env.NEXT_PUBLIC_APP_DESCRIPTION || 'A modern Next.js application',
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  },
  resendApiKey: process.env.RESEND_API_KEY || '',
  fromEmail: process.env.EMAIL_FROM || 'noreply@myapp.com',
  baseUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development',
  databaseUrl: process.env.DATABASE_URL || '',
  stripeSecretKey: process.env.STRIPE_SECRET_KEY || '',
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
  tinifyApiKey: process.env.TINIFY_API_KEY || '',
  apdfApiKey: process.env.APDF_API_KEY || '',
  embeddingDatabaseUrl: process.env.EMBEDDING_DATABASE_URL || '',
  google: {
    clientEmail: process.env.GOOGLE_CLIENT_EMAIL || '',
    privateKey: process.env.GOOGLE_PRIVATE_KEY || '',
    spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID || '',
  },
  }

// Site configuration
export const siteConfig = {
  name: config.app.name,
  description: config.app.description,
  url: config.app.url,
}

// Public configuration (client-side safe)
export const publicConfig = {
  appName: config.app.name,
  appUrl: config.app.url,
  stripePublishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
}

// Stripe configuration
export const stripeConfig = {
  publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
  secretKey: process.env.STRIPE_SECRET_KEY || '',
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
  priceIds: {
    // Monthly plans
    freeMonthly: process.env.STRIPE_PRICE_FREE_MONTHLY || '',
    premiumMonthly: process.env.STRIPE_PRICE_PREMIUM_MONTHLY || '',
    premiumPlusMonthly: process.env.STRIPE_PRICE_PREMIUM_PLUS_MONTHLY || '',
    // Yearly plans
    freeYearly: process.env.STRIPE_PRICE_FREE_YEARLY || '',
    premiumYearly: process.env.STRIPE_PRICE_PREMIUM_YEARLY || '',
    premiumPlusYearly: process.env.STRIPE_PRICE_PREMIUM_PLUS_YEARLY || '',
  },
}

// Database configuration
export const dbConfig = {
  url: process.env.DATABASE_URL || '',
  maxConnections: parseInt(process.env.DATABASE_POOL_SIZE || '10', 10),
}

// Email configuration
export const emailConfig = {
  from: process.env.EMAIL_FROM || 'noreply@myapp.com',
  replyTo: process.env.EMAIL_REPLY_TO || 'noreply@myapp.com',
  resendApiKey: process.env.RESEND_API_KEY || '',
}

// Subscription tiers
export const SUBSCRIPTION_TIERS = {
  free: {
    name: 'Free',
    priceId: stripeConfig.priceIds.freeMonthly,
    yearlyPriceId: stripeConfig.priceIds.freeYearly,
  },
  premium: {
    name: 'Premium',
    priceId: stripeConfig.priceIds.premiumMonthly,
    yearlyPriceId: stripeConfig.priceIds.premiumYearly,
  },
  premiumPlus: {
    name: 'Premium Plus',
    priceId: stripeConfig.priceIds.premiumPlusMonthly,
    yearlyPriceId: stripeConfig.priceIds.premiumPlusYearly,
  },
}

export default config
