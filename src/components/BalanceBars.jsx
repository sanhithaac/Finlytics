import { formatCurrency } from "../utils/formatters";

export default function BalanceBars({ data }) {
  if (data.length === 0) {
    return (
      <div className="chart-shell flex min-h-[280px] items-center justify-center">
        <p className="text-sm text-[var(--muted)]">
          Monthly balance bars will appear when transactions are available.
        </p>
      </div>
    );
  }

  const maxValue = Math.max(...data.map((item) => Math.abs(item.net)), 1);

  return (
    <div className="chart-shell cinematic-card h-full">
      <div className="cinematic-card-line" />
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="cinematic-caption">Pulse check</span>
          <h3 className="text-[2rem] font-black tracking-tight text-[var(--text-main)]">
            Monthly net balance
          </h3>
          <p className="section-copy">
            Quick comparison of gains and spend pressure over time.
          </p>
        </div>
        <button type="button" className="pill-button">
          Year view
        </button>
      </div>

      <div className="mt-7 space-y-4">
        {data.map((item) => {
          const width = `${(Math.abs(item.net) / maxValue) * 100}%`;
          const isPositive = item.net >= 0;

          return (
            <div
              key={item.monthKey}
              className="grid gap-2 sm:grid-cols-[70px,1fr,80px] sm:items-center"
            >
              <p className="text-sm font-medium text-[var(--muted)]">{item.label}</p>
              <div className="h-3 overflow-hidden rounded-full bg-[var(--surface-muted)]">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width,
                    backgroundColor: isPositive
                      ? "var(--accent-green)"
                      : "var(--accent-red)",
                  }}
                />
              </div>
              <p className="text-sm font-semibold text-[var(--text)]">
                {formatCurrency(item.net)}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
