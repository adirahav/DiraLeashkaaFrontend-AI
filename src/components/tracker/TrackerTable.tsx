import React, { useRef, useEffect } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { TrackerRecord, TrackerEvent } from '../../types/tracking'
import { TrackerTimeline } from './TrackerTimeline'

const TAG_COLORS: Record<string, string> = {
  SPLASH:   'bg-blue-50 text-blue-700 border-blue-100',
  SIGNUP:   'bg-amber-50 text-amber-700 border-amber-100',
  LOGIN:    'bg-purple-50 text-purple-700 border-purple-100',
  NAV:      'bg-emerald-50 text-emerald-700 border-emerald-100',
  PROPERTY: 'bg-rose-50 text-rose-700 border-rose-100',
  UI:       'bg-slate-100 text-slate-700 border-slate-200',
  ERROR:    'bg-red-50 text-red-700 border-red-100',
}

function tagStyle(tag: string) {
  return TAG_COLORS[tag] ?? 'bg-slate-100 text-slate-600 border-slate-200'
}

interface TrackerTableProps {
  trackers: TrackerRecord[]
  expandedUUID: string | null
  eventsMap: Record<string, TrackerEvent[]>
  loadingEventsUUID: string | null
  hasMore: boolean
  isLoadingMore: boolean
  onRowClick: (uuid: string) => void
  onLoadMore: () => void
}

