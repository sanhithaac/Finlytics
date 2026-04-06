import { useMemo, useState } from "react";

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

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
    </svg>
  );
}

export default function Header({
  appName,
  latestTransactionDate,
  role,
  theme,
  search,
  onSearchChange,
  onRoleChange,
  onToggleTheme,
  onAddTransaction,
}) {
  const [showNotifications, setShowNotifications] = useState(false);
  const todayLabel = useMemo(
    () =>
      latestTransactionDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    [latestTransactionDate],
  );

  const notifications = [
    {
      title: "Monthly compare is live",
      body: "Insights now surface the latest month against the previous one for quicker context.",
    },
    {
      title: "Interactive chart hover",
      body: "Hovering the revenue and spending graphs highlights the strongest points instantly.",
    },
    {
      title: "Grouped category filters",
      body: "The transaction query bar now separates essentials, lifestyle, income, and more.",
    },
  ];

  const statusItems = [
    { label: "Active view", value: role === "admin" ? "Admin" : "Viewer" },
    { label: "Theme", value: theme === "dark" ? "Neon" : "Light" },
    { label: "Data date", value: todayLabel },
  ];

  return (
    <>
      <header className="flex flex-col gap-4 pb-5">
        <div className="header-shell header-shell-balanced">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-xs font-bold uppercase tracking-[0.34em] text-[var(--text-muted)]">
                Finance cockpit
              </p>
              <div className="hero-chip">
                <span className="status-orb" />
                {role === "admin" ? "Admin access" : "Viewer mode"}
              </div>
            </div>

            <div>
              <p className="text-lg font-semibold text-[var(--text-main)]">Dashboard overview</p>
              <p className="mt-2 max-w-xl text-sm text-[var(--text-muted)]">
                Track cash flow, compare month-on-month movement, and review recent activity from a
                cleaner single-screen workspace.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {statusItems.map((item) => (
                <span key={item.label} className="header-chip">
                  <span className="text-[var(--text-muted)]">{item.label}</span>
                  <span className="font-semibold text-[var(--text-main)]">{item.value}</span>
                </span>
              ))}
            </div>
          </div>

          <div className="header-centerpiece">
            <div className="header-brand-badge">
              <span className="header-brand-kicker">Workspace brand</span>
              <h1 className="text-[clamp(2.7rem,5vw,4.4rem)] font-black tracking-[-0.08em] text-[var(--text-main)]">
                {appName}
              </h1>
              <p className="mt-2 text-sm font-medium text-[var(--text-muted)]">
                Synced through {todayLabel}
              </p>
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

              <button
                type="button"
                onClick={() => setShowNotifications(true)}
                className="notification-trigger"
                title="Notifications"
              >
                <BellIcon />
                <span className="notification-count">{notifications.length}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {showNotifications ? (
        <div className="notification-modal" role="dialog" aria-modal="true" aria-label="Notifications">
          <button
            type="button"
            className="notification-backdrop"
            onClick={() => setShowNotifications(false)}
            aria-label="Close notifications"
          />
          <div className="notification-panel">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--text-muted)]">
                  Notifications
                </p>
                <h3 className="mt-2 text-2xl font-black tracking-tight text-[var(--text-main)]">
                  Workspace updates
                </h3>
                <p className="mt-2 text-sm text-[var(--text-muted)]">
                  Recent product changes and finance workspace cues in a focused popup instead of a
                  full-page takeover.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowNotifications(false)}
                className="icon-button"
                title="Close notifications"
              >
                <CloseIcon />
              </button>
            </div>

            <div className="mt-6 grid gap-3">
              {notifications.map((notification, index) => (
                <div key={notification.title} className="notification-card">
                  <div className="notification-index">{String(index + 1).padStart(2, "0")}</div>
                  <div>
                    <p className="text-sm font-semibold text-[var(--text-main)]">
                      {notification.title}
                    </p>
                    <p className="mt-1 text-sm text-[var(--text-muted)]">{notification.body}</p>
                    <p className="mt-2 text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">
                      Updated just now
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
