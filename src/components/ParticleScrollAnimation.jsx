const frameSources = Array.from({ length: 180 }, (_, index) => {
  const frame = String(index + 1).padStart(3, "0");
  return `/intro-sequence/ezgif-frame-${frame}.jpg`;
});

export default function ParticleScrollAnimation({ progress }) {
  const frameIndex = Math.round(progress * (frameSources.length - 1));
  const frameSource = frameSources[frameIndex];

  return (
    <>
      <img
        src={frameSource}
        alt="Finlytics animated data sequence"
        className="story-frame"
      />
      <div className="story-vignette" />
    </>
  );
}
