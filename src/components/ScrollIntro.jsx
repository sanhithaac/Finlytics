import { useEffect, useMemo, useState } from "react";
import DashboardPreview from "./DashboardPreview";
import ParticleScrollAnimation from "./ParticleScrollAnimation";
import TextOverlays from "./TextOverlays";

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export default function ScrollIntro({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [isLeaving, setIsLeaving] = useState(false);

  const particles = useMemo(
    () =>
      Array.from({ length: 26 }, (_, index) => ({
        id: index,
        left: ((index * 17) % 96) + 2,
        top: ((index * 23) % 76) + 8,
        size: 4 + (index % 4) * 2,
        delay: (index % 6) * 0.08,
      })),
    [],
  );

  useEffect(() => {
    let frameId = 0;
    const duration = 5600;
    const startedAt = performance.now();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const animate = (now) => {
      const nextProgress = clamp((now - startedAt) / duration, 0, 1);
      setProgress(nextProgress);

      if (nextProgress < 1) {
        frameId = window.requestAnimationFrame(animate);
        return;
      }

      setIsLeaving(true);
      window.setTimeout(() => {
        onComplete?.();
      }, 520);
    };

    frameId = window.requestAnimationFrame(animate);

    return () => {
      document.body.style.overflow = previousOverflow;
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, [onComplete]);

  return (
    <section
      className={`story-shell ${isLeaving ? "story-shell-leaving" : ""}`}
      aria-label="Opening Finlytics animation"
    >
      <div className="story-sticky">
        <ParticleScrollAnimation progress={progress} particles={particles} />
        <TextOverlays progress={progress} />
        <DashboardPreview progress={progress} />

        <div className="story-progress">
          <span>Data transformation</span>
          <div className="story-progress-track">
            <div
              className="story-progress-fill"
              style={{ width: `${Math.max(progress * 100, 6)}%` }}
            />
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setProgress(1);
            setIsLeaving(true);
            window.setTimeout(() => onComplete?.(), 120);
          }}
          className="story-skip"
        >
          Skip intro
        </button>
      </div>
    </section>
  );
}
