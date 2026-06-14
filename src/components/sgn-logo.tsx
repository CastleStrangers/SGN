import Image from "next/image";

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
  // Map size to Tailwind width/height classes to avoid inline styles
  const sizeMap: Record<number, string> = {
    36: "w-9 h-9",
    56: "w-14 h-14",
    60: "w-[60px] h-[60px]",
    64: "w-16 h-16",
    120: "w-[120px] h-[120px]",
  };
  const sizeClass = sizeMap[size] || "w-16 h-16";

  return (
    <div
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
  );
}
