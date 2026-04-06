import { formatCurrency, formatPercent } from "../utils/formatters";

export default function InsightsPanel({ insights, summary }) {
  const comparisonReady =
    insights.latestMonthLabel !== "No recent month" && insights.previousMonthLabel !== "No previous month";

  return (
    <section className="panel h-full">
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="cinematic-caption">Insight deck</span>
          <h3 className="text-[2rem] font-black tracking-tight text-[var(--text-main)]">
            Month compare
          </h3>
          <p className="mt-2 text-sm text-[var(--text-muted)]">
            A clearer before-versus-now snapshot instead of an empty placeholder panel.
          </p>
        </div>
        <div className="hero-chip">
          <span className="status-orb" />
          {comparisonReady ? "Comparison ready" : "Building view"}
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        <article className="insight-surface">
          <p className="field-label">Current month</p>
          <p className="mt-4 text-2xl font-black text-[var(--text-main)]">
            {insights.latestMonthLabel}
          </p>
          <p className="mt-3 text-sm text-[var(--text-muted)]">
            Net {formatCurrency(insights.latestMonthNet)}
          </p>
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            Income {formatCurrency(insights.latestMonthIncome)}
          </p>
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            Expenses {formatCurrency(insights.latestMonthExpenses)}
          </p>
        </article>

        <article className="insight-surface">
          <p className="field-label">Previous month</p>
          <p className="mt-4 text-2xl font-black text-[var(--text-main)]">
            {insights.previousMonthLabel}
          </p>
          <p className="mt-3 text-sm text-[var(--text-muted)]">
            Net {formatCurrency(insights.previousMonthNet)}
          </p>
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            Income {formatCurrency(insights.previousMonthIncome)}
          </p>
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            Expenses {formatCurrency(insights.previousMonthExpenses)}
          </p>
        </article>
      </div>

      <div className="compact-stat-grid">
        <article className="insight-surface">
          <p className="field-label">Net change</p>
          <div className="mt-4 flex items-end justify-between gap-3">
            <p className="text-[2.2rem] font-black leading-none text-[var(--text-main)]">
              {formatPercent(insights.monthlyDelta)}
            </p>
            <span className="rounded-full bg-[color:rgba(34,197,94,0.14)] px-3 py-1 text-xs font-semibold text-[var(--accent-green)]">
              Month over month
            </span>
          </div>
        </article>

        <article className="insight-surface">
          <p className="field-label">Spend change</p>
          <div className="mt-4 flex items-end justify-between gap-3">
            <p className="text-[2.2rem] font-black leading-none text-[var(--text-main)]">
              {formatPercent(insights.spendDelta)}
            </p>
            <span className="rounded-full bg-[color:rgba(245,158,11,0.15)] px-3 py-1 text-xs font-semibold text-[var(--orange)]">
              Expense shift
            </span>
          </div>
        </article>
      </div>

      <div className="mt-4 insight-surface">
        <p className="field-label">Key reads</p>
        <div className="mt-4 grid gap-3">
          {insights.smartInsights.map((item) => (
            <div key={item} className="insight-line">
              <span className="insight-line-dot" />
              <p className="text-sm leading-7 text-[var(--text-main)]">{item}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 insight-surface">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-[var(--text-muted)]">
          <span>
            Highest spend:{" "}
            <span className="font-semibold text-[var(--text-main)]">
              {insights.topCategory?.category || "No data"}
            </span>{" "}
            at{" "}
            <span className="font-semibold text-[var(--text-main)]">
              {formatCurrency(insights.topCategory?.amount || 0)}
            </span>
          </span>
          <span>
            Avg transaction:{" "}
            <span className="font-semibold text-[var(--text-main)]">
              {formatCurrency(insights.averageTransaction)}
            </span>
          </span>
          <span>
            Savings rate:{" "}
            <span className="font-semibold text-[var(--text-main)]">
              {formatPercent(insights.savingsRate)}
            </span>
          </span>
          <span>
            Current balance:{" "}
            <span className="font-semibold text-[var(--text-main)]">
              {formatCurrency(summary.balance)}
            </span>
          </span>
        </div>
      </div>
    </section>
  );
}
