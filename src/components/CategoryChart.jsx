import { formatCurrency } from "../utils/formatters";

const palette = [
  "var(--primary)",
  "var(--accent)",
  "#3B82F6",
  "#F59E0B",
  "#22C55E",
  "#EC4899",
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

export default function CategoryChart({ data, spendingWindow, onCycleWindow }) {
  const total = data.reduce((sum, item) => sum + item.amount, 0);

  if (data.length === 0 || total === 0) {
    return (
      <div className="chart-shell flex min-h-[320px] items-center justify-center">
        <p className="max-w-xs text-center text-sm text-[var(--muted)]">
          Spending breakdown appears once expense data is available in the current view.
        </p>
      </div>
    );
  }

  let currentAngle = 0;
  const slices = data.map((item, index) => {
    const angle = (item.amount / total) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    currentAngle = endAngle;

    return {
      ...item,
      color: palette[index % palette.length],
      path: describeArc(90, 90, 60, startAngle, endAngle),
      share: (item.amount / total) * 100,
    };
  });

  return (
    <div className="chart-shell h-full">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="neon-pill">Breakdown</div>
          <h3 className="section-title mt-4">Spending</h3>
          <p className="section-copy">Category mix across the active transaction view.</p>
        </div>
        <button type="button" onClick={onCycleWindow} className="pill-button">
          {spendingWindow === "30d"
            ? "Last 30 Days"
            : spendingWindow === "90d"
              ? "Last 90 Days"
              : "All Time"}
        </button>
      </div>

      <div className="neon-frame mt-6 grid gap-6 p-5 lg:grid-cols-[190px,1fr] lg:items-center">
        <div className="mx-auto">
          <div className="relative h-44 w-44">
            <svg viewBox="0 0 180 180" className="h-44 w-44 -rotate-90">
              <circle
                cx="90"
                cy="90"
                r="60"
                fill="none"
                stroke="rgba(167,139,250,0.12)"
                strokeWidth="20"
              />
              {slices.map((slice) => (
                <path
                  key={slice.category}
                  d={slice.path}
                  fill="none"
                  stroke={slice.color}
                  strokeWidth="20"
                  strokeLinecap="round"
                  style={{
                    filter: `drop-shadow(0 0 10px ${slice.color})`,
                  }}
                />
              ))}
            </svg>
            <div className="absolute inset-[28px] donut-core">
              <div className="text-center">
                <p className="text-xs uppercase tracking-[0.24em] text-[var(--text-muted)]">Total</p>
                <p className="mt-2 text-xl font-bold text-[var(--text-main)]">{formatCurrency(total)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {slices.map((slice) => (
            <div
              key={slice.category}
              className="spend-row"
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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
