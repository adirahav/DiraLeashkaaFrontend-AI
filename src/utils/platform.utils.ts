import { Capacitor } from '@capacitor/core'

export interface FooterData {
  version: string
  shareUrl: string
  moreUrl: string
  moreLabel: string
  isNative: boolean
}

// appVersion / webVersion are stored as JSON strings: [{key, value}, ...]
function extractVersionField(raw: unknown, field: string): string {
  try {
    const arr: Array<{ key: string; value: unknown }> =
      typeof raw === 'string' ? JSON.parse(raw) : (raw as Array<{ key: string; value: unknown }>)
    return String(arr.find((e) => e.key === field)?.value ?? '')
  } catch {
    return ''
  }
}

export function getFooterData(
  phrases: Record<string, string>,
  params: Record<string, unknown>,
): FooterData {
  const phrase = (key: string, fallback: string) => phrases[key] ?? fallback

  const isNative = Capacitor.isNativePlatform()

  const versionParam = isNative ? params['appVersion'] : params['webVersion']
  const versionRaw = extractVersionField(versionParam, 'lastVersion')
  const version = parseFloat(versionRaw || '1.0').toFixed(1)

  const appUrl = extractVersionField(params['appVersion'], 'url')
  const webUrl = extractVersionField(params['webVersion'], 'url')

  const shareText = isNative
    ? phrase('android_share_text', '')
    : phrase('web_share_text', '')
  const shareTargetUrl = isNative ? appUrl : webUrl
  const shareUrl = `whatsapp://send?text=${encodeURIComponent(shareText + ' ' + shareTargetUrl)}`

  const moreUrl = isNative ? webUrl : appUrl
  const moreLabel = isNative
    ? phrase('drawer_share_web', 'Also on the website')
    : phrase('drawer_share_android', 'App')

  return { version, shareUrl, moreUrl, moreLabel, isNative }
}

/** Raw `lastVersion` string from the splash params (e.g. "2.5.12"). Empty string if unavailable. */
export function getStoreVersion(params: Record<string, unknown>): string {
  const isNative = Capacitor.isNativePlatform()
  return extractVersionField(params[isNative ? 'appVersion' : 'webVersion'], 'lastVersion')
}

/** Store URL (Google Play / website) from the splash params. */
export function getStoreUrl(params: Record<string, unknown>): string {
  const isNative = Capacitor.isNativePlatform()
  return extractVersionField(params[isNative ? 'appVersion' : 'webVersion'], 'url')
}
