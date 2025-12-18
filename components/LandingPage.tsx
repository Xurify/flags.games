"use client";

import Link from "next/link";
import { GlobeIcon, UsersIcon, ArrowRightIcon, UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getCountryFlagUrl } from "@/lib/utils/image";

interface LandingPageProps {
    onStartSolo: () => void;
}

export default function LandingPage({ onStartSolo }: LandingPageProps) {
    interface FloatingFlag {
        code: string;
        delay: number;
        className: string;
        hiddenOnMobile?: boolean;
    }

    const floatingFlags: FloatingFlag[] = [
        { code: "US", delay: 0, className: "top-[10%] left-[5%] animate-float-1" },
        { code: "JP", delay: 2, className: "top-[20%] right-[10%] animate-float-2", hiddenOnMobile: true },
        { code: "BR", delay: 4, className: "top-[20%] left-[15%] animate-float-1" },
        { code: "GB", delay: 5, className: "top-[40%] left-[25%] animate-float-3", hiddenOnMobile: true },
        { code: "EE", delay: 4, className: "bottom-[15%] left-[10%] animate-float-3" },
        { code: "SK", delay: 3, className: "top-[10%] right-[20%] animate-float-2" },
        { code: "ZA", delay: 1, className: "bottom-[10%] right-[5%] animate-float-1" },
        { code: "NL", delay: 7, className: "bottom-[25%] right-[15%] animate-float-1", hiddenOnMobile: true },
        { code: "CZ", delay: 9, className: "top-[15%] left-[35%] animate-float-2", hiddenOnMobile: true },
    ];

    return (
        <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-transparent">
            {floatingFlags.map((flag, i) => (
                <div
                    key={flag.code}
                    className={`absolute pointer-events-none opacity-20 filter grayscale hover:grayscale-0 transition-all duration-500 ${flag.className} ${flag.hiddenOnMobile ? 'hidden md:block' : ''}`}
                >
                    <picture>
                        {flag.hiddenOnMobile && (
                            <source
                                media="(max-width: 767px)"
                                srcSet="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="
                            />
                        )}
                        <img
                            src={getCountryFlagUrl(flag.code)}
                            alt=""
                            className="w-16 h-auto border-2 border-foreground shadow-retro"
                        />
                    </picture>
                </div>
            ))}

            <main className="relative z-10 flex flex-col items-center text-center px-4 max-w-2xl">
                <Badge variant="default" className="mb-6 px-4 py-1.5 bg-primary text-primary-foreground border-2 border-foreground shadow-retro lowercase">
                    <GlobeIcon className="w-3 h-3 mr-2" />
                    ~197 Countries
                </Badge>

                <h1 className="text-6xl sm:text-7xl md:text-9xl font-black mb-4 tracking-tighter text-foreground decoration-primary underline underline-offset-8 decoration-4">
                    FLAGS
                </h1>

                <p className="text-base md:text-xl font-mono text-muted-foreground mb-8 md:mb-12 max-w-md">
                    How well do you know world flags? Let's find out.
                </p>

                <div className="flex flex-col gap-4 md:gap-6 w-full max-w-sm">
                    <Button
                        size="lg"
                        className="h-20 md:h-24 justify-between px-6 md:px-8 bg-background hover:bg-muted text-foreground group border-2 border-foreground shadow-retro"
                        onClick={onStartSolo}
                    >
                        <div className="flex items-center gap-4 md:gap-6">
                            <div className="p-2 md:p-3 bg-destructive border-2 border-foreground text-white group-hover:rotate-3 transition-transform">
                                <UserIcon className="w-5 h-5 md:w-6 md:h-6" />
                            </div>
                            <div className="text-left">
                                <div className="text-xl md:text-2xl font-black block leading-none">SOLO</div>
                                <div className="text-[10px] md:text-xs font-mono font-normal opacity-70">Compete against yourself <br /> with many different modes</div>
                            </div>
                        </div>
                        <ArrowRightIcon className="w-5 h-5 md:w-6 md:h-6 opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-destructive" />
                    </Button>

                    <Link href="/lobby" className="w-full">
                        <Button
                            size="lg"
                            variant="outline"
                            className="h-20 md:h-24 w-full justify-between px-6 md:px-8 bg-background hover:bg-muted group border-2 border-foreground shadow-retro"
                        >
                            <div className="flex items-center gap-4 md:gap-6">
                                <div className="p-2 md:p-3 bg-blue-600 border-2 border-foreground text-white group-hover:rotate-3 transition-transform">
                                    <UsersIcon className="w-5 h-5 md:w-6 md:h-6" />
                                </div>
                                <div className="text-left">
                                    <div className="text-xl md:text-2xl font-black block leading-none">MULTIPLAYER</div>
                                    <div className="text-[10px] md:text-xs font-mono font-normal opacity-70">Challenge your friends</div>
                                </div>
                            </div>
                            <ArrowRightIcon className="w-5 h-5 md:w-6 md:h-6 opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-blue-600" />
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
