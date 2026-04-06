import { useState } from "react";
import { formatCurrency } from "../utils/formatters";

export default function BalanceBars({ data }) {
  const [hoveredMonth, setHoveredMonth] = useState(null);

  if (data.length === 0) {
    return (
      <div className="chart-shell flex min-h-[280px] items-center justify-center">
        <p className="text-sm text-[var(--muted)]">
          Monthly balance bars will appear when transactions are available.
        </p>
      </div>
    );
  }

  const maxActivity = Math.max(
    ...data.map((item) => Math.max(item.income, item.expenses, Math.abs(item.net))),
    1,
  );
  const latestBalance = data[data.length - 1]?.balance || 0;
  const activeMonth = hoveredMonth
    ? data.find((item) => item.monthKey === hoveredMonth) || data[data.length - 1]
    : data[data.length - 1];

  return (
    <div className="chart-shell cinematic-card h-full">
      <div className="cinematic-card-line" />
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="cinematic-caption">Pulse check</span>
          <h3 className="text-[2rem] font-black tracking-tight text-[var(--text-main)]">
            Income vs expenses
          </h3>
          <p className="section-copy">
            Hover rows to compare inflow and outflow without leaving the main screen.
          </p>
        </div>
        <div className="hero-chip">
          <span className="status-orb" />
          Balance {formatCurrency(latestBalance)}
        </div>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-3">
        <article className="mini-stat">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--text-muted)]">
            Focus month
          </p>
          <p className="mt-2 text-lg font-bold text-[var(--text-main)]">{activeMonth.label}</p>
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            Net {formatCurrency(activeMonth.net)}
          </p>
        </article>
        <article className="mini-stat">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--text-muted)]">
            Income
          </p>
          <p className="mt-2 text-lg font-bold text-[var(--accent-green)]">
            {formatCurrency(activeMonth.income)}
          </p>
          <p className="mt-1 text-sm text-[var(--text-muted)]">Visible inflow for the month</p>
        </article>
        <article className="mini-stat">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--text-muted)]">
            Expenses
          </p>
          <p className="mt-2 text-lg font-bold text-[var(--accent-red)]">
            {formatCurrency(activeMonth.expenses)}
          </p>
          <p className="mt-1 text-sm text-[var(--text-muted)]">Visible outflow for the month</p>
        </article>
      </div>

      <div className="mt-7 space-y-4">
        {data.map((item) => {
          const incomeWidth = `${(item.income / maxActivity) * 100}%`;
          const expenseWidth = `${(item.expenses / maxActivity) * 100}%`;
          const isActive = item.monthKey === activeMonth.monthKey;

          return (
            <button
              key={item.monthKey}
              type="button"
              onMouseEnter={() => setHoveredMonth(item.monthKey)}
              onMouseLeave={() => setHoveredMonth(null)}
              className={`balance-row w-full lg:grid-cols-[112px,minmax(0,1fr)] lg:items-center ${isActive ? "balance-row-active" : ""}`}
            >
              <div>
                <p className="text-sm font-semibold text-[var(--text-main)]">{item.label}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">
                  Net {formatCurrency(item.net)}
                </p>
              </div>

              <div className="space-y-2">
                <div>
                  <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
                    <span>Income</span>
                    <span>{formatCurrency(item.income)}</span>
                  </div>
                  <div className="balance-track">
                    <div className="balance-fill balance-fill-income" style={{ width: incomeWidth }} />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
                    <span>Expenses</span>
                    <span>{formatCurrency(item.expenses)}</span>
                  </div>
                  <div className="balance-track">
                    <div className="balance-fill balance-fill-expense" style={{ width: expenseWidth }} />
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
