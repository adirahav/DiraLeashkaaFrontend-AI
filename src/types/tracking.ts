export interface TrackerRecord {
  uuid: string
  userId: string
  email?: string
  createdAt: string
  endedAt: string | null
  status: 'drop' | 'complete' | 'in_progress'
  stoppedAt: string
  platform: string
  version: string
  duration?: number        // seconds, provided by backend
  totalPages?: number      // unique pages visited, provided by backend
  events?: TrackerEvent[]  // present in list but always empty; populated via separate GET
}

export interface TrackerEvent {
  type: 'click' | 'focus' | 'blur' | 'scroll' | 'idle' | 'navigation' | 'api'
  tag: 'UI' | 'NAV' | 'SPLASH' | 'SIGNUP' | 'LOGIN' | 'PROPERTY' | 'ERROR'
  action: string
  page: string
  timestamp: string
  meta?: Record<string, unknown>
}
