import { useEffect, useMemo, useRef, useState } from "react";
import DashboardPreview from "./DashboardPreview";
import ParticleScrollAnimation from "./ParticleScrollAnimation";
import TextOverlays from "./TextOverlays";

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export default function ScrollIntro() {
  const sectionRef = useRef(null);
  const [progress, setProgress] = useState(0);

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
    const node = sectionRef.current;

    if (!node) {
      return undefined;
    }

    let frameId = 0;

    const updateProgress = () => {
      const rect = node.getBoundingClientRect();
      const totalScrollable = Math.max(node.offsetHeight - window.innerHeight, 1);
      const scrolled = clamp(-rect.top, 0, totalScrollable);
      setProgress(scrolled / totalScrollable);
    };

    const handleScroll = () => {
      if (frameId) {
        return;
      }

      frameId = window.requestAnimationFrame(() => {
        updateProgress();
        frameId = 0;
      });
    };

    updateProgress();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, []);

  return (
    <section ref={sectionRef} className="story-shell">
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
      </div>
    </section>
  );
}
