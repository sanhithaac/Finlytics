import { useState } from "react";

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="11" cy="11" r="6.5" />
      <path d="M16 16l4.5 4.5" strokeLinecap="round" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M8 17h8" strokeLinecap="round" />
      <path d="M9 17V11a3 3 0 0 1 6 0v6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 17h10l-1.1-1.8a2.7 2.7 0 0 1-.4-1.4V11a5.5 5.5 0 0 0-11 0v2.8c0 .5-.1 1-.4 1.4L7 17Z" />
    </svg>
  );
}

export default function Header({
  appName,
  role,
  theme,
  search,
  onSearchChange,
  onRoleChange,
  onToggleTheme,
  onAddTransaction,
}) {
  const [showNotifications, setShowNotifications] = useState(false);
  const notifications = [
    "Monthly insights are ready",
    "Transactions are saved to local storage",
    "Viewer mode keeps the dashboard read-only",
  ];
  const statusItems = [
    { label: "Active view", value: role === "admin" ? "Admin" : "Viewer" },
    { label: "Theme", value: theme === "dark" ? "Neon" : "Light" },
    { label: "Sync", value: "Local storage" },
  ];

  return (
    <header className="flex flex-col gap-4 pb-5">
      <div className="header-shell">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-xs font-bold uppercase tracking-[0.34em] text-[var(--text-muted)]">
              Finance cockpit
            </p>
            <div className="hero-chip">
              <span className="status-orb" />
              {role === "admin" ? "Admin access" : "Viewer mode"}
            </div>
          </div>
          <h1 className="mt-2 text-[clamp(2.8rem,6vw,4.75rem)] font-black tracking-[-0.06em] text-[var(--text-main)]">
            {appName}
          </h1>
          <p className="mt-2 text-lg font-semibold text-[var(--text-main)]">Dashboard overview</p>
          <p className="mt-2 text-sm text-[var(--text-muted)]">
            {appName} helps you track cash flow, review activity, and monitor growth with a clean finance workspace.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {statusItems.map((item) => (
              <span key={item.label} className="header-chip">
                <span className="text-[var(--text-muted)]">{item.label}</span>
                <span className="font-semibold text-[var(--text-main)]">{item.value}</span>
              </span>
            ))}
          </div>
        </div>

        <div className="header-toolbar">
          <label className="search-pill">
            <SearchIcon />
            <input
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search category, title, or note"
              className="w-full bg-transparent text-sm text-[var(--text-main)] outline-none placeholder:text-[var(--text-muted)]"
            />
          </label>

          <div className="header-actions">
            <div className="segmented-control" role="tablist" aria-label="Role switcher">
              {[
                ["admin", "Admin"],
                ["viewer", "Viewer"],
              ].map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => onRoleChange(value)}
                  className={`segmented-option ${role === value ? "segmented-option-active" : ""}`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="segmented-control" role="tablist" aria-label="Theme switcher">
              {[
                ["dark", "Dark"],
                ["light", "Light"],
              ].map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => {
                    if (theme !== value) {
                      onToggleTheme();
                    }
                  }}
                  className={`segmented-option ${theme === value ? "segmented-option-active" : ""}`}
                >
                  {label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={onAddTransaction}
              disabled={role !== "admin"}
              className="primary-button disabled:cursor-not-allowed disabled:opacity-45"
            >
              Add txn
            </button>

            <div className="workspace-pill">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--primary)] text-sm font-bold text-white">
                {role === "admin" ? "AD" : "VW"}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[var(--text-main)]">
                  {role === "admin" ? "Admin workspace" : "Viewer workspace"}
                </p>
                <p className="text-xs text-[var(--text-muted)]">finlytics.portal@demo.dev</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowNotifications((current) => !current)}
              className="soft-panel relative flex h-11 w-11 items-center justify-center rounded-full text-[var(--text-main)]"
              title="Notifications"
            >
              <BellIcon />
            </button>
          </div>
        </div>
      </div>

      {showNotifications ? (
        <div className="panel max-w-lg p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-[var(--text-main)]">Notifications</p>
            <button
              type="button"
              onClick={() => setShowNotifications(false)}
              className="text-xs font-semibold text-[var(--text-muted)]"
            >
              Close
            </button>
          </div>
          <div className="mt-3 space-y-2">
            {notifications.map((notification) => (
              <div
                key={notification}
                className="rounded-xl border border-[var(--border)] bg-[var(--card-soft)] px-3 py-2 text-sm text-[var(--text-muted)]"
              >
                {notification}
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  );
}
