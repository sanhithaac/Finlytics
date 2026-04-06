import { formatCurrency } from "../utils/formatters";

function getCalendarDays(referenceDate, selectedDate) {
  const today = new Date();
  const selected = selectedDate ? new Date(`${selectedDate}T00:00:00`) : null;
  const firstDay = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), 1);
  const startOffset = firstDay.getDay();
  const firstVisible = new Date(firstDay);
  firstVisible.setDate(firstDay.getDate() - startOffset);

  return Array.from({ length: 35 }, (_, index) => {
    const date = new Date(firstVisible);
    date.setDate(firstVisible.getDate() + index);

    return {
      key: date.toISOString(),
      isoDate: date.toISOString().slice(0, 10),
      value: date.getDate(),
      isCurrentMonth: date.getMonth() === referenceDate.getMonth(),
      isSelected: selected ? date.toDateString() === selected.toDateString() : false,
      isToday: date.toDateString() === today.toDateString(),
    };
  });
}

export default function CalendarPanel({
  transactions,
  summary,
  visibleMonth,
  selectedDate,
  onPreviousMonth,
  onNextMonth,
  onSelectDate,
}) {
  const activeMonth = visibleMonth || new Date("2026-04-01");
  const calendarDays = getCalendarDays(activeMonth, selectedDate);
  const monthLabel = activeMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
  const monthStart = new Date(activeMonth.getFullYear(), activeMonth.getMonth(), 1);
  const monthEnd = new Date(activeMonth.getFullYear(), activeMonth.getMonth() + 1, 0);
  const expenses = transactions
    .filter(
      (transaction) =>
        transaction.type === "expense" &&
        new Date(transaction.date) >= monthStart &&
        new Date(transaction.date) <= monthEnd,
    )
    .reduce((total, transaction) => total + transaction.amount, 0);
  const income = Math.max(summary.income, 1);
  const change = ((summary.balance / income) * 100).toFixed(1);

  return (
    <section className="panel cinematic-card h-full p-4 sm:p-5">
      <div className="cinematic-card-line" />
      <div className="flex items-center justify-between">
        <div>
          <span className="cinematic-caption">Date focus</span>
          <h3 className="mt-2 text-base font-semibold text-[var(--text)]">{monthLabel}</h3>
        </div>
        <div className="flex items-center gap-2">
        <button type="button" onClick={onPreviousMonth} className="icon-button">
          <span aria-hidden="true">&lt;</span>
        </button>
        <button type="button" onClick={onNextMonth} className="icon-button">
          <span aria-hidden="true">&gt;</span>
        </button>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-7 gap-2 text-center">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <span
            key={day}
            className="text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--muted)]"
          >
            {day.slice(0, 1)}
          </span>
        ))}

        {calendarDays.map((day) => (
          <button
            type="button"
            key={day.key}
            onClick={() => onSelectDate?.(day.isoDate)}
            className={`calendar-cell ${day.isSelected ? "calendar-cell-active" : ""} ${
              day.isToday ? "calendar-cell-today" : ""
            } ${
              day.isCurrentMonth ? "" : "calendar-cell-muted"
            } transition duration-200 hover:scale-105`}
            title={`Filter ${day.isoDate}`}
          >
            {day.value}
          </button>
        ))}
      </div>

      <div className="soft-panel mt-5 rounded-[24px] p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] text-[var(--text)]">
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path d="M6 17h12M7 17V9M12 17V6M17 17v-4" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
                This month spend
              </p>
              <p className="mt-1 text-[1.95rem] font-semibold leading-none text-[var(--text)]">
                {formatCurrency(expenses)}
              </p>
              <p className="mt-2 text-xs text-[var(--muted)]">
                Select any day to focus the transactions list instantly.
              </p>
            </div>
          </div>
          <span className="rounded-full bg-[color:rgba(46,204,113,0.12)] px-2.5 py-1 text-xs font-semibold text-[var(--accent-green)]">
            {change}%
          </span>
        </div>
      </div>
    </section>
  );
}
