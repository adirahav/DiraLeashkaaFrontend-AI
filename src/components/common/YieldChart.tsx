
import React, { useMemo, useRef, useState, useEffect } from 'react';
import { useSplash } from '../../hooks/useSplash';

interface MonthlyDataNode {
  monthNo: number;
  totalReturn: number;
  returnOnEquity: number;
}

interface YieldChartProps {
  data: MonthlyDataNode[];
  activeResultTab?: string;
}

const MARGIN = { top: 44, right: 24, bottom: 36, left: 40 };

const COLOR_TOTAL = '#2563eb';
const COLOR_ROE = '#0d9488';
const COLOR_GRID = '#f1f5f9';
const COLOR_AXIS = '#64748b';

function niceTicks(min: number, max: number, count = 5): number[] {
  if (min === max) {
    const pad = Math.abs(min) * 0.1 || 1;
    min -= pad;
    max += pad;
  }
  const range = max - min;
  const rawStep = range / (count - 1);
  const mag = Math.pow(10, Math.floor(Math.log10(rawStep)));
  const norm = rawStep / mag;
  const niceStep = (norm >= 7.5 ? 10 : norm >= 3 ? 5 : norm >= 1.5 ? 2 : 1) * mag;
  const niceMin = Math.floor(min / niceStep) * niceStep;
  const niceMax = Math.ceil(max / niceStep) * niceStep;
  const ticks: number[] = [];
  for (let v = niceMin; v <= niceMax + 1e-9; v += niceStep) ticks.push(Math.round(v * 1e6) / 1e6);
  return ticks;
}

