import { useMemo, useState } from "react";
import { formatCurrency } from "../utils/formatters";

function buildPoints(data, width, height, padding, minValue, maxValue) {
  const xStep = data.length > 1 ? (width - padding * 2) / (data.length - 1) : 0;
  const valueRange = Math.max(maxValue - minValue, 1);

  return data.map((item, index) => ({
    ...item,
    x: padding + xStep * index,
    y: height - padding - ((item.balance - minValue) / valueRange) * (height - padding * 2),
  }));
}

function buildLinePath(points) {
  return points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");
}

function buildAreaPath(points, height, padding) {
  if (points.length === 0) {
    return "";
  }

  return `${buildLinePath(points)} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;
}

export default function TrendChart({
  data,
  summary,
  chartWindow,
  onChartWindowChange,
  onOpenControls,
}) {
  const [hoveredMonth, setHoveredMonth] = useState(null);

  const activePoint = useMemo(() => {
    if (hoveredMonth) {
      return data.find((item) => item.monthKey === hoveredMonth) || data[data.length - 1] || null;
    }

    return data[data.length - 1] || null;
  }, [data, hoveredMonth]);

  if (data.length === 0) {
    return (
      <div className="chart-shell flex min-h-[360px] items-center justify-center">
        <p className="text-sm text-[var(--text-muted)]">
          No trend data yet. Add income or expense entries to populate the chart.
        </p>
      </div>
    );
  }

  const chartWidth = 720;
  const chartHeight = 300;
  const chartPadding = 28;
  const minBalance = Math.min(...data.map((point) => point.balance));
  const maxBalance = Math.max(...data.map((point) => point.balance));
  const points = buildPoints(data, chartWidth, chartHeight, chartPadding, minBalance, maxBalance);
  const linePath = buildLinePath(points);
  const areaPath = buildAreaPath(points, chartHeight, chartPadding);
  const strongestMonth = [...data].sort((left, right) => right.net - left.net)[0];
  const weakestMonth = [...data].sort((left, right) => left.net - right.net)[0];
  const savingsRate =
    summary.income === 0 ? 0 : Math.max((summary.balance / summary.income) * 100, 0);

  return (
    <section className="chart-shell cinematic-card h-full min-h-[440px]">
      <div className="cinematic-card-line" />
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <span className="cinematic-caption">Performance lens</span>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <div className="neon-pill">Revenue focus</div>
            <div className="hero-chip">
              <span className="status-orb" />
              Hover chart for month details
            </div>
          </div>
          <h3 className="section-title mt-4">Revenue</h3>
          <p className="section-copy">A cleaner balance curve with hover states for each month.</p>
          <div className="mt-5 flex flex-wrap items-end gap-3">
            <p className="text-[2.7rem] font-black leading-none text-[var(--text-main)]">
              {formatCurrency(summary.balance)}
            </p>
            <span className="rounded-full bg-[color:rgba(34,197,94,0.12)] px-3 py-1 text-xs font-bold text-[var(--green)]">
              {savingsRate.toFixed(1)}% saved
            </span>
            <span className="pb-1 text-sm text-[var(--text-muted)]">Net position across active view</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {["Weekly", "Monthly", "Yearly", "Range"].map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => onChartWindowChange(option)}
              className={`pill-button ${option === chartWindow ? "pill-button-active" : ""}`}
            >
              {option}
            </button>
          ))}
          <button
            type="button"
            onClick={onOpenControls}
            className="icon-button"
            title="Open transaction controls"
          >
            <span aria-hidden="true">|||</span>
          </button>
        </div>
      </div>

      <div className="neon-frame mt-8 p-5">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr),220px]">
          <div className="overflow-hidden rounded-[24px] border border-[var(--border)] bg-[color:rgba(255,255,255,0.02)] p-4">
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="h-[320px] w-full">
              <defs>
                <linearGradient id="trendArea" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="rgba(139,92,246,0.45)" />
                  <stop offset="100%" stopColor="rgba(59,130,246,0.04)" />
                </linearGradient>
                <linearGradient id="trendLine" x1="0" x2="1" y1="0" y2="0">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
              </defs>

              {[0, 1, 2, 3].map((index) => {
                const y = chartPadding + ((chartHeight - chartPadding * 2) / 3) * index;
                return (
                  <line
                    key={index}
                    x1={chartPadding}
                    x2={chartWidth - chartPadding}
                    y1={y}
                    y2={y}
                    stroke="rgba(167,139,250,0.12)"
                    strokeDasharray="6 10"
                  />
                );
              })}

              <path d={areaPath} fill="url(#trendArea)" />
              <path
                d={linePath}
                fill="none"
                stroke="url(#trendLine)"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {points.map((point) => {
                const isActive = point.monthKey === activePoint?.monthKey;

                return (
                  <g key={point.monthKey}>
                    {isActive ? (
                      <line
                        x1={point.x}
                        x2={point.x}
                        y1={chartPadding}
                        y2={chartHeight - chartPadding}
                        stroke="rgba(255,255,255,0.22)"
                        strokeDasharray="4 8"
                      />
                    ) : null}
                    <circle
                      cx={point.x}
                      cy={point.y}
                      r={isActive ? 8 : 5}
                      fill={isActive ? "#ffffff" : "#8b5cf6"}
                      stroke="#3b82f6"
                      strokeWidth="3"
                    />
                    <circle
                      cx={point.x}
                      cy={point.y}
                      r="18"
                      fill="transparent"
                      onMouseEnter={() => setHoveredMonth(point.monthKey)}
                      onMouseLeave={() => setHoveredMonth(null)}
                    />
                    <text
                      x={point.x}
                      y={chartHeight - 8}
                      textAnchor="middle"
                      fill="var(--text-muted)"
                      fontSize="14"
                      fontWeight="600"
                    >
                      {point.label.split(" ")[0]}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="space-y-3">
            <div className="mini-stat min-h-[132px]">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--text-muted)]">
                Hovered month
              </p>
              <p className="mt-2 text-xl font-bold text-[var(--text-main)]">
                {activePoint?.label || "No data"}
              </p>
              <p className="mt-2 text-sm text-[var(--text-muted)]">
                Balance {formatCurrency(activePoint?.balance || 0)}
              </p>
              <p className="mt-1 text-sm text-[var(--text-muted)]">
                Income {formatCurrency(activePoint?.income || 0)}
              </p>
              <p className="mt-1 text-sm text-[var(--text-muted)]">
                Expenses {formatCurrency(activePoint?.expenses || 0)}
              </p>
            </div>

            <div className="mini-stat">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--text-muted)]">
                Strongest month
              </p>
              <p className="mt-2 text-lg font-bold text-[var(--text-main)]">
                {strongestMonth?.label || "No data"}
              </p>
              <p className="mt-1 text-sm text-[var(--text-muted)]">
                Net {formatCurrency(strongestMonth?.net || 0)}
              </p>
            </div>

            <div className="mini-stat">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--text-muted)]">
                Lowest month
              </p>
              <p className="mt-2 text-lg font-bold text-[var(--text-main)]">
                {weakestMonth?.label || "No data"}
              </p>
              <p className="mt-1 text-sm text-[var(--text-muted)]">
                Net {formatCurrency(weakestMonth?.net || 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-3">
          {data.slice(-3).map((point) => (
            <button
              key={point.monthKey}
              type="button"
              onMouseEnter={() => setHoveredMonth(point.monthKey)}
              onMouseLeave={() => setHoveredMonth(null)}
              className={`trend-month-card ${activePoint?.monthKey === point.monthKey ? "trend-month-card-active" : ""}`}
            >
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--text-muted)]">
                {point.label}
              </p>
              <p className="mt-3 text-xl font-bold text-[var(--text-main)]">
                {formatCurrency(point.net)}
              </p>
              <p className="mt-2 text-sm text-[var(--text-muted)]">
                Closing balance {formatCurrency(point.balance)}
              </p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
