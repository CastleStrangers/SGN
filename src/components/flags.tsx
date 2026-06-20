"use client";

import React from "react";

export function FreeSyrianFlag({ className }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 24 16" 
      xmlns="http://www.w3.org/2000/svg" 
      className={`${className} shadow-sm`}
    >
      <defs>
        <clipPath id="clip-syria">
          <rect width="24" height="16" rx="3" ry="3" />
        </clipPath>
        <linearGradient id="gloss-syria" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.45" />
          <stop offset="40%" stopColor="#ffffff" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.15" />
        </linearGradient>
      </defs>
      <g clipPath="url(#clip-syria)">
        <rect width="24" height="5.33" fill="#007A3D" />
        <rect y="5.33" width="24" height="5.33" fill="#FFFFFF" />
        <rect y="10.66" width="24" height="5.34" fill="#000000" />
        <g fill="#E30613">
          <path d="M 7.5,6.8 L 7.84,7.55 L 8.66,7.55 L 8.01,8.02 L 8.26,8.8 L 7.5,8.32 L 6.74,8.8 L 6.99,8.02 L 6.34,7.55 L 7.16,7.55 Z" />
          <path d="M 12,6.8 L 12.34,7.55 L 13.16,7.55 L 12.51,8.02 L 12.76,8.8 L 12,8.32 L 11.24,8.8 L 11.49,8.02 L 10.84,7.55 L 11.66,7.55 Z" />
          <path d="M 16.5,6.8 L 16.84,7.55 L 17.66,7.55 L 17.01,8.02 L 17.26,8.8 L 16.5,8.32 L 15.74,8.8 L 15.99,8.02 L 15.34,7.55 L 16.16,7.55 Z" />
        </g>
        <rect width="24" height="16" fill="url(#gloss-syria)" pointerEvents="none" />
      </g>
      <rect x="0.5" y="0.5" width="23" height="15" rx="2.5" ry="2.5" stroke="#000000" strokeOpacity="0.12" fill="none" pointerEvents="none" />
    </svg>
  );
}

export function DutchFlag({ className }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 24 16" 
      xmlns="http://www.w3.org/2000/svg" 
      className={`${className} shadow-sm`}
    >
      <defs>
        <clipPath id="clip-dutch">
          <rect width="24" height="16" rx="3" ry="3" />
        </clipPath>
        <linearGradient id="gloss-dutch" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.45" />
          <stop offset="40%" stopColor="#ffffff" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.15" />
        </linearGradient>
      </defs>
      <g clipPath="url(#clip-dutch)">
        <rect width="24" height="5.33" fill="#AE1C28" />
        <rect y="5.33" width="24" height="5.33" fill="#FFFFFF" />
        <rect y="10.66" width="24" height="5.34" fill="#21468B" />
        <rect width="24" height="16" fill="url(#gloss-dutch)" pointerEvents="none" />
      </g>
      <rect x="0.5" y="0.5" width="23" height="15" rx="2.5" ry="2.5" stroke="#000000" strokeOpacity="0.12" fill="none" pointerEvents="none" />
    </svg>
  );
}
