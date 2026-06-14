import { AlertCircle, MousePointerClick, Smartphone, Clock, Calendar } from 'lucide-react'
import { TrackerRecord, TrackerEvent } from '../../types/tracking'

const TAG_COLORS: Record<string, string> = {
  SPLASH:   'bg-blue-50 text-blue-700 border-blue-100',
  SIGNUP:   'bg-amber-50 text-amber-700 border-amber-100',
  LOGIN:    'bg-purple-50 text-purple-700 border-purple-100',
  NAV:      'bg-emerald-50 text-emerald-700 border-emerald-100',
  PROPERTY: 'bg-rose-50 text-rose-700 border-rose-100',
  UI:       'bg-slate-100 text-slate-700 border-slate-200',
  ERROR:    'bg-red-50 text-red-700 border-red-100',
}

const DOT_COLORS: Record<string, string> = {
  SPLASH:   'bg-blue-500',
  NAV:      'bg-emerald-500',
  SIGNUP:   'bg-amber-500',
  LOGIN:    'bg-purple-500',
  PROPERTY: 'bg-rose-500',
  ERROR:    'bg-red-500',
  UI:       'bg-slate-400',
}

function tagStyle(tag: string) {
  return TAG_COLORS[tag] ?? 'bg-slate-100 text-slate-600 border-slate-200'
}

function dotColor(tag: string) {
  return DOT_COLORS[tag] ?? 'bg-slate-400'
}

function formatDuration(createdAt: string, endedAt: string | null): string {
  if (!endedAt) return '—'
  const ms = new Date(endedAt).getTime() - new Date(createdAt).getTime()
  if (ms <= 0) return '—'
  const totalSec = Math.floor(ms / 1000)
  const min = Math.floor(totalSec / 60)
  const sec = totalSec % 60
  return `${min}:${sec.toString().padStart(2, '0')}`
}

function formatTimestamp(iso: string): string {
  try {
    const d = new Date(iso)
    return d.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
  } catch {
    return iso
  }
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('he-IL')
  } catch {
    return iso
  }
}

interface TrackerTimelineProps {
  tracker: TrackerRecord
  events: TrackerEvent[]
  isLoading: boolean
}

export const TrackerTimeline = ({ tracker, events, isLoading }: TrackerTimelineProps) => {
  const uniquePages = tracker.totalPages ?? new Set(events.map((e) => e.page)).size
  const duration = tracker.duration != null
    ? `${Math.floor(tracker.duration / 60)}:${String(tracker.duration % 60).padStart(2, '0')}`
    : formatDuration(tracker.createdAt, tracker.endedAt)

  if (isLoading) {
    return (
      <div className="p-6 space-y-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex gap-3 animate-pulse">
            <div className="w-16 h-4 bg-slate-200 rounded" />
            <div className="flex-1 h-4 bg-slate-200 rounded" />
            <div className="w-24 h-4 bg-slate-200 rounded" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="p-6 sm:p-8" dir="rtl">
      {/* Stat cards */}
      <div className="flex flex-wrap gap-4 items-center justify-start mb-6">
        <div className="bg-white border border-slate-100 rounded-xl px-4 py-2 flex items-center gap-2 shadow-sm">
          <MousePointerClick size={14} className="text-indigo-500" />
          <span className="text-[11px] font-bold text-slate-500">אירועים:</span>
          <strong className="text-xs font-black text-slate-700">{events.length}</strong>
        </div>

        <div className="bg-white border border-slate-100 rounded-xl px-4 py-2 flex items-center gap-2 shadow-sm">
          <Smartphone size={14} className="text-blue-500" />
          <span className="text-[11px] font-bold text-slate-500">דפים:</span>
          <strong className="text-xs font-black text-slate-700">{uniquePages}</strong>
        </div>

        <div className="bg-white border border-slate-100 rounded-xl px-4 py-2 flex items-center gap-2 shadow-sm">
          <Clock size={14} className="text-emerald-500" />
          <span className="text-[11px] font-bold text-slate-500">זמן:</span>
          <strong className="text-xs font-black text-slate-700">{duration} דקות</strong>
        </div>

        <div className="bg-white border border-slate-100 rounded-xl px-4 py-2 flex items-center gap-2 shadow-sm">
          <Calendar size={14} className="text-amber-500" />
          <span className="text-[11px] font-bold text-slate-500">תאריך מעקב:</span>
          <strong className="text-xs font-black text-slate-700">{formatDate(tracker.createdAt)}</strong>
        </div>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-1.5 mb-6">
        <div className="h-px bg-slate-200 flex-1" />
        <span className="text-[11px] font-black tracking-tight text-slate-400 px-2 uppercase">
          ציר זמן — {tracker.email ?? tracker.userId}
        </span>
        <div className="h-px bg-slate-200 flex-1" />
      </div>

      {events.length === 0 ? (
        <p className="text-xs text-slate-400 text-center py-4">אין אירועים לטרקר זה.</p>
      ) : (
        <div className="relative border-r border-slate-200 mr-2 md:mr-4 pr-4 md:pr-6 space-y-6">
          {events.map((event, idx) => (
            <div
              key={idx}
              className="relative flex flex-col md:flex-row md:items-center justify-between text-right gap-2"
            >
              {/* Connector dot */}
              <div
                className={`absolute -right-[23px] md:-right-[31px] w-4 h-4 rounded-full border-4 border-slate-50 shrink-0 ${dotColor(event.tag)}`}
              />

              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <span
                  className={`text-[8px] font-black px-1.5 py-0.5 rounded border tracking-tight shrink-0 text-center uppercase inline-block ${tagStyle(event.tag)}`}
                >
                  {event.tag}
                </span>
                <span className="text-xs font-semibold text-slate-700">{event.action}</span>
              </div>

              <div className="flex items-center gap-1.5 shrink-0 font-mono text-[10px] text-slate-400 pr-5 md:pr-0">
                <span>{formatTimestamp(event.timestamp)}</span>
                <span>•</span>
                <code className="bg-slate-100 border border-slate-200/60 rounded px-1 text-[9px] font-semibold tracking-tight uppercase">
                  {event.page}
                </code>
              </div>
            </div>
          ))}

          {/* Drop-off banner */}
          {tracker.status === 'drop' && (
            <div className="pt-2 relative">
              <div className="absolute -right-[21px] md:-right-[29px] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-rose-500" />
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-red-800 text-sm font-medium shadow-sm">
                <AlertCircle size={14} className="text-rose-600 shrink-0" />
                <span>נקודת נשירה — לא היו אירועים נוספים בסשן זה</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
