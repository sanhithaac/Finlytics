import { useEffect, useState } from "react";

const defaultForm = {
  title: "",
  amount: "",
  type: "expense",
  category: "Food",
  status: "completed",
  date: "2026-04-05",
  note: "",
};

const categoryOptions = [
  "Salary",
  "Bonus",
  "Freelance",
  "Investments",
  "Housing",
  "Food",
  "Utilities",
  "Transport",
  "Health",
  "Entertainment",
  "Shopping",
  "Travel",
];

export default function TransactionModal({
  isOpen,
  role,
  transaction,
  onClose,
  onSubmit,
  onDelete,
}) {
  const [form, setForm] = useState(defaultForm);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    if (transaction) {
      setForm({
        ...transaction,
        amount: String(transaction.amount),
      });
      return;
    }

    setForm(defaultForm);
  }, [isOpen, transaction]);

  if (!isOpen) {
    return null;
  }

  const isViewer = role !== "admin";

  function updateField(name, value) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (isViewer) {
      return;
    }

    onSubmit({
      ...transaction,
      ...form,
      amount: Number(form.amount),
      id: transaction?.id || crypto.randomUUID(),
    });
  }

  function handleDelete() {
    if (isViewer || !transaction) {
      return;
    }

    onDelete(transaction.id);
  }

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-slate-950/55 px-4 py-8 backdrop-blur-sm">
      <div className="modal-shell w-full max-w-2xl rounded-[2rem] p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="section-title">
              {transaction ? "Edit transaction" : "Add transaction"}
            </h3>
            <p className="section-copy">
              {isViewer
                ? "Viewer role can inspect the form but cannot save changes."
                : "Admin can create and update finance entries for demo purposes."}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="secondary-button rounded-full px-3 py-2"
          >
            Close
          </button>
        </div>

        <form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
          <label className="md:col-span-2">
            <span className="field-label">Title</span>
            <input
              required
              value={form.title}
              disabled={isViewer}
              onChange={(event) => updateField("title", event.target.value)}
              className="field mt-2"
              placeholder="Ex: Monthly salary"
            />
          </label>

          <label>
            <span className="field-label">Amount</span>
            <input
              required
              min="1"
              step="1"
              type="number"
              value={form.amount}
              disabled={isViewer}
              onChange={(event) => updateField("amount", event.target.value)}
              className="field mt-2"
              placeholder="1200"
            />
          </label>

          <label>
            <span className="field-label">Date</span>
            <input
              required
              type="date"
              value={form.date}
              disabled={isViewer}
              onChange={(event) => updateField("date", event.target.value)}
              className="field mt-2"
            />
          </label>

          <label>
            <span className="field-label">Type</span>
            <select
              value={form.type}
              disabled={isViewer}
              onChange={(event) => updateField("type", event.target.value)}
              className="field mt-2"
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </label>

          <label>
            <span className="field-label">Status</span>
            <select
              value={form.status}
              disabled={isViewer}
              onChange={(event) => updateField("status", event.target.value)}
              className="field mt-2"
            >
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
            </select>
          </label>

          <label className="md:col-span-2">
            <span className="field-label">Category</span>
            <select
              value={form.category}
              disabled={isViewer}
              onChange={(event) => updateField("category", event.target.value)}
              className="field mt-2"
            >
              {categoryOptions.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>

          <label className="md:col-span-2">
            <span className="field-label">Note</span>
            <textarea
              rows="4"
              value={form.note}
              disabled={isViewer}
              onChange={(event) => updateField("note", event.target.value)}
              className="field mt-2 resize-none"
              placeholder="Optional context for the transaction"
            />
          </label>

          <div className="md:col-span-2 flex flex-wrap items-center justify-between gap-3 pt-2">
            <div>
              {transaction ? (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="rounded-xl border border-[color:rgba(239,68,68,0.35)] px-4 py-2.5 text-sm font-semibold text-[var(--accent-red)] transition duration-200 hover:-translate-y-0.5 hover:bg-[color:rgba(239,68,68,0.12)] disabled:cursor-not-allowed disabled:opacity-45"
                  disabled={isViewer}
                >
                  Delete transaction
                </button>
              ) : (
                <span className="text-sm text-[var(--muted)]">
                  Saved locally for this demo experience.
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="secondary-button"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isViewer}
              className="primary-button disabled:cursor-not-allowed disabled:opacity-45"
            >
              {transaction ? "Save changes" : "Add transaction"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
