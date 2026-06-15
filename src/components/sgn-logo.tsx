"use client";

import { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";

interface SgnLogoProps {
  /** Size in pixels for both width and height (default: 64) */
  size?: number;
  /** Custom wrapper className for sizing and custom offsets */
  className?: string;
  /** Priority loading flag for above-the-fold images */
  priority?: boolean;
}

export function SgnLogo({
  size = 64,
  className = "",
  priority = false
}: SgnLogoProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Map size to Tailwind width/height classes to avoid inline styles
  const sizeMap: Record<number, string> = {
    36: "w-9 h-9",
    56: "w-14 h-14",
    60: "w-[60px] h-[60px]",
    64: "w-16 h-16",
    120: "w-[120px] h-[120px]",
    128: "w-32 h-32",
  };
  const sizeClass = sizeMap[size] || "w-16 h-16";

  const handleOpen = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(true);
  };

  const handleClose = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(false);
  };

  return (
    <>
      <div
        onClick={handleOpen}
        className={`relative p-[3px] rounded-full bg-gradient-to-tr from-[#b8973f] via-[#f3e0aa] to-[#c8a84e] shadow-md hover:shadow-[0_0_15px_rgba(200,168,78,0.7)] hover:scale-105 transition-all duration-300 ease-in-out cursor-pointer flex-shrink-0 ${sizeClass} ${className}`}
      >
        <div className="rounded-full w-full h-full flex items-center justify-center overflow-hidden">
          <Image
            src="/logo.png"
            alt="SGN Logo"
            width={size}
            height={size}
            className="rounded-full object-cover w-full h-full"
            priority={priority}
          />
        </div>
      </div>

      {isOpen && (
        <div
          onClick={handleClose}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/85 backdrop-blur-md cursor-zoom-out sgn-logo-fade-in"
        >
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-6 right-6 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition-all duration-200 cursor-pointer"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Zoomed Logo Box */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative p-[5px] rounded-full bg-gradient-to-tr from-[#b8973f] via-[#f3e0aa] to-[#c8a84e] shadow-[0_0_50px_rgba(200,168,78,0.5)] sgn-logo-scale-up max-w-[90vw] max-h-[90vh]"
          >
            <div className="rounded-full w-[260px] h-[260px] sm:w-[360px] sm:h-[360px] flex items-center justify-center overflow-hidden">
              <Image
                src="/logo.png"
                alt="SGN Logo Zoomed"
                width={360}
                height={360}
                className="rounded-full object-cover w-full h-full"
                priority
              />
            </div>
          </div>

          <style>{`
            @keyframes sgnLogoFadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            @keyframes sgnLogoScaleUp {
              from { transform: scale(0.8); opacity: 0; }
              to { transform: scale(1); opacity: 1; }
            }
            .sgn-logo-fade-in {
              animation: sgnLogoFadeIn 0.2s ease-out forwards;
            }
            .sgn-logo-scale-up {
              animation: sgnLogoScaleUp 0.25s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
            }
          `}</style>
        </div>
      )}
    </>
  );
}
