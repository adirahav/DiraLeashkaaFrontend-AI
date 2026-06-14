import { httpService } from './http.service'
import { TrackerRecord, TrackerEvent } from '../types/tracking'

interface InsertTrackerPayload {
  version: string
  createdAt: string
  status: 'in_progress' | 'drop' | 'complete'
}

export interface TrackerEventPayload {
  type: 'click' | 'focus' | 'blur' | 'scroll' | 'idle' | 'navigation' | 'api'
  tag: 'UI' | 'NAV' | 'SPLASH' | 'SIGNUP' | 'LOGIN' | 'PROPERTY' | 'ERROR'
  action: string
  page: string
  timestamp: string
  meta?: Record<string, unknown>
}

export const trackerService = {
  async insertTracker(payload: InsertTrackerPayload): Promise<string | null> {
    try {
      const res = await httpService.post<{ success: boolean; uuid?: string; _id?: string }>('/tracker', payload)
      return res.uuid ?? res._id ?? null
    } catch {
      console.log('[TRACKER] Event failed to send')
      return null
    }
  },

  insertTrackerEvent(trackerUUID: string, payload: TrackerEventPayload): void {
    httpService
      .post(`/tracker/${trackerUUID}/event`, payload)
      .catch(() => console.log('[TRACKER] Event failed to send'))
  },

  linkTrackerToUser(trackerUUID: string): void {
    httpService
      .patch(`/tracker/${trackerUUID}/user`, {})
      .catch(() => console.log('[TRACKER] Event failed to send'))
  },

  patchTracker(trackerUUID: string, payload: { status: 'in_progress' | 'drop' | 'complete'; endedAt: string }): void {
    httpService
      .patch(`/tracker/${trackerUUID}/status`, payload)
      .catch(() => console.log('[TRACKER] Event failed to send'))
  },

  async getTrackers(page: number, pageSize: number): Promise<{
    trackers: TrackerRecord[]
    total: number
    stats: { total: number; completed: number; dropped: number; totalEvents: number }
  }> {
    return httpService.get('/tracker', { page, pageSize })
  },

  async getTrackerEvents(trackerUUID: string): Promise<TrackerEvent[]> {
    const res = await httpService.get<{ events: TrackerEvent[] }>(`/tracker/${trackerUUID}/event`)
    return res.events ?? []
  },
}
