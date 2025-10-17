import Image from "next/image";

import itappLogo from "@/assets/images/logo.png";

export function Logo() {
  return <Image src={itappLogo} height={35} width={35} alt="Logo" />;
}