export const YieldChart: React.FC<YieldChartProps> = ({ data }) => {
  const { getPhrase } = useSplash();
  const containerRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ w: 0, h: 0 });
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => {
      const w = el.offsetWidth;
      const h = el.offsetHeight;
      if (w > 0 && h > 0 && (w !== dims.w || h !== dims.h)) {
        setDims({ w, h });
      }
    };
    update();
    const obs = new ResizeObserver(update);
    obs.observe(el);
    window.addEventListener('resize', update);
    window.addEventListener('orientationchange', update);
    return () => {
      obs.disconnect();
      window.removeEventListener('resize', update);
      window.removeEventListener('orientationchange', update);
    };
  }, [dims.w, dims.h]);

  const yearlyData = useMemo(() => {
    if (!data || data.length === 0) return [];
    return data
      .filter((node) => node.monthNo % 12 === 0 && node.monthNo > 0)
      .map((node) => ({
        ...node,
        yearLabel: `${getPhrase('chart_label_year', 'Year')} ${node.monthNo / 12}`,
      }));
  }, [data, getPhrase]);

  if (yearlyData.length === 0) return null;

  const { w, h } = dims;
  const ready = w > 0 && h > 0 && yearlyData.length >= 2;

  const plotW = ready ? Math.max(0, w - MARGIN.left - MARGIN.right) : 0;
  const plotH = ready ? Math.max(0, h - MARGIN.top - MARGIN.bottom) : 0;

  const values = yearlyData.flatMap((d) => [d.totalReturn, d.returnOnEquity]);
  const rawMin = Math.min(...values);
  const rawMax = Math.max(...values);
  // Floor at 0 unless data is meaningfully negative (more than 5% of max-range below 0)
  const domainMin = rawMin >= -Math.abs(rawMax) * 0.05 ? 0 : rawMin;
  const yTicks = niceTicks(domainMin, rawMax, 5);
  const yMin = yTicks[0];
  const yMax = yTicks[yTicks.length - 1];

  const n = yearlyData.length;
  // Reserve one slot of padding on each side so Year 1 sits roughly where
  // Year 2 used to be (and Year n is similarly padded from the right edge).
  const xAt = (i: number) => {
    if (n === 1) return MARGIN.left + plotW / 2;
    return MARGIN.left + (plotW * (i + 1)) / (n + 1);
  };
  const yAt = (v: number) =>
    MARGIN.top + plotH - ((v - yMin) / (yMax - yMin || 1)) * plotH;

  const pathFor = (key: 'totalReturn' | 'returnOnEquity') =>
    yearlyData
      .map((d, i) => `${i === 0 ? 'M' : 'L'} ${xAt(i).toFixed(2)} ${yAt(d[key]).toFixed(2)}`)
      .join(' ');

  const xLabelStride = Math.max(1, Math.ceil(n / Math.max(1, Math.floor(plotW / 48))));

  const totalReturnLabel = getPhrase('chart_legend_total_return', 'Total Return');
  const roeLabel = getPhrase('chart_legend_return_on_equity', 'Return on Equity');

  const handleMove = (e: React.MouseEvent<SVGSVGElement> | React.TouchEvent<SVGSVGElement>) => {
    if (!ready) return;
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0]?.clientX : e.clientX;
    if (clientX == null) return;
    const relX = ((clientX - rect.left) / rect.width) * w;
    const localX = relX - MARGIN.left;
    if (localX < -10 || localX > plotW + 10) {
      setHoverIdx(null);
      return;
    }
    const idx = Math.round((localX / plotW) * (n - 1));
    setHoverIdx(Math.max(0, Math.min(n - 1, idx)));
  };

  const fmtPct = (v: number) => `${v.toFixed(v % 1 === 0 ? 0 : 1)}%`;

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%', position: 'relative' }}>
      {/* Legend as HTML so RTL text aligns correctly */}
      {ready && (
        <div style={{
          position: 'absolute',
          top: 10,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          gap: 20,
          direction: 'rtl',
          fontSize: 12,
          color: '#475569',
          pointerEvents: 'none',
          zIndex: 2,
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: COLOR_TOTAL, flexShrink: 0 }} />
            {totalReturnLabel}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: COLOR_ROE, flexShrink: 0 }} />
            {roeLabel}
          </span>
        </div>
      )}

      {ready && (
        <svg
          width={w}
          height={h}
          viewBox={`0 0 ${w} ${h}`}
          style={{ display: 'block', overflow: 'visible' }}
          onMouseMove={handleMove}
          onMouseLeave={() => setHoverIdx(null)}
          onTouchStart={handleMove}
          onTouchMove={handleMove}
          onTouchEnd={() => setHoverIdx(null)}
        >
          {/* Y-axis grid + labels */}
          {yTicks.map((v, i) => {
            const y = yAt(v);
            return (
              <g key={`yt-${i}`}>
                <line
                  x1={MARGIN.left}
                  y1={y}
                  x2={MARGIN.left + plotW}
                  y2={y}
                  stroke={COLOR_GRID}
                  strokeDasharray="3 3"
                />
                <text
                  x={MARGIN.left - 6}
                  y={y + 4}
                  fontSize={11}
                  fill={COLOR_AXIS}
                  textAnchor="end"
                >
                  {fmtPct(v)}
                </text>
              </g>
            );
          })}

          {/* X-axis labels */}
          {yearlyData.map((d, i) =>
            i % xLabelStride === 0 || i === n - 1 ? (
              <text
                key={`xt-${d.monthNo}`}
                x={xAt(i)}
                y={MARGIN.top + plotH + 18}
                fontSize={11}
                fill={COLOR_AXIS}
                textAnchor="middle"
              >
                {d.yearLabel}
              </text>
            ) : null,
          )}

          {/* Lines */}
          <path d={pathFor('totalReturn')} stroke={COLOR_TOTAL} strokeWidth={3} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <path d={pathFor('returnOnEquity')} stroke={COLOR_ROE} strokeWidth={3} fill="none" strokeLinecap="round" strokeLinejoin="round" />

          {/* Dots */}
          {yearlyData.map((d, i) => (
            <g key={`pt-${d.monthNo}`}>
              <circle cx={xAt(i)} cy={yAt(d.totalReturn)} r={hoverIdx === i ? 6 : 4} fill={COLOR_TOTAL} />
              <circle cx={xAt(i)} cy={yAt(d.returnOnEquity)} r={hoverIdx === i ? 6 : 4} fill={COLOR_ROE} />
            </g>
          ))}

          {/* Hover vertical line */}
          {hoverIdx != null && (
            <line
              x1={xAt(hoverIdx)}
              y1={MARGIN.top}
              x2={xAt(hoverIdx)}
              y2={MARGIN.top + plotH}
              stroke="#cbd5e1"
              strokeDasharray="2 2"
            />
          )}
        </svg>
      )}

      {/* Tooltip overlay (HTML) */}
      {ready && hoverIdx != null && (() => {
        const row = yearlyData[hoverIdx];
        const cx = xAt(hoverIdx);
        const tooltipLeft = Math.min(Math.max(cx + 10, 8), w - 160);
        return (
          <div
            style={{
              position: 'absolute',
              left: tooltipLeft,
              top: MARGIN.top + 4,
              background: '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: 12,
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
              padding: '8px 10px',
              direction: 'rtl',
              fontSize: 12,
              pointerEvents: 'none',
              minWidth: 140,
              zIndex: 10,
            }}
          >
            <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>{row.yearLabel}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#334155' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: COLOR_TOTAL, display: 'inline-block' }} />
              <span>{totalReturnLabel}: <span dir="ltr">{fmtPct(row.totalReturn)}</span></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#334155', marginTop: 2 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: COLOR_ROE, display: 'inline-block' }} />
              <span>{roeLabel}: <span dir="ltr">{fmtPct(row.returnOnEquity)}</span></span>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
