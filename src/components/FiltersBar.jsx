export default function FiltersBar({
  filters,
  categories,
  categoryGroups,
  hasActiveFilters,
  onChange,
  onReset,
}) {
  const activeFilterCount = [
    filters.categoryGroup !== "all",
    filters.category !== "all",
    filters.type !== "all",
    filters.status !== "all",
    Boolean(filters.startDate),
    Boolean(filters.endDate),
    filters.sortBy !== "date-desc",
    filters.groupBy !== "none",
  ].filter(Boolean).length;

  function handleCategoryGroupChange(nextGroup) {
    const isCategoryStillValid = categoryGroups
      .find((group) => group.id === nextGroup)
      ?.categories.includes(filters.category);

    onChange({
      categoryGroup: nextGroup,
      category:
        nextGroup === "all" || isCategoryStillValid || filters.category === "all"
          ? filters.category
          : "all",
    });
  }

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
            Filter by grouped categories, status, dates, and sorting without losing your current
            search context.
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
        <span className="controls-badge">Category filters are now grouped for faster scanning</span>
        <span className="controls-badge">Sort and group controls update the table instantly</span>
        <span className="controls-badge">Search stays synced with the header field above</span>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => handleCategoryGroupChange("all")}
          className={`pill-button ${filters.categoryGroup === "all" ? "pill-button-active" : ""}`}
        >
          All groups
        </button>
        {categoryGroups.map((group) => (
          <button
            key={group.id}
            type="button"
            onClick={() => handleCategoryGroupChange(group.id)}
            className={`pill-button ${filters.categoryGroup === group.id ? "pill-button-active" : ""}`}
          >
            {group.label}
          </button>
        ))}
      </div>

      <div className="controls-grid">
        <label>
          <span className="field-label">Category group</span>
          <select
            value={filters.categoryGroup}
            onChange={(event) => handleCategoryGroupChange(event.target.value)}
            className="field mt-2"
          >
            <option value="all">All groups</option>
            {categoryGroups.map((group) => (
              <option key={group.id} value={group.id}>
                {group.label}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span className="field-label">Category</span>
          <select
            value={filters.category}
            onChange={(event) => onChange({ category: event.target.value })}
            className="field mt-2"
          >
            <option value="all">All categories</option>
            {categoryGroups.map((group) => {
              if (filters.categoryGroup !== "all" && filters.categoryGroup !== group.id) {
                return null;
              }

              return (
                <optgroup key={group.id} label={group.label}>
                  {group.categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </optgroup>
              );
            })}
            {categoryGroups.length === 0
              ? categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))
              : null}
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
          <span className="field-label">Status</span>
          <select
            value={filters.status}
            onChange={(event) => onChange({ status: event.target.value })}
            className="field mt-2"
          >
            <option value="all">All status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
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
          <span className="field-label">End date</span>
          <input
            value={filters.endDate}
            onChange={(event) => onChange({ endDate: event.target.value })}
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
          <span className="field-label">Group by</span>
          <select
            value={filters.groupBy}
            onChange={(event) => onChange({ groupBy: event.target.value })}
            className="field mt-2"
          >
            <option value="none">No grouping</option>
            <option value="category">Category</option>
            <option value="type">Type</option>
            <option value="date">Date</option>
          </select>
        </label>

        <label className="md:col-span-2 xl:col-span-4">
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
