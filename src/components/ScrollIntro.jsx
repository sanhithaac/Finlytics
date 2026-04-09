import { useCallback, useEffect, useRef, useState } from "react";
import ParticleScrollAnimation from "./ParticleScrollAnimation";

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export default function ScrollIntro({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [isLeaving, setIsLeaving] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const completeRef = useRef(onComplete);
  const hasCompletedRef = useRef(false);

  const handleReady = useCallback(() => {
    setIsReady(true);
  }, []);

  useEffect(() => {
    completeRef.current = onComplete;
  }, [onComplete]);


  useEffect(() => {
    if (!isReady) return;

    let frameId = 0;
    let timeoutId = 0;
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

      if (!hasCompletedRef.current) {
        hasCompletedRef.current = true;
        setIsLeaving(true);
        timeoutId = window.setTimeout(() => {
          completeRef.current?.();
        }, 520);
      }
    };

    frameId = window.requestAnimationFrame(animate);

    return () => {
      document.body.style.overflow = previousOverflow;
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [isReady]);


  return (
    <section
      className={`story-shell story-shell-force-dark ${isLeaving ? "story-shell-leaving" : ""}`}
      aria-label="Opening Finlytics animation"
    >
      <div className="story-sticky">
        <ParticleScrollAnimation progress={progress} onReady={handleReady} />

        <button
          type="button"
          onClick={() => {
            setProgress(1);
            setIsLeaving(true);
            if (!hasCompletedRef.current) {
              hasCompletedRef.current = true;
              window.setTimeout(() => completeRef.current?.(), 120);
            }
          }}
          className="story-skip"
        >
          Skip intro
        </button>
      </div>
    </section>
  );
}
