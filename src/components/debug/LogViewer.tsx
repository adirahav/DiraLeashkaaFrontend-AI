import React, { useEffect, useState, useCallback, useRef } from 'react'
import { X, Trash2, Copy, Check, GripHorizontal } from 'lucide-react'
import { logger, LogEntry } from '../../utils/logger'
import { Clipboard } from '@capacitor/clipboard'
import { Capacitor } from '@capacitor/core'

// ── Tag colours ───────────────────────────────────────────────────────────────

const TAG_COLORS: Record<string, string> = {
  LOGIN:             'bg-blue-100 text-blue-700',
  SIGNUP:            'bg-violet-100 text-violet-700',
  'FORGOT-PASSWORD': 'bg-amber-100 text-amber-700',
  VERSION:           'bg-slate-100 text-slate-600',
  SPLASH:            'bg-cyan-100 text-cyan-700',
  PROPERTY:          'bg-emerald-100 text-emerald-700',
  API:               'bg-indigo-100 text-indigo-700',
  NAV:               'bg-orange-100 text-orange-700',
  STORE:             'bg-pink-100 text-pink-700',
  ERROR:             'bg-red-200 text-red-800',
}

function tagColor(tag: string) {
  return TAG_COLORS[tag] ?? 'bg-slate-100 text-slate-600'
}

// ── JSON splitting ────────────────────────────────────────────────────────────

