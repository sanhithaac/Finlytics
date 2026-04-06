import { useMemo, useState } from "react";
import { formatCurrency } from "../utils/formatters";

const palette = [
  "#8B5CF6",
  "#3B82F6",
  "#F59E0B",
  "#22C55E",
  "#EC4899",
  "#F97316",
];

function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}

function describeArc(centerX, centerY, radius, startAngle, endAngle) {
  const start = polarToCartesian(centerX, centerY, radius, endAngle);
  const end = polarToCartesian(centerX, centerY, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  return [
    "M",
    start.x,
    start.y,
    "A",
    radius,
    radius,
    0,
    largeArcFlag,
    0,
    end.x,
    end.y,
  ].join(" ");
}

export default function CategoryChart({ data, transactions, spendingWindow, onWindowChange }) {
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const total = data.reduce((sum, item) => sum + item.amount, 0);
  const expenseTransactions = transactions.filter((transaction) => transaction.type === "expense");
  const averageExpense =
    expenseTransactions.length > 0 ? total / expenseTransactions.length : 0;

  const slices = useMemo(() => {
    let currentAngle = 0;

    return data.map((item, index) => {
      const angle = (item.amount / total) * 360;
      const startAngle = currentAngle;
      const endAngle = currentAngle + angle;
      currentAngle = endAngle;

      return {
        ...item,
        color: palette[index % palette.length],
        path: describeArc(140, 140, 92, startAngle, endAngle),
        share: total === 0 ? 0 : (item.amount / total) * 100,
      };
    });
  }, [data, total]);

  const activeSlice = hoveredCategory
    ? slices.find((slice) => slice.category === hoveredCategory) || slices[0] || null
    : slices[0] || null;

  if (data.length === 0 || total === 0) {
    return (
      <div className="chart-shell flex min-h-[320px] items-center justify-center">
        <p className="max-w-xs text-center text-sm text-[var(--muted)]">
          Spending breakdown appears once expense data is available in the current view.
        </p>
      </div>
    );
  }

  return (
    <div className="chart-shell h-full">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="neon-pill">Breakdown</div>
          <h3 className="section-title mt-4">Spending</h3>
          <p className="section-copy">A larger category donut with hover-driven detail.</p>
        </div>
        <label className="min-w-[170px]">
          <span className="sr-only">Spending window</span>
          <select
            value={spendingWindow}
            onChange={(event) => onWindowChange(event.target.value)}
            className="field"
          >
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="all">All time</option>
          </select>
        </label>
      </div>

      <div className="neon-frame mt-6 p-5">
        <div className="grid gap-6 xl:grid-cols-[300px,minmax(0,1fr)] xl:items-center">
          <div className="mx-auto">
            <div className="relative h-[280px] w-[280px]">
              <svg viewBox="0 0 280 280" className="h-[280px] w-[280px] -rotate-90">
                <circle
                  cx="140"
                  cy="140"
                  r="92"
                  fill="none"
                  stroke="var(--chart-grid)"
                  strokeWidth="34"
                />
                {slices.map((slice) => {
                  const isActive = slice.category === activeSlice?.category;

                  return (
                    <path
                      key={slice.category}
                      d={slice.path}
                      fill="none"
                      stroke={slice.color}
                      strokeWidth={isActive ? 40 : 34}
                      strokeLinecap="round"
                      style={{
                        filter: `drop-shadow(0 0 12px ${slice.color})`,
                        opacity: isActive ? 1 : 0.82,
                        transition: "all 180ms ease",
                      }}
                      onMouseEnter={() => setHoveredCategory(slice.category)}
                      onMouseLeave={() => setHoveredCategory(null)}
                    />
                  );
                })}
              </svg>

              <div className="absolute inset-[52px] donut-core">
                <div className="text-center">
                  <p className="text-xs uppercase tracking-[0.24em] text-[var(--text-muted)]">
                    {activeSlice?.category || "Total"}
                  </p>
                  <p className="mt-3 text-2xl font-black text-[var(--text-main)]">
                    {formatCurrency(activeSlice?.amount || total)}
                  </p>
                  <p className="mt-2 text-sm text-[var(--text-muted)]">
                    {activeSlice ? `${activeSlice.share.toFixed(1)}% of total spend` : "All spending"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {slices.slice(0, 6).map((slice) => (
              <button
                key={slice.category}
                type="button"
                onMouseEnter={() => setHoveredCategory(slice.category)}
                onMouseLeave={() => setHoveredCategory(null)}
                className={`spend-row w-full text-left ${activeSlice?.category === slice.category ? "spend-row-active" : ""}`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="h-3.5 w-3.5 rounded-full"
                    style={{
                      backgroundColor: slice.color,
                      boxShadow: `0 0 12px ${slice.color}`,
                    }}
                  />
                  <div>
                    <p className="font-medium text-[var(--text-main)]">{slice.category}</p>
                    <p className="text-sm text-[var(--text-muted)]">
                      {slice.share.toFixed(1)}% of spend
                    </p>
                  </div>
                </div>
                <p className="text-sm font-semibold text-[var(--text-main)]">
                  {formatCurrency(slice.amount)}
                </p>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-3">
          <article className="mini-stat">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--text-muted)]">
              Top category
            </p>
            <p className="mt-2 text-lg font-bold text-[var(--text-main)]">
              {slices[0]?.category || "No data"}
            </p>
            <p className="mt-1 text-sm text-[var(--text-muted)]">
              {formatCurrency(slices[0]?.amount || 0)}
            </p>
          </article>
          <article className="mini-stat">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--text-muted)]">
              Avg expense
            </p>
            <p className="mt-2 text-lg font-bold text-[var(--text-main)]">
              {formatCurrency(averageExpense)}
            </p>
            <p className="mt-1 text-sm text-[var(--text-muted)]">
              Across {expenseTransactions.length} expense rows
            </p>
          </article>
          <article className="mini-stat">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--text-muted)]">
              Categories active
            </p>
            <p className="mt-2 text-lg font-bold text-[var(--text-main)]">{data.length}</p>
            <p className="mt-1 text-sm text-[var(--text-muted)]">
              Visible inside this spend window
            </p>
          </article>
        </div>
      </div>
    </div>
  );
}
