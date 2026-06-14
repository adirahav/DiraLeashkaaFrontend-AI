import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, Layers, TrendingDown, Search, Sparkles } from 'lucide-react'
import { TrackerRecord, TrackerEvent } from '../../types/tracking'
import { trackerService } from '../../services/tracker.service'
import { TrackerTable } from '../../components/tracker/TrackerTable'

const PAGE_SIZE = 10

type StatusFilter = 'ALL' | 'COMPLETE' | 'IN_PROGRESS' | 'DROP'

export const TrackerDashboard = () => {
  const navigate = useNavigate()

  const [trackers, setTrackers] = useState<TrackerRecord[]>([])
  const [page, setPage] = useState(1)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const loadingRef = useRef(false)
  const [stats, setStats] = useState({ total: 0, completed: 0, dropped: 0, totalEvents: 0 })

  const [expandedUUID, setExpandedUUID] = useState<string | null>(null)
  const [eventsMap, setEventsMap] = useState<Record<string, TrackerEvent[]>>({})
  const [loadingEventsUUID, setLoadingEventsUUID] = useState<string | null>(null)

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL')

  // Initial load
  useEffect(() => {
    loadMore(1, [])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadMore = useCallback(async (nextPage: number, existing: TrackerRecord[]) => {
    if (loadingRef.current) return
    loadingRef.current = true
    setIsLoadingMore(true)
    try {
      const res = await trackerService.getTrackers(nextPage, PAGE_SIZE)
      const merged = [...existing, ...res.trackers]
      setTrackers(merged)
      setPage(nextPage)
      setHasMore(merged.length < res.total)
      setStats(res.stats)

      // Pre-populate eventsMap only when events are non-empty (list returns [] — skip those)
      const embedded: Record<string, TrackerEvent[]> = {}
      res.trackers.forEach((t) => { if (t.events?.length) embedded[t.uuid] = t.events })
      if (Object.keys(embedded).length > 0) {
        setEventsMap((prev) => ({ ...prev, ...embedded }))
      }
    } catch {
      console.log('[TRACKER DASHBOARD] Failed to load trackers')
    } finally {
      loadingRef.current = false
      setIsLoadingMore(false)
    }
  }, [])

  const handleLoadMore = useCallback(() => {
    if (!hasMore || isLoadingMore) return
    loadMore(page + 1, trackers)
  }, [hasMore, isLoadingMore, page, trackers, loadMore])

  const handleRowClick = useCallback(async (uuid: string) => {
    if (expandedUUID === uuid) {
      setExpandedUUID(null)
      return
    }
    setExpandedUUID(uuid)
    if (eventsMap[uuid] !== undefined) return

    setLoadingEventsUUID(uuid)
    try {
      const events = await trackerService.getTrackerEvents(uuid)
      setEventsMap((prev) => ({ ...prev, [uuid]: events }))
    } catch {
      setEventsMap((prev) => ({ ...prev, [uuid]: [] }))
      console.log(`[TRACKER DASHBOARD] Failed to load events for ${uuid}`)
    } finally {
      setLoadingEventsUUID(null)
    }
  }, [expandedUUID, eventsMap])

  // Client-side filter on loaded trackers
  const filteredTrackers = trackers.filter((t) => {
    const matchesSearch =
      (t.email ?? '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.stoppedAt.toLowerCase().includes(searchTerm.toLowerCase())
    if (statusFilter === 'COMPLETE')    return matchesSearch && t.status === 'complete'
    if (statusFilter === 'IN_PROGRESS') return matchesSearch && t.status === 'in_progress'
    if (statusFilter === 'DROP')        return matchesSearch && t.status === 'drop'
    return matchesSearch
  })

  const dropRate = stats.total ? ((stats.dropped / stats.total) * 100).toFixed(1) : '0.0'

  return (
    <div className="min-h-screen bg-slate-50/50 pb-16 text-right" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Page header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold bg-indigo-50 border border-indigo-100/50 rounded-full px-3 py-1 w-max mb-2">
              <Sparkles size={12} className="animate-pulse" />
              <span>פאנל פיקוח ובקרת איכות מנהל</span>
            </div>
            <h1 className="font-black text-3xl text-slate-800 tracking-tight">כלי מעקב משתמשים</h1>
            <p className="text-slate-500 font-medium text-sm mt-1">
              ניתוח משפך השמישות של משתמשי האתר וזיהוי נקודות נשירה
            </p>
          </div>
          <button
            onClick={() => navigate('/home')}
            className="bg-white border border-slate-200 text-slate-700 font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm hover:bg-slate-50 transition-colors cursor-pointer"
          >
            חזרה ללוח בקרה
          </button>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="p-3.5 rounded-xl bg-blue-50 text-blue-600">
              <Users size={22} />
            </div>
            <div>
              <span className="text-slate-400 text-xs font-semibold block">סה״כ טרקרים</span>
              <strong className="text-2xl font-black text-slate-800">{stats.total}</strong>
              <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">בזמן אמת</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="p-3.5 rounded-xl bg-emerald-50 text-emerald-600">
              <Layers size={22} />
            </div>
            <div>
              <span className="text-slate-400 text-xs font-semibold block">אירועים שנמדדו</span>
              <strong className="text-2xl font-black text-slate-800">{stats.totalEvents}</strong>
              <span className="text-[10px] text-slate-400 font-medium block mt-0.5">
                ממוצע {stats.total ? Math.round(stats.totalEvents / stats.total) : 0} לטרקר
              </span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="p-3.5 rounded-xl bg-rose-50 text-rose-600">
              <TrendingDown size={22} />
            </div>
            <div>
              <span className="text-slate-400 text-xs font-semibold block">אחוז נשירה</span>
              <strong className="text-2xl font-black text-slate-800">{dropRate}%</strong>
              <span className="text-[10px] text-rose-600 font-bold block mt-0.5">{stats.dropped} נטשו</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="p-3.5 rounded-xl bg-indigo-50 text-indigo-600">
              <Users size={22} />
            </div>
            <div>
              <span className="text-slate-400 text-xs font-semibold block">השלימו</span>
              <strong className="text-2xl font-black text-slate-800">{stats.completed}</strong>
              <span className="text-[10px] text-blue-600 font-bold block mt-0.5">מתוך {stats.total} סה״כ</span>
            </div>
          </div>
        </div>

        {/* Table card */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">

          {/* Toolbar */}
          <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200 w-full sm:w-80 shadow-sm">
              <Search size={16} className="text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="חיפוש לפי מזהה משתמש או מסך..."
                className="bg-transparent border-none text-xs text-slate-700 w-full focus:outline-none text-right font-medium"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 whitespace-nowrap">סנן לפי:</span>
              <div className="flex bg-white border border-slate-200 p-0.5 rounded-xl shadow-sm">
                {(['ALL', 'COMPLETE', 'IN_PROGRESS', 'DROP'] as StatusFilter[]).map((f) => (
                  <button
                    key={f}
                    onClick={() => setStatusFilter(f)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      statusFilter === f ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {f === 'ALL'         ? `הכל (${trackers.length})` :
                     f === 'COMPLETE'    ? 'השלימו' :
                     f === 'IN_PROGRESS' ? 'פעילים' :
                                          'נשרו'}
                  </button>
                ))}
              </div>
            </div>

            <p className="text-[11px] text-slate-400 font-bold hidden lg:block">
              * לחצו על שורה לציר הזמן המלא
            </p>
          </div>

          <TrackerTable
            trackers={filteredTrackers}
            expandedUUID={expandedUUID}
            eventsMap={eventsMap}
            loadingEventsUUID={loadingEventsUUID}
            hasMore={hasMore}
            isLoadingMore={isLoadingMore}
            onRowClick={handleRowClick}
            onLoadMore={handleLoadMore}
          />

          {/* Footer */}
          <div className="p-5 bg-slate-50/70 border-t border-slate-100 text-xs text-slate-400 font-bold flex flex-col sm:flex-row justify-between items-center gap-2">
            <span>מציג {filteredTrackers.length} מתוך {trackers.length} נטענו ({stats.total} סה״כ)</span>
            <span>שרת הניטור פועל • מעקב ביצועים בזמן אמת</span>
          </div>
        </div>
      </div>
    </div>
  )
}