export const TrackerTable = ({
  trackers,
  expandedUUID,
  eventsMap,
  loadingEventsUUID,
  hasMore,
  isLoadingMore,
  onRowClick,
  onLoadMore,
}: TrackerTableProps) => {
  const sentinelRef = useRef<HTMLTableRowElement>(null)

  const hasMoreRef = useRef(hasMore)
  const isLoadingMoreRef = useRef(isLoadingMore)
  const onLoadMoreRef = useRef(onLoadMore)
  hasMoreRef.current = hasMore
  isLoadingMoreRef.current = isLoadingMore
  onLoadMoreRef.current = onLoadMore

  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasMoreRef.current && !isLoadingMoreRef.current) {
          onLoadMoreRef.current()
        }
      },
      { rootMargin: '120px', threshold: 0.1 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-right border-collapse table-fixed">
        <colgroup>
          <col className="w-[28%]" />
          <col className="w-[22%]" />
          <col className="w-[10%]" />
          <col className="w-[18%]" />
          <col className="w-[14%]" />
          <col className="w-[8%]" />
        </colgroup>
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50/75 select-none">
            <th className="py-4 px-6 text-xs text-slate-400 font-black uppercase text-right">משתמש</th>
            <th className="py-4 px-4 text-xs text-slate-400 font-black uppercase text-right">תגיות פעילות</th>
            <th className="py-4 px-4 text-xs text-slate-400 font-black uppercase text-center">אירועים</th>
            <th className="py-4 px-4 text-xs text-slate-400 font-black uppercase text-right">נקודת עצירה</th>
            <th className="py-4 px-4 text-xs text-slate-400 font-black uppercase text-right">סטטוס</th>
            <th className="py-4 px-6 text-xs text-slate-400 font-black uppercase text-left">פעולות</th>
          </tr>
        </thead>
        <tbody>
          {trackers.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center py-10 text-slate-400 font-medium text-xs">
                לא נמצאו טרקרים התואמים את תנאי החיפוש.
              </td>
            </tr>
          ) : (
            trackers.map((tracker) => {
              const isExpanded = expandedUUID === tracker.uuid
              const { status } = tracker
              const events = eventsMap[tracker.uuid]
              const activeTags = events ? [...new Set(events.map((e) => e.tag))] : []
              const eventCount = events ? events.length : null
              const isLoadingThis = loadingEventsUUID === tracker.uuid
              const displayName = tracker.email ?? tracker.userId

              return (
                <React.Fragment key={tracker.uuid}>
                  <tr
                    onClick={() => onRowClick(tracker.uuid)}
                    className={`border-b border-slate-100 hover:bg-slate-50/60 transition-colors cursor-pointer ${isExpanded ? 'bg-blue-50/30' : ''}`}
                  >
                    {/* User */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0 uppercase">
                          {displayName?.[0] ?? '?'}
                        </div>
                        <div className="min-w-0">
                          <span className="block text-xs font-black text-slate-700 truncate">{displayName}</span>
                          <span className="block text-[10px] text-slate-400 mt-0.5 tracking-wider font-mono">{tracker.uuid}…</span>
                        </div>
                      </div>
                    </td>

                    {/* Active tags */}
                    <td className="py-4 px-4">
                      {isLoadingThis && activeTags.length === 0 ? (
                        <div className="flex gap-1">
                          {[...Array(3)].map((_, i) => (
                            <div key={i} className="w-10 h-4 bg-slate-200 rounded animate-pulse" />
                          ))}
                        </div>
                      ) : activeTags.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {activeTags.map((tag) => (
                            <span
                              key={tag}
                              className={`text-[9px] px-1.5 py-0.5 rounded border font-bold tracking-tight uppercase shrink-0 ${tagStyle(tag)}`}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-[10px] text-slate-300">—</span>
                      )}
                    </td>

                    {/* Event count */}
                    <td className="py-4 px-4 text-center">
                      {isLoadingThis && eventCount === null ? (
                        <div className="w-8 h-4 bg-slate-200 rounded animate-pulse mx-auto" />
                      ) : eventCount !== null ? (
                        <span className="inline-block bg-slate-100 text-slate-700 font-bold text-xs px-2 py-0.5 rounded-full">
                          {eventCount}
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-300">—</span>
                      )}
                    </td>

                    {/* Stopped at */}
                    <td className="py-4 px-4">
                      <code className="text-[10px] bg-slate-100/80 border border-slate-200 text-slate-600 font-semibold rounded px-2 py-0.5 tracking-tight inline-block max-w-full truncate">
                        {tracker.stoppedAt}
                      </code>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                          status === 'complete'    ? 'bg-blue-500 animate-pulse' :
                          status === 'in_progress' ? 'bg-amber-400 animate-pulse' :
                                                     'bg-rose-500'
                        }`} />
                        <span className={`text-xs font-bold ${
                          status === 'complete'    ? 'text-blue-600' :
                          status === 'in_progress' ? 'text-amber-600' :
                                                     'text-rose-600'
                        }`}>
                          {status === 'complete' ? 'השלים' : status === 'in_progress' ? 'פעיל' : 'נשר'}
                        </span>
                      </div>
                    </td>

                    {/* Expand */}
                    <td className="py-4 px-6 text-left">
                      <button className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition-colors">
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                    </td>
                  </tr>

                  {/* Accordion row */}
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <tr>
                        <td colSpan={6} className="bg-slate-50/40 border-b border-slate-200 p-0">
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <TrackerTimeline
                              tracker={tracker}
                              events={events ?? []}
                              isLoading={isLoadingThis}
                            />
                          </motion.div>
                        </td>
                      </tr>
                    )}
                  </AnimatePresence>
                </React.Fragment>
              )
            })
          )}

          {/* Infinite scroll sentinel */}
          <tr ref={sentinelRef}>
            <td colSpan={6} className="py-6 text-center bg-slate-50/20 border-t border-slate-100">
              {isLoadingMore ? (
                <div className="flex justify-center gap-1">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="w-2 h-2 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
              ) : hasMore ? (
                <button
                  type="button"
                  onClick={onLoadMore}
                  className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-100/40 font-bold text-xs bg-indigo-50 px-4 py-2 rounded-xl border border-indigo-100 transition-all cursor-pointer shadow-sm"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-ping shrink-0" />
                  <span>לחץ כאן או גלול מטה לטעינת עוד</span>
                </button>
              ) : trackers.length > 0 ? (
                <span className="text-slate-400 font-bold text-xs">סוף הרשימה • נטענו כל {trackers.length} הטרקרים</span>
              ) : null}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
