function getPhaseOpacity(progress, start, end) {
  if (progress <= start || progress >= end) {
    return 0;
  }

  const midpoint = (start + end) / 2;

  if (progress <= midpoint) {
    return (progress - start) / Math.max(midpoint - start, 0.001);
  }

  return 1 - (progress - midpoint) / Math.max(end - midpoint, 0.001);
}

export default function TextOverlays({ progress }) {
  const introOpacity = getPhaseOpacity(progress, 0, 0.4);
  const middleOpacity = getPhaseOpacity(progress, 0.22, 0.74);
  const finalOpacity = getPhaseOpacity(progress, 0.66, 1.02);

  return (
    <div className="story-copy">
      <div
        className="story-copy-block"
        style={{ opacity: introOpacity, transform: `translateY(${20 - progress * 28}px)` }}
      >
        <p className="story-kicker">Finlytics experience</p>
        <h2 className="story-title">Track. Analyze. Grow.</h2>
        <p className="story-text">
          A cinematic finance surface where raw movement becomes readable insight.
        </p>
      </div>

      <div
        className="story-copy-block"
        style={{ opacity: middleOpacity, transform: `translateY(${36 - progress * 36}px)` }}
      >
        <p className="story-kicker">Signal in motion</p>
        <h2 className="story-title">From raw data to meaningful structure.</h2>
        <p className="story-text">
          Particle flow intensifies, organizes into curves, and reveals the logic behind every
          balance shift, payment, and trend line.
        </p>
      </div>

      <div
        className="story-copy-block"
        style={{ opacity: finalOpacity, transform: `translateY(${48 - progress * 38}px)` }}
      >
        <p className="story-kicker">Dashboard reveal</p>
        <h2 className="story-title">Insights are ready.</h2>
        <p className="story-text">
          Scroll deeper to enter the live workspace, review transactions, and act on the data.
        </p>
      </div>
    </div>
  );
}
