"use client";

import { useState, useRef } from "react";
import { Download, Check } from "lucide-react";
import html2canvas from "html2canvas";

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

export function MantraWallpaper({ mantra }: MantraWallpaperProps) {
  const [selectedWallpaper, setSelectedWallpaper] = useState(1);
  const [isDownloading, setIsDownloading] = useState(false);
  const wallpaperRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!wallpaperRef.current || isDownloading) return;

    setIsDownloading(true);
    try {
      const canvas = await html2canvas(wallpaperRef.current, {
        scale: 3, // High resolution for phone wallpaper
        useCORS: true,
        backgroundColor: null,
        ignoreElements: (element) => {
          // Ignore elements that might have unsupported CSS
          return element.tagName === 'STYLE';
        },
        onclone: (clonedDoc) => {
          // Remove any stylesheets that might cause issues
          const styles = clonedDoc.querySelectorAll('style');
          styles.forEach((style) => {
            if (style.textContent?.includes('lab(')) {
              style.remove();
            }
          });
        },
      });

      const link = document.createElement("a");
      link.download = `my-2026-mantra-${mantra.toLowerCase().replace(/\s+/g, "-")}.png`;
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
      <div className="mb-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
        Your 2026 Mantra
      </div>

      <div className="flex flex-col gap-6 md:flex-row md:items-start">
        {/* Phone Preview */}
        <div className="flex-shrink-0">
          <div
            ref={wallpaperRef}
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
