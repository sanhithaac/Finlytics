export default function FiltersBar({
  filters,
  categories,
  hasActiveFilters,
  onChange,
  onReset,
}) {
  const activeFilterCount = [
    filters.category !== "all",
    filters.type !== "all",
    Boolean(filters.startDate),
    Boolean(filters.endDate),
    filters.sortBy !== "date-desc",
  ].filter(Boolean).length;

  return (
    <div className="controls-shell cinematic-card">
      <div className="cinematic-card-line" />
      <div className="controls-header">
        <div>
          <span className="cinematic-caption">Query layer</span>
          <h3 className="text-[2rem] font-black tracking-tight text-[var(--text-main)]">
            Transaction controls
          </h3>
          <p className="section-copy">
            Fine-tune results by category, type, dates, and sorting while search stays
            available in the top bar.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span className="controls-note">
            {activeFilterCount > 0 ? `${activeFilterCount} filters active` : "Default view"}
          </span>
          <button
            type="button"
            onClick={onReset}
            disabled={!hasActiveFilters}
            className="secondary-button disabled:cursor-not-allowed disabled:opacity-45"
          >
            Clear filters
          </button>
        </div>
      </div>

      <div className="controls-summary">
        <span className="controls-badge">Search reacts instantly without reload</span>
        <span className="controls-badge">Results stay synced with date and role filters</span>
      </div>

      <div className="controls-grid">
        <label>
          <span className="field-label">Category</span>
          <select
            value={filters.category}
            onChange={(event) => onChange({ category: event.target.value })}
            className="field mt-2"
          >
            <option value="all">All categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span className="field-label">Type</span>
          <select
            value={filters.type}
            onChange={(event) => onChange({ type: event.target.value })}
            className="field mt-2"
          >
            <option value="all">All types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </label>

        <label>
          <span className="field-label">Start date</span>
          <input
            value={filters.startDate}
            onChange={(event) => onChange({ startDate: event.target.value })}
            type="date"
            className="field mt-2"
          />
        </label>

        <label>
          <span className="field-label">Sort by</span>
          <select
            value={filters.sortBy}
            onChange={(event) => onChange({ sortBy: event.target.value })}
            className="field mt-2"
          >
            <option value="date-desc">Newest first</option>
            <option value="date-asc">Oldest first</option>
            <option value="amount-desc">Highest amount</option>
            <option value="amount-asc">Lowest amount</option>
          </select>
        </label>

        <label>
          <span className="field-label">End date</span>
          <input
            value={filters.endDate}
            onChange={(event) => onChange({ endDate: event.target.value })}
            type="date"
            className="field mt-2"
          />
        </label>

        <label className="md:col-span-2 xl:col-span-5">
          <span className="field-label">Search</span>
          <input
            value={filters.search}
            onChange={(event) => onChange({ search: event.target.value })}
            className="field mt-2"
            placeholder="Search transaction title, category, or note"
          />
        </label>
      </div>
    </div>
  );
}
