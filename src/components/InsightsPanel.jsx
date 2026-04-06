import { useState } from "react";
import { formatCurrency, formatPercent } from "../utils/formatters";

export default function InsightsPanel({ insights, summary }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const narrative =
    insights.smartInsights[0] ||
    "Financial activity remains stable overall, with spending concentrated in a small set of categories.";

  return (
    <section className="panel">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-[2rem] font-black tracking-tight text-[var(--text-main)]">
            How can I help you?
          </h3>
          <p className="mt-2 text-sm font-medium text-[var(--text-muted)]">AI summary</p>
        </div>
        <button
          type="button"
          onClick={() => setIsExpanded((current) => !current)}
          className="icon-button"
          title="Toggle expanded insights"
        >
          <span aria-hidden="true">{isExpanded ? "-" : "+"}</span>
        </button>
      </div>

      <div className="mt-5 insight-surface">
        <p className="text-base leading-8 text-[var(--text-main)]">{narrative}</p>
      </div>

      <div className="compact-stat-grid">
        <article className="insight-surface">
          <p className="field-label">Spending trends</p>
          <div className="mt-4 flex items-end justify-between gap-3">
            <p className="text-[2.2rem] font-black leading-none text-[var(--text-main)]">
              {insights.smartInsights.length}
            </p>
            <span className="rounded-full bg-[color:rgba(245,158,11,0.15)] px-3 py-1 text-xs font-semibold text-[var(--orange)]">
              Stable
            </span>
          </div>
        </article>

        <article className="insight-surface">
          <p className="field-label">Monthly comparison</p>
          <div className="mt-4 flex items-end justify-between gap-3">
            <p className="text-[2.2rem] font-black leading-none text-[var(--text-main)]">
              {formatPercent(insights.monthlyDelta)}
            </p>
            <span className="rounded-full bg-[color:rgba(16,185,129,0.14)] px-3 py-1 text-xs font-semibold text-[var(--accent-green)]">
              Processed
            </span>
          </div>
        </article>
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
        </div>
      </div>

      {isExpanded ? (
        <div className="mt-4 insight-surface text-sm leading-7 text-[var(--text-muted)]">
          <p>
            Current net balance sits at{" "}
            <span className="font-bold text-[var(--text-main)]">
              {formatCurrency(summary.balance)}
            </span>
            , while the active period for comparison is{" "}
            <span className="font-bold text-[var(--text-main)]">
              {insights.latestMonthLabel}
            </span>
            . The strongest pressure still comes from{" "}
            <span className="font-bold text-[var(--text-main)]">
              {insights.topCategory?.category || "your top category"}
            </span>
            , so this is the clearest place to optimize if you want stronger month-end retention.
          </p>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsExpanded(true)}
          className="insight-surface mt-4 flex w-full items-center justify-between text-left text-sm text-[var(--text-muted)]"
        >
          <span>
            Net balance:{" "}
            <span className="font-semibold text-[var(--text-main)]">
              {formatCurrency(summary.balance)}
            </span>
          </span>
          <span className="font-semibold text-[var(--primary)]">Read more</span>
        </button>
      )}
    </section>
  );
}
