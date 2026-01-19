/**
 * Site settings helper functions
 * Provides convenient access to site-wide configuration values
 */

import { getSiteSettings } from '@/lib/cache/site-settings'

/**
 * Get site name with fallback
 */
export async function getSiteName(): Promise<string> {
  const settings = await getSiteSettings()
  return settings.siteName || 'My App'
}

/**
 * Get site slogan
 */
export async function getSiteSlogan(): Promise<string> {
  const settings = await getSiteSettings()
  return settings.siteSlogan || ''
}

/**
 * Get site logo URL
 */
export async function getSiteLogo(): Promise<string> {
  const settings = await getSiteSettings()
  return settings.directLogoUrl || settings.logoUrl || '/logo.svg'
}

/**
 * Get site favicon URL
 */
export async function getSiteFavicon(): Promise<string> {
  const settings = await getSiteSettings()
  return settings.directFaviconUrl || settings.faviconUrl || '/favicon.ico'
}

/**
 * Get SEO metadata object for Next.js
 */
export async function getSEOMetadata(): Promise<{
  title: string
  description: string
  keywords: string
}> {
  const settings = await getSiteSettings()
  return {
    title: settings.seoTitle || 'My App - A Modern Next.js Application',
    description: settings.seoDescription || 'A modern, production-ready application built with Next.js, React, and TypeScript.',
    keywords: settings.seoKeywords || 'nextjs, react, typescript, web application, modern web',
  }
}

/**
 * Get OG image URL
 */
export async function getOGImage(): Promise<string | null> {
  const settings = await getSiteSettings()
  return settings.directOgImageUrl || settings.ogImage || null
}

/**
 * Get support email
 */
export async function getSupportEmail(): Promise<string> {
  const settings = await getSiteSettings()
  return settings.supportEmail || 'support@myapp.com'
}

/**
 * Get contact email
 */
export async function getContactEmail(): Promise<string> {
  const settings = await getSiteSettings()
  return settings.contactEmail || settings.supportEmail || 'contact@myapp.com'
}

/**
 * Get social links array
 */
export async function getSocialLinks(): Promise<{
  twitter?: string
  github?: string
  facebook?: string
  instagram?: string
  linkedin?: string
}> {
  const settings = await getSiteSettings()
  return {
    twitter: settings.socialTwitter || undefined,
    github: settings.socialGithub || undefined,
    facebook: settings.socialFacebook || undefined,
    instagram: settings.socialInstagram || undefined,
    linkedin: settings.socialLinkedIn || undefined,
  }
}

/**
 * Get complete branding information
 */
export async function getBrandingInfo(): Promise<{
  siteName: string
  siteSlogan: string
  logoUrl: string
  faviconUrl: string
}> {
  const settings = await getSiteSettings()
  return {
    siteName: settings.siteName || 'My App',
    siteSlogan: settings.siteSlogan || '',
    logoUrl: settings.directLogoUrl || settings.logoUrl || '/logo.svg',
    faviconUrl: settings.directFaviconUrl || settings.faviconUrl || '/favicon.ico',
  }
}
