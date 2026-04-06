import { useEffect, useState } from "react";
import { formatCurrency } from "../utils/formatters";

function MetricIcon({ tone }) {
  const color =
    tone === "green" ? "var(--green)" : tone === "red" ? "var(--red)" : "var(--primary)";

  return (
    <div
      className="flex h-11 w-11 items-center justify-center rounded-xl"
      style={{
        background: `linear-gradient(135deg, ${color}, rgba(255,255,255,0.12))`,
        boxShadow: `0 0 16px ${color}33`,
      }}
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="none" stroke="currentColor" strokeWidth="2">
        {tone === "green" ? (
          <path d="M5 15l5-5 4 4 5-7" strokeLinecap="round" strokeLinejoin="round" />
        ) : tone === "red" ? (
          <path d="M5 9l5 5 4-4 5 7" strokeLinecap="round" strokeLinejoin="round" />
        ) : (
          <>
            <path d="M5 12h14" strokeLinecap="round" />
            <path d="M12 5v14" strokeLinecap="round" />
          </>
        )}
      </svg>
    </div>
  );
}

function useAnimatedValue(target) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let frameId = 0;
    const duration = 900;
    const start = performance.now();

    function animate(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(target * eased);

      if (progress < 1) {
        frameId = requestAnimationFrame(animate);
      }
    }

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [target]);

  return value;
}

const toneStyles = {
  dark: {
    blue: "linear-gradient(135deg, rgba(36,26,68,0.92), rgba(16,14,29,0.96))",
    green: "linear-gradient(135deg, rgba(31,29,66,0.92), rgba(16,14,29,0.96))",
    red: "linear-gradient(135deg, rgba(48,24,58,0.92), rgba(16,14,29,0.96))",
  },
  light: {
    blue: "linear-gradient(135deg, #ffffff, #f9f6f2)",
    green: "linear-gradient(135deg, rgba(255,255,255,0.95), rgba(34,197,94,0.08))",
    red: "linear-gradient(135deg, rgba(255,255,255,0.95), rgba(239,68,68,0.08))",
  },
};

export default function SummaryCard({
  title,
  value,
  subtitle,
  tone,
  change,
  theme,
  onClick,
  isActive = false,
}) {
  const animatedValue = useAnimatedValue(value);
  const mode = theme === "dark" ? "dark" : "light";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`metric-card cinematic-card w-full p-5 text-left transition duration-300 hover:scale-[1.02] hover:-translate-y-1 ${
        isActive ? "ring-1 ring-[var(--primary)]" : ""
      }`}
      style={{
        background: toneStyles[mode][tone],
        boxShadow:
          theme === "dark"
            ? "0 0 24px rgba(139,92,246,0.22), 0 18px 42px rgba(0,0,0,0.26)"
            : undefined,
      }}
      >
      <div className="cinematic-card-line" />
      <div className="flex items-start justify-between gap-3">
        <MetricIcon tone={tone} />
        <span
          className="rounded-full px-3 py-1 text-xs font-bold"
          style={{
            background:
              tone === "red" ? "rgba(239,68,68,0.12)" : "rgba(34,197,94,0.12)",
            color: tone === "red" ? "var(--red)" : "var(--green)",
          }}
        >
          {change >= 0 ? "+" : ""}
          {change.toFixed(1)}%
        </span>
      </div>

      <div className="mt-6">
        <span className="cinematic-caption">Live metric</span>
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--text-muted)]">
          {title}
        </p>
        <h2 className="mt-3 text-[2rem] font-black tracking-tight text-[var(--text-main)]">
          {formatCurrency(animatedValue)}
        </h2>
        <div className="mt-2 flex items-end justify-between gap-3">
          <p className="text-sm text-[var(--text-muted)]">{subtitle}</p>
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--primary)]">
            View details
          </span>
        </div>
      </div>
    </button>
  );
}
