import { formatCurrency, formatShortDate } from "../utils/formatters";

function groupTransactions(transactions, groupBy) {
  if (!groupBy || groupBy === "none") {
    return [{ label: "", items: transactions }];
  }

  const grouped = transactions.reduce((accumulator, transaction) => {
    const label =
      groupBy === "date"
        ? formatShortDate(transaction.date)
        : groupBy === "type"
          ? transaction.type
          : transaction.category;

    if (!accumulator[label]) {
      accumulator[label] = [];
    }

    accumulator[label].push(transaction);
    return accumulator;
  }, {});

  return Object.entries(grouped).map(([label, items]) => ({ label, items }));
}

function statusStyles(status) {
  if (status === "pending") {
    return "bg-[color:rgba(245,158,11,0.16)] text-[color:rgb(217,119,6)]";
  }

  return "bg-[color:rgba(16,185,129,0.16)] text-[var(--accent-green)]";
}

function typeStyles(type) {
  return type === "income"
    ? "bg-[color:rgba(16,185,129,0.12)] text-[var(--accent-green)]"
    : "bg-[color:rgba(239,68,68,0.12)] text-[var(--accent-red)]";
}

export default function TransactionTable({
  transactions,
  role,
  groupBy,
  onEdit,
  onDelete,
  onClearFilters,
  onExportCsv,
  onExportJson,
}) {
  const groupedTransactions = groupTransactions(transactions, groupBy);

  if (transactions.length === 0) {
    return (
      <div className="panel flex min-h-[260px] flex-col items-center justify-center p-8 text-center">
        <p className="text-lg font-semibold text-[var(--text)]">
          No transactions match these filters
        </p>
        <p className="mt-2 max-w-md text-sm text-[var(--muted)]">
          Try broadening the date range, changing category filters, or clearing search
          to bring results back.
        </p>
        <button
          type="button"
          onClick={onClearFilters}
          className="primary-button mt-5"
        >
          Reset view
        </button>
      </div>
    );
  }

  return (
    <div className="transactions-panel cinematic-card overflow-hidden">
      <div className="cinematic-card-line" />
      <div className="transactions-toolbar">
        <div>
          <span className="cinematic-caption">Activity ledger</span>
          <h3 className="text-[2rem] font-black tracking-tight text-[var(--text-main)]">
            Transactions
          </h3>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Search, filter, and review the latest finance activity.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button type="button" onClick={onExportCsv} className="secondary-button">
            Export CSV
          </button>
          <button type="button" onClick={onExportJson} className="secondary-button">
            Export JSON
          </button>
          <span className="results-pill">
            {transactions.length} results
          </span>
        </div>
      </div>

      <div className="table-shell overflow-x-auto">
        <table className="min-w-full divide-y divide-[var(--border)]">
          <thead style={{ background: "var(--table-head)" }}>
            <tr>
              {["Transaction", "Date", "Category", "Type", "Status", "Amount", "Action"].map(
                (heading) => (
                  <th key={heading} className="table-head-cell">
                    {heading}
                  </th>
                ),
              )}
            </tr>
          </thead>
          {groupedTransactions.map((group, groupIndex) => (
            <tbody key={`${group.label || "all"}-${groupIndex}`} className="divide-y divide-[var(--border)]">
              {group.label ? (
                <tr className="group-row">
                  <td colSpan={7} className="px-5 py-3">
                    <div className="group-row-label">
                      <span>{group.label}</span>
                      <span>{group.items.length} items</span>
                    </div>
                  </td>
                </tr>
              ) : null}
              {group.items.map((transaction) => (
                <tr key={transaction.id} className="transaction-row">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <span className="transaction-dot" />
                      <div>
                        <p className="text-lg font-bold text-[var(--text)]">{transaction.title}</p>
                        <p className="mt-1 text-sm text-[var(--muted)]">{transaction.note}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-[var(--muted)]">
                    {formatShortDate(transaction.date)}
                  </td>
                  <td className="px-5 py-4">
                    <span className="transaction-meta">
                      {transaction.category}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-sm font-semibold capitalize ${typeStyles(
                        transaction.type,
                      )}`}
                    >
                      {transaction.type}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-sm font-semibold capitalize ${statusStyles(
                        transaction.status,
                      )}`}
                    >
                      {transaction.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm font-semibold text-[var(--text)]">
                    <span
                      className={
                        transaction.type === "income"
                          ? "text-[var(--accent-green)]"
                          : "text-[var(--accent-red)]"
                      }
                    >
                      {transaction.type === "income" ? "+" : "-"}
                      {formatCurrency(transaction.amount)}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    {role === "admin" ? (
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => onEdit(transaction)}
                          className="transaction-action"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete(transaction.id)}
                          className="transaction-action transaction-action-danger"
                        >
                          Delete
                        </button>
                      </div>
                    ) : (
                      <span className="text-sm text-[var(--muted)]">Read only</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          ))}
        </table>
      </div>
    </div>
  );
}
