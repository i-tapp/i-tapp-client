import Link from "next/link";
import Boy from "@/assets/images/boy.jpg";
import Girl from "@/assets/images/girl.jpg";
import { Wrapper } from "@/components/wrapper";
import { buttonVariants } from "@/components/ui/button";
import { app } from "@/config/app";
import Image from "next/image";

export function Hero() {
  return (
    <Wrapper className="flex flex-col lg:flex-row items-center justify-center">
      <div className="flex-1 flex flex-col gap-8 max-w-[600px] text-center lg:text-left">
        <h1 className="text-black text-h3 leading-[60px] font-medium sm:font-medium sm:leading-[60px] sm:text-h2 md:text-h1 md:leading-[90px] md:font-medium">
          Bridging the gap between companies and students.
        </h1>
        <p className="text-black text-sm sm:text-md leading-7 max-w-[511px] ">
          A centralized hub for Nigerian students to search, find and apply for
          industrial training placement across different industries.
        </p>
        <div>
          <Link
            href="/get-started"
            className={`${buttonVariants({ size: "lg" })} w-auto  `}
          >
            Get Started
          </Link>
        </div>
      </div>

      {/* Profile Images Section for Large Screens */}
      <div
        className="max-w-[600px] hidden lg:flex lg:flex-col items-center justify-center w-full h-full"
        style={{
          background:
            "radial-gradient(circle, rgba(204, 222, 238, 1) 0%, rgba(204, 222, 238, 0) 60%)",
        }}
      >
        <div className="grow flex items-center justify-center py-10 px-20">
          <div className="relative w-[350px] h-[250px]">
            <div className="absolute top-0 left-0 right-5 rounded-full w-[130px] h-[130px] overflow-hidden bg-[#8CD9C0]">
              <Image
                src={Boy}
                alt="Profile 1"
                layout="responsive"
                width={200}
                height={200}
                objectFit="cover"
                quality={100}
                priority
              />
            </div>

            {/* Second profile image */}
            <div className="absolute bottom-0 right-0 rounded-full w-[120px] h-[120px] overflow-hidden bg-[#F4E681]">
              <Image
                src={Girl}
                alt="Profile 2"
                width={150}
                height={150}
                layout="responsive"
                objectFit="cover"
                quality={100}
                priority
              />
            </div>

            <div className="absolute top-1/2 left-1/2 w-[100px] h-[3px] bg-blue-400 transform -translate-x-1/2 -translate-y-1/2 rotate-45"></div>

            {/* Connecting line */}
            <div className="absolute top-1/2 left-1/2 w-[100px] h-[3px] bg-blue-400 transform -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
          </div>
        </div>
      </div>

      {/* Profile Images Section for Small Screens */}
      <div className="flex lg:hidden flex-col items-center justify-center w-full mt-10 py-10">
        <div className="relative w-[350px] h-[250px]">
          <div className="absolute top-0 left-0 right-5 rounded-full w-[150px] h-[150px] overflow-hidden bg-[#8CD9C0]">
            <Image
              src={Boy}
              alt="Profile 1"
              layout="responsive"
              width={150}
              height={150}
              objectFit="cover"
              quality={100}
              priority
            />
          </div>

          {/* Second profile image */}
          <div className="absolute bottom-0 right-0 rounded-full w-[150px] h-[150px] overflow-hidden bg-[#F4E681]">
            <Image
              src={Girl}
              alt="Profile 2"
              width={150}
              height={150}
              layout="responsive"
              objectFit="cover"
              quality={100}
              priority
            />
          </div>

          <div className="absolute top-1/2 left-1/2 w-[100px] h-[3px] bg-blue-400 transform -translate-x-1/2 -translate-y-1/2 rotate-45"></div>

          {/* Connecting line */}
          <div className="absolute top-1/2 left-1/2 w-[100px] h-[3px] bg-blue-400 transform -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
        </div>
      </div>
    </Wrapper>
  );
}
