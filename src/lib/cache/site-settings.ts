/**
 * Site settings cache manager
 * Provides in-memory caching for site-wide settings
 */

import { prisma } from '@/lib/prisma'

// In-memory cache
let settingsCache: any | null = null
let cacheTimestamp: number = 0
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

/**
 * Get cached site settings (server-side)
 * Returns settings from cache if valid, otherwise fetches from database
 */
export async function getSiteSettings() {
  const now = Date.now()

  // Return cache if valid
  if (settingsCache && (now - cacheTimestamp) < CACHE_TTL) {
    console.log('[Site Settings Cache] Cache hit, returning cached settings')
    return settingsCache
  }

  console.log('[Site Settings Cache] Cache miss or expired, fetching from database')

  // Fetch from database
  const settings = await prisma.systemSettings.findFirst()

  if (!settings) {
    // Create default settings if none exist
    console.log('[Site Settings Cache] No settings found, creating defaults')
    const newSettings = await prisma.systemSettings.create({
      data: {
        siteName: 'My App',
      },
    })
    settingsCache = newSettings
  } else {
    // Ensure siteName exists (for records created before the field was added)
    if (!settings.siteName) {
      console.log('[Site Settings Cache] siteName missing, updating...')
      const updated = await prisma.systemSettings.update({
        where: { id: settings.id },
        data: { siteName: 'My App' },
      })
      settingsCache = updated
    } else {
      settingsCache = settings
    }
  }

  cacheTimestamp = now

  return settingsCache
}

/**
 * Invalidate settings cache
 * Clears in-memory cache
 */
export async function invalidateSiteSettingsCache(): Promise<void> {
  console.log('[Site Settings Cache] Invalidating cache')

  // Clear in-memory cache
  settingsCache = null
  cacheTimestamp = 0
}

/**
 * Get site name from settings
 */
export async function getSiteName(): Promise<string> {
  const settings = await getSiteSettings()
  return settings.siteName || 'My App'
}

/**
 * Get site slogan from settings
 */
export async function getSiteSlogan(): Promise<string> {
  const settings = await getSiteSettings()
  return settings.siteSlogan || ''
}
