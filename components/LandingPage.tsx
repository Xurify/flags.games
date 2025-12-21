"use client";

import Link from "next/link";
import Image from "next/image";
import { GlobeIcon, UsersIcon, ArrowRightIcon, UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getCountryFlagUrl } from "@/lib/utils/image";

export default function LandingPage() {
  interface FloatingFlag {
    code: string;
    delay: number;
    className: string;
    hiddenOnMobile?: boolean;
  }

  const floatingFlags: FloatingFlag[] = [
    { code: "US", delay: 0, className: "top-[10%] left-[5%] animate-float-1" },
    {
      code: "JP",
      delay: 2,
      className: "top-[20%] right-[10%] animate-float-2",
      hiddenOnMobile: true,
    },
    {
      code: "SK",
      delay: 3,
      className: "top-[5%] right-[8%] md:right-[25%] animate-float-2",
    },
    {
      code: "BR",
      delay: 4,
      className: "top-[65%] md:top-[20%] left-[40%] md:left-[15%] animate-float-1",
    },
    {
      code: "GB",
      delay: 5,
      className: "top-[40%] left-[25%] animate-float-3",
      hiddenOnMobile: true,
    },
    {
      code: "EE",
      delay: 4,
      className: "bottom-[20%] md:bottom-[15%] left-[10%] animate-float-3",
    },
    {
      code: "CA",
      delay: 2,
      className: "top-[30%] right-[25%] animate-float-2",
      hiddenOnMobile: true,
    },
    {
      code: "ZA",
      delay: 1,
      className: "bottom-[15%] md:bottom-[10%] right-[15%] md:right-[5%] animate-float-1",
    },
    {
      code: "NL",
      delay: 7,
      className: "bottom-[25%] right-[15%] animate-float-1",
      hiddenOnMobile: true,
    },
    {
      code: "CZ",
      delay: 9,
      className: "top-[15%] left-[35%] animate-float-2",
      hiddenOnMobile: true,
    },
  ];

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center sm:justify-center overflow-hidden bg-transparent">
      {floatingFlags.map((flag) => (
        <div
          key={flag.code}
          className={`absolute pointer-events-none opacity-20 filter grayscale hover:grayscale-0 transition-all duration-500 ${
            flag.className
          } ${flag.hiddenOnMobile ? "hidden md:block" : ""}`}
        >
          <picture>
            {flag.hiddenOnMobile && (
              <source
                media="(max-width: 767px)"
                srcSet="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="
              />
            )}
            <Image
              src={getCountryFlagUrl(flag.code)}
              alt=""
              className="w-16 h-auto border-2 border-foreground shadow-retro"
              fetchPriority="high"
              preload={true}
              loading="eager"
              width={64}
              height={64}
            />
          </picture>
        </div>
      ))}

      <main className="relative z-10 flex flex-col items-center text-center px-4 max-w-2xl mt-16 sm:mt-0">
        <Badge
          variant="default"
          className="mb-6 px-4 py-1.5 bg-primary text-primary-foreground border-2 border-foreground shadow-retro lowercase"
        >
          <GlobeIcon className="w-3 h-3 mr-2" />
          197 Countries
        </Badge>

        <h1 className="text-6xl sm:text-7xl md:text-9xl font-black mb-2 sm:mb-4 tracking-tighter text-foreground decoration-primary underline underline-offset-8 decoration-4">
          FLAGS
        </h1>

        <p className="text-sm sm:text-base md:text-xl font-mono text-muted-foreground mb-6 md:mb-12 max-w-md">
          How well do you know your flags? <br /> Let's find out! 🧐
        </p>

        <div className="flex flex-col gap-4 md:gap-6 w-full max-w-sm">
          <Link href="/play" className="w-full">
            <Button
              size="lg"
              variant="outline"
              className="h-20 md:h-24 w-full justify-between px-5 sm:px-6 md:px-8 bg-background hover:bg-muted group border-2 border-foreground shadow-retro"
            >
              <div className="flex items-center gap-3 sm:gap-4 md:gap-6">
                <div className="p-1.5 sm:p-2 md:p-3 bg-destructive border-2 border-foreground text-white group-hover:rotate-3 transition-transform">
                  <UserIcon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                </div>
                <div className="text-left">
                  <div className="text-lg sm:text-xl font-black block leading-none">SOLO</div>
                  <div className="text-[10px] md:text-xs font-mono font-normal opacity-70">
                    Compete against yourself <br /> in various modes
                  </div>
                </div>
              </div>
              <ArrowRightIcon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-destructive" />
            </Button>
          </Link>

          <Link href="/lobby" className="w-full">
            <Button
              size="lg"
              variant="outline"
              className="h-20 md:h-24 w-full justify-between px-5 sm:px-6 md:px-8 bg-background hover:bg-muted group border-2 border-foreground shadow-retro"
            >
              <div className="flex items-center gap-3 sm:gap-4 md:gap-6">
                <div className="p-1.5 sm:p-2 md:p-3 bg-blue-600 border-2 border-foreground text-white group-hover:rotate-3 transition-transform">
                  <UsersIcon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                </div>
                <div className="text-left">
                  <div className="text-lg sm:text-xl font-black block leading-none">
                    MULTIPLAYER (BETA)
                  </div>
                  <div className="text-[10px] md:text-xs font-mono font-normal opacity-70">
                    Challenge your friends
                  </div>
                </div>
              </div>
              <ArrowRightIcon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-blue-600" />
            </Button>
          </Link>
        </div>
      </main>

      <footer className="absolute bottom-8 text-xs font-mono opacity-40">
        © 2025 FLAGS.GAMES • XURIFY
      </footer>
    </div>
  );
}