function splitMessage(msg: string): { text: string; json: unknown | null } {
  const match = msg.match(/^([\s\S]*?)\s*(\{[\s\S]+|\[[\s\S]+)$/)
  if (!match) return { text: msg, json: null }
  try {
    const parsed = JSON.parse(match[2])
    if (typeof parsed === 'object' && parsed !== null) {
      return { text: match[1] || msg, json: parsed }
    }
  } catch { /* not valid JSON */ }
  return { text: msg, json: null }
}

// ── JSON tree renderer ────────────────────────────────────────────────────────

const JsonNode: React.FC<{ value: unknown; depth?: number }> = ({ value, depth = 0 }) => {
  const [open, setOpen] = useState(depth === 0)

  if (value === null)      return <span className="text-slate-400">null</span>
  if (value === undefined) return <span className="text-slate-400">undefined</span>
  if (typeof value === 'boolean') return <span className="text-amber-300">{String(value)}</span>
  if (typeof value === 'number')  return <span className="text-sky-300">{value}</span>
  if (typeof value === 'string')  return <span className="text-green-300">"{value}"</span>

  if (Array.isArray(value)) {
    if (value.length === 0) return <span className="text-slate-300">[]</span>
    return (
      <span>
        <button
          onClick={() => setOpen(v => !v)}
          className="text-slate-300 hover:text-white mr-1 leading-none"
        >
          {open ? '▾' : '▸'} ({value.length}) {open ? '[' : '[…]'}
        </button>
        {open && (
          <div className="pl-4 border-l border-slate-700 mt-0.5">
            {value.map((item, i) => (
              <div key={i} className="leading-relaxed">
                <span className="text-slate-500">{i}: </span>
                <JsonNode value={item} depth={depth + 1} />
              </div>
            ))}
            <div className="text-slate-300">]</div>
          </div>
        )}
      </span>
    )
  }

  if (typeof value === 'object') {
    const keys = Object.keys(value as object)
    if (keys.length === 0) return <span className="text-slate-300">{'{}'}</span>
    const preview = keys.slice(0, 3).join(', ') + (keys.length > 3 ? ', …' : '')
    return (
      <span>
        <button
          onClick={() => setOpen(v => !v)}
          className="text-slate-300 hover:text-white mr-1 leading-none"
        >
          {open ? '▾' : '▸'} {open ? '{' : `{${preview}}`}
        </button>
        {open && (
          <div className="pl-4 border-l border-slate-700 mt-0.5">
            {keys.map(key => (
              <div key={key} className="leading-relaxed">
                <span className="text-slate-400">{key}</span>
                <span className="text-slate-500">: </span>
                <JsonNode value={(value as Record<string, unknown>)[key]} depth={depth + 1} />
              </div>
            ))}
            <div className="text-slate-300">{'}'}</div>
          </div>
        )}
      </span>
    )
  }

  return <span className="text-slate-200">{String(value)}</span>
}

// ── Log row ───────────────────────────────────────────────────────────────────

const LogRow: React.FC<{ entry: LogEntry }> = ({ entry }) => {
  const isError = entry.tag === 'ERROR'
  const { text, json } = splitMessage(entry.message)

  return (
    <div className={`flex items-start gap-2 px-3 py-1.5 border-b font-mono text-[10px] ${
      isError
        ? 'border-red-900 bg-red-950/60 hover:bg-red-900/40'
        : 'border-slate-800 hover:bg-slate-800/60'
    }`}>
      <span className={`shrink-0 tabular-nums leading-relaxed ${isError ? 'text-red-400' : 'text-slate-500'}`}>
        {entry.timestamp}
      </span>
      <span className={`shrink-0 px-1 py-0.5 rounded text-[9px] font-black uppercase tracking-wide leading-none mt-0.5 ${tagColor(entry.tag)}`}>
        {entry.tag}
      </span>
      <span className={`break-all leading-relaxed min-w-0 ${isError ? 'text-red-200' : 'text-slate-200'}`}>
        {text}
        {json !== null && (
          <span className="block mt-0.5">
            <JsonNode value={json} depth={0} />
          </span>
        )}
        {entry.page && (
          <span className={`block text-[9px] mt-0.5 ${isError ? 'text-red-500' : 'text-slate-600'}`}>
            {entry.page}
          </span>
        )}
      </span>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

interface Props {
  onClose: () => void
}

export const LogViewer: React.FC<Props> = ({ onClose }) => {
  const [logs, setLogs] = useState<LogEntry[]>(() => logger.getLogs())
  const [activeTags, setActiveTags] = useState<string[]>([])
  const [activePages, setActivePages] = useState<string[]>([])
  const [copyState, setCopyState] = useState<'idle' | 'ok' | 'fail'>('idle')

  const [pos, setPos] = useState({ x: 16, y: window.innerHeight - 420 })
  const dragOrigin = useRef<{ mx: number; my: number; wx: number; wy: number } | null>(null)
  const windowRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const isAtBottom = useRef(true)

  useEffect(() => logger.subscribe(setLogs), [])

  const availableTags = logger.getAvailableTags()
  const availablePages = [...new Set(logs.map((e) => e.page).filter(Boolean))].sort()

  const filtered = logs.filter((e) =>
    (activeTags.length === 0  || activeTags.includes(e.tag)) &&
    (activePages.length === 0 || activePages.includes(e.page))
  )

  const toggleTag  = (tag:  string) => setActiveTags( (prev) => prev.includes(tag)  ? prev.filter((t) => t !== tag)  : [...prev, tag])
  const togglePage = (page: string) => setActivePages((prev) => prev.includes(page) ? prev.filter((p) => p !== page) : [...prev, page])

  useEffect(() => {
    const el = listRef.current
    if (!el) return
    const onScroll = () => {
      isAtBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight <= 40
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const el = listRef.current
    if (el && isAtBottom.current) el.scrollTop = el.scrollHeight
  }, [logs.length])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  const onDragStart = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault()
    dragOrigin.current = { mx: e.clientX, my: e.clientY, wx: pos.x, wy: pos.y }

    const handleMove = (ev: PointerEvent) => {
      ev.preventDefault()
      if (!dragOrigin.current) return
      const { mx, my, wx, wy } = dragOrigin.current
      const winW = windowRef.current?.offsetWidth ?? 360
      const winH = windowRef.current?.offsetHeight ?? 400
      setPos({
        x: Math.max(0, Math.min(window.innerWidth - winW, wx + ev.clientX - mx)),
        y: Math.max(0, Math.min(window.innerHeight - winH, wy + ev.clientY - my)),
      })
    }

    const handleUp = () => {
      dragOrigin.current = null
      document.removeEventListener('pointermove', handleMove)
      document.removeEventListener('pointerup', handleUp)
    }

    document.addEventListener('pointermove', handleMove, { passive: false })
    document.addEventListener('pointerup', handleUp)
  }

  const copyText = filtered.map((e) => {
    const msg = e.message.length > 300 ? e.message.slice(0, 300) + '…' : e.message
    return `[${e.timestamp}] [${e.tag}] ${msg}`
  }).join('\n')

  const handleCopy = useCallback(async () => {
    const finish = (ok: boolean) => {
      setCopyState(ok ? 'ok' : 'fail')
      setTimeout(() => setCopyState('idle'), 2000)
    }

    // Native clipboard — requires APK rebuild after `cap sync` to register the plugin
    if (Capacitor.isNativePlatform()) {
      try {
        await Clipboard.write({ string: copyText })
        finish(true)
      } catch {
        finish(false)
      }
      return
    }

    // Web: modern Clipboard API
    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(copyText)
        finish(true)
        return
      } catch { /* fall through */ }
    }

    // Web: execCommand fallback
    try {
      const el = document.createElement('textarea')
      el.value = copyText
      el.style.cssText = 'position:fixed;left:-9999px;top:-9999px;opacity:0'
      document.body.appendChild(el)
      el.focus()
      el.select()
      const ok = document.execCommand('copy')
      document.body.removeChild(el)
      finish(ok)
    } catch {
      finish(false)
    }
  }, [copyText])

  const handleClear = useCallback(() => {
    logger.clear()
    setActiveTags([])
    setActivePages([])
    isAtBottom.current = true
  }, [])

  return (
    <div
      ref={windowRef}
      style={{ left: pos.x, top: pos.y, width: 360 }}
      className="fixed z-[99999] flex flex-col rounded-xl overflow-hidden shadow-2xl border border-slate-700 bg-slate-900"
      dir="ltr"
      role="dialog"
      aria-modal="true"
      aria-label="Debug Log Viewer"
    >
      {/* Title bar — drag handle */}
      <div
        className="flex items-center justify-between px-3 py-2 bg-slate-800 border-b border-slate-700 shrink-0 cursor-grab active:cursor-grabbing select-none"
        style={{ touchAction: 'none' }}
        onPointerDown={onDragStart}
      >
        <div className="flex items-center gap-2">
          <GripHorizontal size={13} className="text-slate-500" />
          <span className="text-white font-black text-xs tracking-wider uppercase">Debug Log</span>
          <span className="text-slate-400 text-[10px]">{filtered.length}</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onPointerDown={(e) => e.stopPropagation()}
            onClick={handleCopy}
            className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold transition-colors ${
              copyState === 'fail'
                ? 'bg-red-700 text-white'
                : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
            }`}
            title="Copy to clipboard"
          >
            {copyState === 'ok'   && <Check size={11} className="text-green-400" />}
            {copyState === 'fail' && <X     size={11} />}
            {copyState === 'idle' && <Copy  size={11} />}
            {copyState === 'ok' ? 'Copied' : copyState === 'fail' ? 'Failed' : 'Copy'}
          </button>
          <button
            onPointerDown={(e) => e.stopPropagation()}
            onClick={handleClear}
            className="p-1 rounded bg-slate-700 hover:bg-red-700 text-slate-200 transition-colors"
            title="Clear logs"
          >
            <Trash2 size={11} />
          </button>
          <button
            onPointerDown={(e) => e.stopPropagation()}
            onClick={onClose}
            className="p-1 rounded bg-slate-700 hover:bg-slate-600 text-slate-200 transition-colors"
            aria-label="Close"
          >
            <X size={13} />
          </button>
        </div>
      </div>

      {/* Tag filter chips */}
      {availableTags.length > 0 && (
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 border-b border-slate-700 overflow-x-auto shrink-0 no-scrollbar">
          <button
            onClick={() => setActiveTags([])}
            className={`px-2 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap transition-colors ${
              activeTags.length === 0 ? 'bg-white text-slate-900' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            All
          </button>
          {availableTags.map((tag) => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap transition-colors ${
                activeTags.includes(tag)
                  ? tagColor(tag) + ' ring-1 ring-white/30'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {/* Path filter chips */}
      {availablePages.length > 0 && (
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 border-b border-slate-700 overflow-x-auto shrink-0 no-scrollbar">
          <span className="text-slate-500 text-[9px] font-bold shrink-0 uppercase tracking-wider">Path</span>
          <button
            onClick={() => setActivePages([])}
            className={`px-2 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap transition-colors ${
              activePages.length === 0 ? 'bg-white text-slate-900' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            All
          </button>
          {availablePages.map((page) => (
            <button
              key={page}
              onClick={() => togglePage(page)}
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap transition-colors ${
                activePages.includes(page)
                  ? 'bg-slate-200 text-slate-900 ring-1 ring-white/30'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
              title={page}
            >
              {page.length > 18 ? `…${page.slice(-16)}` : page}
            </button>
          ))}
        </div>
      )}

      {/* Log list */}
      <div
        ref={listRef}
        className="overflow-y-auto bg-slate-900"
        style={{ height: 280 }}
      >
        {filtered.length === 0 ? (
          <div className="flex items-center justify-center h-full text-slate-500 text-xs font-mono">
            No logs yet
          </div>
        ) : (
          filtered.map((entry) => <LogRow key={entry.id} entry={entry} />)
        )}
      </div>
    </div>
  )
}
