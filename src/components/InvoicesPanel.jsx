import { formatCurrency, formatShortDate } from "../utils/formatters";

function PaymentScore({ completed, total }) {
  const score = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div>
      <div className="flex items-center justify-between text-xs text-[var(--muted)]">
        <span>Payment score</span>
        <span>{score}</span>
      </div>
      <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-[var(--surface-muted)]">
        <div
          className="h-full rounded-full bg-[linear-gradient(90deg,#f8c146,#d8a11c)]"
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

export default function InvoicesPanel({ transactions, onCreateInvoice }) {
  const items = transactions.slice(0, 4);
  const completed = items.filter((transaction) => transaction.status === "completed").length;

  return (
    <section className="panel h-full p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="section-title">Invoices</h3>
          <p className="section-copy">Recent outgoing payments and their current status.</p>
        </div>
        <button
          type="button"
          onClick={onCreateInvoice}
          className="icon-button"
          title="Add transaction"
        >
          <span aria-hidden="true">+</span>
        </button>
      </div>

      <div className="mt-6">
        <PaymentScore completed={completed} total={items.length} />
      </div>

      <div className="mt-5 space-y-4">
        {items.length === 0 ? (
          <p className="text-sm text-[var(--muted)]">No invoices available in the current view.</p>
        ) : (
          items.map((transaction) => (
            <article
              key={transaction.id}
              className="invoice-row flex items-center justify-between gap-3"
            >
              <div>
                <p className="text-xs text-[var(--muted)]">{formatShortDate(transaction.date)}</p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                      transaction.status === "completed"
                        ? "bg-[color:rgba(16,185,129,0.12)] text-[var(--accent-green)]"
                        : "bg-[color:rgba(239,68,68,0.12)] text-[var(--accent-red)]"
                    }`}
                  >
                    {transaction.status}
                  </span>
                  <span className="text-sm font-medium text-[var(--text)]">{transaction.title}</span>
                </div>
                <p className="mt-1 text-xs text-[var(--muted)]">{transaction.category}</p>
              </div>
              <p className="text-sm font-semibold text-[var(--text)]">
                {formatCurrency(transaction.amount)}
              </p>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
