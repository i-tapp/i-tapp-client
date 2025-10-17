import Link from "next/link";
import { Logo } from "@/components/logo";
import LoginImg from "@/assets/images/login-image.webp";
import Image from "next/image";

export default function AuthLayoutUi({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="w-full min-h-screen flex items-center justify-center bg-background">
      <div className="container flex flex-col lg:flex-row items-center justify-between gap-12 py-16">
        <div className="w-full lg:w-2/3 flex flex-col items-center  gap-6">
          <Link href="/">
            <Logo />
          </Link>
          {children}
        </div>
        <div className="hidden lg:flex w-full lg:w-1/2 justify-center">
          <div className="relative w-full max-w-md aspect-[4/4] rounded-md overflow-hidden shadow-sm">
            {" "}
            <Image
              src={LoginImg}
              alt="Company Banner"
              objectFit="contain" // Ensures the image covers the entire div
              quality={100} // Adjusts image quality (optional)
              priority // Optional: loads the image with priority
            />
          </div>
        </div>
      </div>
    </main>
  );
}
