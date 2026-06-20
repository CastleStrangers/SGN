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
        <clipPath id="clip-syria-v2">
          <rect width="24" height="16" rx="3" ry="3" />
        </clipPath>
      </defs>
      <g clipPath="url(#clip-syria-v2)">
        {/* Stripes */}
        <rect width="24" height="5.33" fill="#00A95C" />
        <rect y="5.33" width="24" height="5.33" fill="#FFFFFF" />
        <rect y="10.66" width="24" height="5.34" fill="#121212" />
        
        {/* Three mathematically perfect larger red stars */}
        <g fill="#E30A17">
          {/* Star 1 - Center 7.5 */}
          <path d="M 7.5 6.2 L 7.94 7.39 L 9.21 7.44 L 8.21 8.23 L 8.56 9.46 L 7.5 8.75 L 6.44 9.46 L 6.79 8.23 L 5.79 7.44 L 7.06 7.39 Z" />
          {/* Star 2 - Center 12.0 */}
          <path d="M 12.0 6.2 L 12.44 7.39 L 13.71 7.44 L 12.71 8.23 L 13.06 9.46 L 12.0 8.75 L 10.94 9.46 L 11.29 8.23 L 10.29 7.44 L 11.56 7.39 Z" />
          {/* Star 3 - Center 16.5 */}
          <path d="M 16.5 6.2 L 16.94 7.39 L 18.21 7.44 L 17.21 8.23 L 17.56 9.46 L 16.5 8.75 L 15.44 9.46 L 15.79 8.23 L 14.79 7.44 L 16.06 7.39 Z" />
        </g>
        
        {/* Subtle glass reflection overlay on top half */}
        <rect width="24" height="8" fill="#FFFFFF" opacity="0.08" pointerEvents="none" />
      </g>
      
      {/* Outer premium border */}
      <rect x="0.5" y="0.5" width="23" height="15" rx="2.5" ry="2.5" stroke="#000000" strokeOpacity="0.08" fill="none" pointerEvents="none" />
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
        <clipPath id="clip-dutch-v2">
          <rect width="24" height="16" rx="3" ry="3" />
        </clipPath>
      </defs>
      <g clipPath="url(#clip-dutch-v2)">
        {/* Stripes */}
        <rect width="24" height="5.33" fill="#E30A17" />
        <rect y="5.33" width="24" height="5.33" fill="#FFFFFF" />
        <rect y="10.66" width="24" height="5.34" fill="#004C97" />
        
        {/* Subtle glass reflection overlay on top half */}
        <rect width="24" height="8" fill="#FFFFFF" opacity="0.08" pointerEvents="none" />
      </g>
      
      {/* Outer premium border */}
      <rect x="0.5" y="0.5" width="23" height="15" rx="2.5" ry="2.5" stroke="#000000" strokeOpacity="0.08" fill="none" pointerEvents="none" />
    </svg>
  );
}
