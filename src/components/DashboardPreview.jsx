function clamp(value, min = 0, max = 1) {
  return Math.min(Math.max(value, min), max);
}

export default function DashboardPreview({ progress }) {
  const previewPhase = clamp((progress - 0.72) / 0.2);

  return (
    <div
      className="story-preview"
      style={{
        opacity: previewPhase,
        transform: `translateY(${40 - previewPhase * 28}px) scale(${0.96 + previewPhase * 0.04})`,
      }}
    >
      <div className="story-preview-grid">
        <div className="story-preview-card">
          <p className="field-label">Balance</p>
          <p className="mt-3 text-2xl font-black text-white">₹18,283</p>
          <p className="mt-2 text-sm text-[rgba(237,233,254,0.72)]">Net position across active view</p>
        </div>
        <div className="story-preview-card">
          <p className="field-label">Income</p>
          <p className="mt-3 text-2xl font-black text-white">₹23,240</p>
          <p className="mt-2 text-sm text-[rgba(237,233,254,0.72)]">Incoming cash flow and payouts</p>
        </div>
        <div className="story-preview-card">
          <p className="field-label">Expenses</p>
          <p className="mt-3 text-2xl font-black text-white">₹4,957</p>
          <p className="mt-2 text-sm text-[rgba(237,233,254,0.72)]">Outgoing spend across categories</p>
        </div>
      </div>

      <div className="story-preview-panel">
        <div className="story-preview-chart">
          {[24, 36, 52, 42, 68, 58].map((height) => (
            <span key={height} style={{ height: `${height}%` }} />
          ))}
        </div>
        <div className="story-preview-list">
          {[
            ["Groceries", "expense", "₹185"],
            ["Salary", "income", "₹4,200"],
            ["Rent", "expense", "₹1,450"],
          ].map(([label, type, amount]) => (
            <div key={label} className="story-preview-row">
              <div>
                <p className="text-sm font-semibold text-white">{label}</p>
                <p className="text-xs text-[rgba(237,233,254,0.62)]">{type}</p>
              </div>
              <p className="text-sm font-semibold text-white">{amount}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
