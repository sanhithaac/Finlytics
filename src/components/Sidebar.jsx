import { useState } from "react";

function SidebarIcon({ type }) {
  const className = "h-6 w-6";

  if (type === "overview") {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M4 5h7v6H4zM13 5h7v14h-7zM4 13h7v6H4z" strokeLinejoin="round" />
      </svg>
    );
  }

  if (type === "revenue") {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M5 18V9M12 18V5M19 18v-7" strokeLinecap="round" />
      </svg>
    );
  }

  if (type === "calendar") {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="4" y="6" width="16" height="14" rx="3" />
        <path d="M8 4v4M16 4v4M4 10h16" strokeLinecap="round" />
      </svg>
    );
  }

  if (type === "insights") {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="7" />
        <path d="M12 8v4l2.5 1.5" strokeLinecap="round" />
      </svg>
    );
  }

  if (type === "spending") {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 4a8 8 0 1 0 8 8h-8z" strokeLinejoin="round" />
        <path d="M12 4a8 8 0 0 1 8 8" strokeLinecap="round" />
      </svg>
    );
  }

  if (type === "transactions") {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M6 7h12M6 12h12M6 17h8" strokeLinecap="round" />
      </svg>
    );
  }

  if (type === "theme") {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 3v2.2M12 18.8V21M4.9 4.9l1.5 1.5M17.6 17.6l1.5 1.5M3 12h2.2M18.8 12H21M4.9 19.1l1.5-1.5M17.6 6.4l1.5-1.5" strokeLinecap="round" />
        <circle cx="12" cy="12" r="3.7" />
      </svg>
    );
  }

  if (type === "add") {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 5v14M5 12h14" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M6 12h12" strokeLinecap="round" />
      <path d="M9 7h9M9 17h9" strokeLinecap="round" />
      <circle cx="6" cy="7" r="1" fill="currentColor" stroke="none" />
      <circle cx="6" cy="12" r="1" fill="currentColor" stroke="none" />
      <circle cx="6" cy="17" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export default function Sidebar({
  activeItem,
  onSelect,
  onToggleTheme,
  onAddTransaction,
  onResetFilters,
  canResetFilters,
  role,
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const items = [
    { id: "overview", label: "Overview" },
    { id: "revenue", label: "Revenue" },
    { id: "calendar", label: "Calendar" },
    { id: "insights", label: "Insights" },
    { id: "spending", label: "Spending" },
    { id: "transactions", label: "Transactions" },
  ];

  return (
    <aside className="w-full xl:sticky xl:top-4 xl:w-auto xl:self-start">
      <div
        className={`sidebar-shell flex h-full flex-row items-center gap-3 p-3 xl:min-h-[calc(100vh-2rem)] xl:flex-col xl:justify-start ${
          isExpanded ? "sidebar-shell-expanded xl:w-[258px]" : "xl:w-[92px]"
        }`}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        <div className="hidden w-full px-2 pb-3 pt-1 xl:block">
          <div className="rail-text">
            <p className="text-sm font-bold tracking-[0.02em] text-[var(--text-main)]">
              Finlytics
            </p>
            <p className="mt-1 text-xs text-[var(--text-muted)]">
              Track. Analyze. Grow.
            </p>
          </div>
        </div>

        <div className="hidden w-full px-2 xl:block">
          <span className="sidebar-section-label rail-text">Main navigation</span>
        </div>

        <nav className="grid flex-1 grid-cols-3 gap-2 md:grid-cols-4 xl:flex xl:w-full xl:flex-col">
          {items.map((item) => {
            const isActive = item.id === activeItem;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setIsExpanded(true);
                  onSelect(item.id);
                }}
                className={`rail-item ${isActive ? "rail-item-active" : ""}`}
                title={item.label}
                aria-current={isActive ? "page" : undefined}
              >
                <SidebarIcon type={item.id} />
                <span className="rail-text">{item.label}</span>
                <span className="rail-label xl:hidden">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="hidden w-full px-2 xl:block">
          <span className="sidebar-section-label rail-text">Quick actions</span>
        </div>

        <div className="grid grid-cols-3 gap-2 md:grid-cols-3 xl:flex xl:w-full xl:flex-col xl:border-t xl:border-[var(--border)] xl:pt-3">
          <button
            type="button"
            onClick={onToggleTheme}
            className="rail-item"
            title="Toggle theme"
          >
            <SidebarIcon type="theme" />
            <span className="rail-text">Theme</span>
          </button>
          <button
            type="button"
            onClick={onAddTransaction}
            disabled={role !== "admin"}
            className="rail-item disabled:cursor-not-allowed disabled:opacity-45"
            title={role === "admin" ? "Add transaction" : "Admin only"}
          >
            <SidebarIcon type="add" />
            <span className="rail-text">Add transaction</span>
          </button>
          <button
            type="button"
            onClick={onResetFilters}
            disabled={!canResetFilters}
            className="rail-item disabled:cursor-not-allowed disabled:opacity-45"
            title="Reset filters"
          >
            <SidebarIcon type="reset" />
            <span className="rail-text">Reset filters</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
