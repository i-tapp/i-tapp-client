import Image from "next/image";

export function Logo({ className }: { className?: string }) {
  return (
    <Image
      src="/logo.png"
      height={340}
      width={340}
      priority={true}
      alt="PlaceIT"
      className={className}
    />
  );
}
