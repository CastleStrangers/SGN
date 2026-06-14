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
  // Map size to container CSS dimensions
  const containerStyle = {
    width: size,
    height: size,
  };

  return (
    <div
      style={containerStyle}
      className={`relative p-[3px] rounded-full bg-gradient-to-tr from-[#b8973f] via-[#f3e0aa] to-[#c8a84e] shadow-md hover:shadow-[0_0_15px_rgba(200,168,78,0.7)] hover:scale-105 transition-all duration-300 ease-in-out cursor-pointer flex-shrink-0 ${className}`}
    >
      <div className="bg-card rounded-full p-0.5 w-full h-full flex items-center justify-center overflow-hidden">
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
