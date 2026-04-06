const frameSources = Array.from({ length: 180 }, (_, index) => {
  const frame = String(index + 1).padStart(3, "0");
  return `/intro-sequence/ezgif-frame-${frame}.jpg`;
});

function clamp(value, min = 0, max = 1) {
  return Math.min(Math.max(value, min), max);
}

function normalize(progress, start, end) {
  return clamp((progress - start) / Math.max(end - start, 0.001));
}

export default function ParticleScrollAnimation({ progress, particles }) {
  const sparsePhase = normalize(progress, 0, 0.3);
  const wavePhase = normalize(progress, 0.28, 0.62);
  const chartPhase = normalize(progress, 0.6, 1);
  const frameIndex = Math.round(progress * (frameSources.length - 1));
  const frameSource = frameSources[frameIndex];
  const chartBars = [38, 54, 42, 70, 58, 82];

  return (
    <>
      <div className="story-grid" />
      <img
        src={frameSource}
        alt="Finlytics animated data sequence"
        className="story-frame"
      />
      <div className="story-vignette" />

      <div className="story-particles">
        {particles.map((particle) => {
          const xTravel = progress * (120 + particle.id * 2.8);
          const yWave = Math.sin(progress * 7 + particle.delay * 8) * (14 + wavePhase * 34);
          const densityBoost = sparsePhase * 0.35 + wavePhase * 0.45 + chartPhase * 0.2;

          return (
            <span
              key={particle.id}
              className="story-particle"
              style={{
                left: `${particle.left}%`,
                top: `${particle.top}%`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                opacity: clamp(0.12 + densityBoost - particle.delay * 0.18, 0, 1),
                transform: `translate3d(${xTravel}px, ${yWave}px, 0) scale(${0.8 + progress * 0.9})`,
              }}
            />
          );
        })}
      </div>

      <div
        className="story-wave"
        style={{
          opacity: wavePhase,
          transform: `translateY(${36 - wavePhase * 20}px) scale(${0.94 + wavePhase * 0.08})`,
        }}
      >
        {[0, 1, 2].map((index) => (
          <div
            key={index}
            className="story-wave-line"
            style={{
              animationDelay: `${index * 0.35}s`,
              opacity: 0.35 + index * 0.16,
            }}
          />
        ))}
      </div>

      <div
        className="story-chart-formation"
        style={{
          opacity: chartPhase,
          transform: `translateY(${50 - chartPhase * 36}px)`,
        }}
      >
        <div className="story-chart-bars">
          {chartBars.map((height, index) => (
            <span
              key={height}
              className="story-chart-bar"
              style={{
                height: `${height}%`,
                opacity: clamp(chartPhase - index * 0.04, 0.2, 1),
              }}
            />
          ))}
        </div>
        <svg
          viewBox="0 0 300 120"
          className="story-chart-line"
          aria-hidden="true"
          preserveAspectRatio="none"
        >
          <path
            d="M10 95 C45 82, 68 58, 96 64 S150 96, 186 52 S248 34, 290 18"
            fill="none"
            stroke="url(#finlytics-line)"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="finlytics-line" x1="0%" x2="100%" y1="0%" y2="0%">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="55%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#c084fc" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </>
  );
}
