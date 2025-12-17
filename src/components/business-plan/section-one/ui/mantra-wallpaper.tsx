"use client";

import { useState, useCallback } from "react";
import { Download, Check, Sparkles } from "lucide-react";

const WALLPAPER_OPTIONS = [
  { id: 1, src: "/images/wallpapers/wallpaper-1.png", alt: "Dark navy with star outline" },
  { id: 2, src: "/images/wallpapers/wallpaper-2.png", alt: "Navy gradient with stars" },
  { id: 3, src: "/images/wallpapers/wallpaper-3.png", alt: "Navy with circle pattern" },
  { id: 4, src: "/images/wallpapers/wallpaper-4.png", alt: "Blue with top star" },
  { id: 5, src: "/images/wallpapers/wallpaper-5.png", alt: "Medium blue with large star" },
  { id: 6, src: "/images/wallpapers/wallpaper-6.png", alt: "Light blue gradient" },
];

interface MantraWallpaperProps {
  mantra: string;
}

// Phone wallpaper dimensions (iPhone 14 Pro Max ratio)
const WALLPAPER_WIDTH = 1170;
const WALLPAPER_HEIGHT = 2532;

export function MantraWallpaper({ mantra }: MantraWallpaperProps) {
  const [selectedWallpaper, setSelectedWallpaper] = useState(1);
  const [isDownloading, setIsDownloading] = useState(false);

  const drawWallpaper = useCallback(
    async (canvas: HTMLCanvasElement): Promise<void> => {
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Could not get canvas context");

      canvas.width = WALLPAPER_WIDTH;
      canvas.height = WALLPAPER_HEIGHT;

      const selectedOption = WALLPAPER_OPTIONS.find((w) => w.id === selectedWallpaper);
      if (!selectedOption) throw new Error("No wallpaper selected");

      // Load and draw background image
      const img = new Image();
      img.crossOrigin = "anonymous";

      await new Promise<void>((resolve, reject) => {
        img.onload = () => {
          // Draw image covering the entire canvas
          ctx.drawImage(img, 0, 0, WALLPAPER_WIDTH, WALLPAPER_HEIGHT);
          resolve();
        };
        img.onerror = () => reject(new Error("Failed to load wallpaper image"));
        img.src = selectedOption.src;
      });

      // Draw mantra text
      if (mantra) {
        const fontSize = 72;
        const lineHeight = fontSize * 1.2;
        const maxWidth = WALLPAPER_WIDTH - 100; // Padding on sides

        ctx.fillStyle = "#FFFFFF";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = `900 italic ${fontSize}px system-ui, -apple-system, sans-serif`;

        // Add text shadow
        ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
        ctx.shadowBlur = 8;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 4;

        // Word wrap for long mantras
        const words = mantra.toUpperCase().split(" ");
        const lines: string[] = [];
        let currentLine = "";

        for (const word of words) {
          const testLine = currentLine ? `${currentLine} ${word}` : word;
          const metrics = ctx.measureText(testLine);
          if (metrics.width > maxWidth && currentLine) {
            lines.push(currentLine);
            currentLine = word;
          } else {
            currentLine = testLine;
          }
        }
        if (currentLine) lines.push(currentLine);

        // Center text vertically
        const totalHeight = lines.length * lineHeight;
        const startY = (WALLPAPER_HEIGHT - totalHeight) / 2 + lineHeight / 2;

        lines.forEach((line, index) => {
          ctx.fillText(line, WALLPAPER_WIDTH / 2, startY + index * lineHeight);
        });
      }
    },
    [selectedWallpaper, mantra]
  );

  const handleDownload = async () => {
    if (isDownloading) return;

    setIsDownloading(true);
    try {
      // Create an offscreen canvas for rendering
      const canvas = document.createElement("canvas");
      await drawWallpaper(canvas);

      const link = document.createElement("a");
      link.download = `my-2026-mantra-${mantra.toLowerCase().replace(/\s+/g, "-") || "wallpaper"}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (error) {
      console.error("Failed to download wallpaper:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  const selectedOption = WALLPAPER_OPTIONS.find((w) => w.id === selectedWallpaper);

  return (
    <div className="mb-12 overflow-hidden rounded-2xl border border-slate-100 bg-gradient-to-br from-slate-50 to-white p-6 shadow-sm">
      {/* Bonus badge */}
      <div className="mb-4">
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-amber-700">
          <Sparkles className="h-3 w-3" /> Bonus
        </span>
      </div>

      <h4 className="mb-1 text-lg font-bold text-slate-900">Take it with you</h4>
      <p className="mb-5 text-sm text-slate-500">
        Download your mantra as a phone wallpaper to keep it front and center all year.
      </p>

      <div className="flex flex-col gap-6 md:flex-row md:items-start">
        {/* Phone Preview */}
        <div className="flex-shrink-0">
          <div
            className="relative mx-auto w-[200px] overflow-hidden rounded-[24px] shadow-xl md:w-[220px]"
            style={{ aspectRatio: "9/19.5" }}
          >
            {/* Background Image */}
            <img
              src={selectedOption?.src}
              alt={selectedOption?.alt}
              className="absolute inset-0 h-full w-full object-cover"
            />

            {/* Mantra Text Overlay - dead center */}
            <div className="absolute inset-0 flex items-center justify-center px-5">
              <span
                className="block text-xl font-black uppercase italic leading-tight tracking-wide text-white text-center"
                style={{
                  textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                }}
              >
                {mantra}
              </span>
            </div>

          </div>
        </div>

        {/* Selection Panel */}
        <div className="flex-1">
          <h4 className="mb-3 text-sm font-semibold text-slate-700">Choose your style:</h4>

          {/* Wallpaper Thumbnails */}
          <div className="mb-6 grid grid-cols-6 gap-2">
            {WALLPAPER_OPTIONS.map((wallpaper) => (
              <button
                key={wallpaper.id}
                onClick={() => setSelectedWallpaper(wallpaper.id)}
                className={`relative aspect-[9/19.5] overflow-hidden rounded-lg transition-all ${
                  selectedWallpaper === wallpaper.id
                    ? "ring-2 ring-blue-500 ring-offset-2"
                    : "opacity-70 hover:opacity-100"
                }`}
              >
                <img
                  src={wallpaper.src}
                  alt={wallpaper.alt}
                  className="h-full w-full object-cover"
                />
                {selectedWallpaper === wallpaper.id && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Check className="h-4 w-4 text-white drop-shadow-md" />
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Download Button */}
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#1E293B] to-[#0F172A] px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:shadow-xl disabled:opacity-50"
          >
            <Download className="h-4 w-4" />
            {isDownloading ? "Creating wallpaper..." : "Download Wallpaper"}
          </button>

          <p className="mt-3 text-xs text-slate-400">
            Save this as your phone wallpaper to keep your mantra front and center all year.
          </p>
        </div>
      </div>
    </div>
  );
}
