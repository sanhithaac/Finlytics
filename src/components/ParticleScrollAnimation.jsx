import { useEffect, useRef, useState } from "react";

const frameSources = Array.from({ length: 180 }, (_, index) => {
  const frame = String(index + 1).padStart(3, "0");
  return `/intro-sequence/ezgif-frame-${frame}.jpg`;
});

export default function ParticleScrollAnimation({ progress, onReady }) {
  const canvasRef = useRef(null);
  const [images, setImages] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const lastDrawnFrame = useRef(-1);

  // Preload all images
  useEffect(() => {
    let loadedCount = 0;
    const loadedImages = [];

    frameSources.forEach((src, index) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        loadedCount++;
        if (loadedCount === frameSources.length) {
          setIsLoaded(true);
          onReady?.();
        }
      };
      img.onerror = () => {
        // Even if some frames fail, we should probably continue or handle error
        loadedCount++;
        if (loadedCount === frameSources.length) {
          setIsLoaded(true);
          onReady?.();
        }
      };
      loadedImages[index] = img;
    });

    setImages(loadedImages);
  }, [onReady]);


  // Draw current frame to canvas
  useEffect(() => {
    if (!isLoaded || images.length === 0 || !canvasRef.current) return;

    const frameIndex = Math.round(progress * (images.length - 1));
    if (frameIndex === lastDrawnFrame.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { alpha: false });
    const img = images[frameIndex];

    if (img && img.complete) {
      // Logic for "object-fit: cover" on canvas
      const canvasAspect = canvas.width / canvas.height;
      const imgAspect = img.naturalWidth / img.naturalHeight;
      
      let drawWidth, drawHeight, offsetX, offsetY;

      if (canvasAspect > imgAspect) {
        drawWidth = canvas.width;
        drawHeight = canvas.width / imgAspect;
        offsetX = 0;
        offsetY = -(drawHeight - canvas.height) / 2;
      } else {
        drawWidth = canvas.height * imgAspect;
        drawHeight = canvas.height;
        offsetX = -(drawWidth - canvas.width) / 2;
        offsetY = 0;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
      lastDrawnFrame.current = frameIndex;
    }
  }, [progress, isLoaded, images]);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
        // Trigger a redraw
        lastDrawnFrame.current = -1;
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="story-frame"
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
      {!isLoaded && progress < 0.1 && (
        <div className="absolute inset-0 flex items-center justify-center bg-[var(--bg-main)]">
          <div className="flex flex-col items-center gap-3">
            <div className="h-1 bg-[var(--primary)] transition-all duration-300" style={{ width: "200px" }} />
            <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--text-muted)]">Initialising Sequence...</p>
          </div>
        </div>
      )}
      <div className="story-vignette" />
    </>
  );
}

