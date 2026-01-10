import Link from "next/link";
import Image from "next/image";

import facebook from "@/assets/icons/facebook.svg";
import twitter from "@/assets/icons/twitter.svg";
import instagram from "@/assets/icons/instagram.svg";
import linkedin from "@/assets/icons/linkedin.svg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Wrapper } from "@/components/wrapper";
import { app } from "@/config/app";

export function Footer() {
  return (
    <Wrapper className="flex flex-wrap justify-between text-sm sm:text-base ">
      {app.footer_links.map((section, index) => (
        <div key={index}>
          <h6 className="text-h6">{section.title}</h6>

          <ul className="mr-8  ">
            {section.links.map((link, index) => (
              <li key={index} className="my-5 ">
                <Link
                  className="text-grey-1 cursor-pointer hover:opacity-100 opacity-70"
                  href={link.href}
                >
                  {link.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}

      <div className="py-4 *text-sm sm:*:text-base">
        <p>Subscribe to our email newsletter</p>
        <form className="mt-4 w-full flex space-y-2 sm:space-y-0  sm:space-x-2 flex-wrap sm:flex-nowrap  ">
          <Input
            className="bg-[#1E2641] py-3.5 text-white placeholder:text-white border-2 border-solid border-[#3A456A] text-sm sm:text-base"
            placeholder="Your email"
          />
          <Button
            className="bg-[#F1F2FC] text-black  py-4 hover:bg-[#F1F2FC] active:bg-[#F1F2FC] text-sm sm:text-base sm:w-32 "
            size="default"
          >
            SUBSCRIBE
          </Button>
        </form>

        <div className="mt-8">
          <p className="pb-4">Connect with us</p>
          <Link href={"https://instagram.com/itapp.tech"}>
            <Image
              src={instagram}
              className="bg-primary mr-2 rounded-sm inline-block p-1 size-12 bg-linear-to-tr from-[#FFB73D] from-10% via-[#C47067] via-45.55% to-[#9D23E4] to-96.85%"
              alt="twitter"
            />
          </Link>
          <Link href={"https://linkedin.com/company/i-tapp"}>
            <Image
              src={linkedin}
              className="bg-primary mr-2 rounded-sm inline-block p-1 size-12"
              alt="linkedin"
            />
          </Link>

          <Link href={"https://twitter.com/i-tapp"}>
            <Image
              src={twitter}
              className="bg-[#4297C4] mr-2 rounded-sm inline-block p-1 size-12"
              alt="twitter"
            />
          </Link>
        </div>
      </div>
    </Wrapper>
  );
}
