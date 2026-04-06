import { useMemo, useState } from "react";
import { formatCurrency } from "../utils/formatters";

export default function TrendChart({
  data,
  summary,
  chartWindow,
  onChartWindowChange,
  onOpenControls,
}) {
  const [hoveredMonth, setHoveredMonth] = useState(null);

  const hoverData = useMemo(() => {
    if (!hoveredMonth) {
      return null;
    }

    return data.find((item) => item.monthKey === hoveredMonth) || null;
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

  const maxBalance = Math.max(...data.map((point) => point.balance), 1);
  const currentMonthKey = data[data.length - 1].monthKey;
  const scaleMarks = [0, 25, 50, 75, 100];
  const strongestMonth = [...data].sort((left, right) => right.net - left.net)[0];
  const savingsRate =
    summary.income === 0 ? 0 : Math.max((summary.balance / summary.income) * 100, 0);

  return (
    <section className="chart-shell cinematic-card h-full min-h-[440px]">
      <div className="cinematic-card-line" />
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <span className="cinematic-caption">Performance lens</span>
          <div className="flex flex-wrap items-center gap-2">
            <div className="neon-pill">Revenue Focus</div>
            <div className="hero-chip">
              <span className="status-orb" />
              Local sync live
            </div>
          </div>
          <h3 className="section-title mt-4">Revenue</h3>
          <p className="section-copy">Cash flow over time and net position across the active view.</p>
          <div className="mt-5 flex flex-wrap items-end gap-3">
            <p className="text-[2.7rem] font-black leading-none text-[var(--text-main)]">
              {formatCurrency(summary.balance)}
            </p>
            <span className="rounded-full bg-[color:rgba(34,197,94,0.12)] px-3 py-1 text-xs font-bold text-[var(--green)]">
              +12.4%
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
        <div className="chart-orb" />
        {hoverData ? (
          <div className="tooltip-card left-1/2 top-4 -translate-x-1/2">
            <p className="font-semibold">{hoverData.label}</p>
            <p className="mt-1 text-[var(--text-muted)]">Balance {formatCurrency(hoverData.balance)}</p>
            <p className="mt-1 text-[var(--text-muted)]">Net {formatCurrency(hoverData.net)}</p>
          </div>
        ) : null}

        <div className="grid gap-5 lg:grid-cols-[70px,1fr]">
          <div className="hidden h-[290px] flex-col justify-between lg:flex">
            {scaleMarks
              .slice()
              .reverse()
              .map((mark) => (
                <span key={mark} className="text-xs font-medium text-[var(--text-muted)]">
                  {formatCurrency((maxBalance * mark) / 100)}
                </span>
              ))}
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex h-[290px] flex-col justify-between">
              {scaleMarks.map((mark) => (
                <div key={mark} className="neon-grid-line" />
              ))}
            </div>

            <div className="relative grid min-h-[290px] grid-cols-4 gap-4 sm:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10">
              {data.map((point) => {
                const height = `${Math.max((point.balance / maxBalance) * 100, 18)}%`;
                const isCurrent = point.monthKey === currentMonthKey;
                const isHovered = point.monthKey === hoveredMonth;

                return (
                  <div
                    key={point.monthKey}
                    className="flex flex-col items-center justify-end gap-3"
                    onMouseEnter={() => setHoveredMonth(point.monthKey)}
                    onMouseLeave={() => setHoveredMonth(null)}
                  >
                    <div className="flex h-[250px] w-full items-end justify-center">
                      <div
                        className={`revenue-bar ${isCurrent ? "revenue-bar-active" : ""} ${
                          isHovered ? "revenue-bar-hovered" : ""
                        }`}
                        style={{ height }}
                      >
                        {(isCurrent || isHovered) && (
                          <>
                            <span className="revenue-badge">
                              {point.net >= 0 ? "+" : ""}
                              {Math.round(
                                (point.net / Math.max(point.income || point.expenses || 1, 1)) * 100,
                              )}
                              %
                            </span>
                            <span className="revenue-label">{formatCurrency(point.net)}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <span className="text-sm font-medium text-[var(--text-muted)]">
                      {point.label.split(" ")[0]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="glow-divider mt-6" />

        <div className="mt-5 grid gap-3 md:grid-cols-3">
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
              Savings rate
            </p>
            <p className="mt-2 text-lg font-bold text-[var(--text-main)]">
              {savingsRate.toFixed(1)}%
            </p>
            <p className="mt-1 text-sm text-[var(--text-muted)]">
              Share of income still retained
            </p>
          </div>
          <div className="mini-stat">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--text-muted)]">
              Active range
            </p>
            <p className="mt-2 text-lg font-bold text-[var(--text-main)]">{chartWindow}</p>
            <p className="mt-1 text-sm text-[var(--text-muted)]">
              Swaps between compressed and broader trend views
            </p>
          </div>
        </div>

        <p className="mt-5 text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">
          Each bar resolves stored transactions into a clean monthly balance signature.
        </p>
      </div>
    </section>
  );
}
