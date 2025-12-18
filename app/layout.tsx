import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Archivo_Black, Space_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SettingsProvider } from "@/lib/context/SettingsContext";
import { GameNavigationProvider } from "@/lib/context/GameNavigationContext";
import { Toaster } from "@/components/ui/sonner";
import { GlobalNavigation } from "@/components/GlobalNavigation";
import "./globals.css";

const archivoBlack = Archivo_Black({
  weight: "400",
  variable: "--font-archivo",
  subsets: ["latin"],
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Guess the Country | flags.games",
  description: "Test your knowledge and identify countries by their flags",
  openGraph: {
    title: "Guess the Country | flags.games",
    description: "Test your knowledge and identify countries by their flags",
    url: "https://flags.games",
    siteName: "flags.games",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://flags.games/opengraph-image.png",
        width: 200,
        height: 200,
        alt: "Guess the Country | flags.games",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Guess the Country | flags.games",
    description: "Test your knowledge and identify countries by their flags",
    images: [
      {
        url: "https://flags.games/opengraph-image.png",
        width: 200,
        height: 200,
        alt: "Guess the Country | flags.games",
      },
    ],
  },
  applicationName: "flags.games",
  metadataBase: new URL("https://flags.games"),
  alternates: {
    canonical: "https://flags.games/",
  },
  keywords: ["flag guessing game", "country guessing game"],
  authors: [{ name: "Xurify" }],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const theme = (await cookies()).get("theme")?.value as "light" | "dark" | undefined;
  const isDark = theme === "dark";
  return (
    <html lang="en" className={isDark ? `dark` : undefined}>
      <head>
        <link rel="dns-prefetch" href="//qqu03sron6.ufs.sh" />
      </head>
      <body
        className={`${archivoBlack.variable} ${spaceMono.variable} antialiased font-mono bg-background text-foreground preload`}
      >
        <SettingsProvider initialDarkMode={isDark}>
          <GameNavigationProvider>
            <Toaster theme={theme} />
            <GlobalNavigation />
            {children}
          </GameNavigationProvider>
        </SettingsProvider>
        {process.env.NODE_ENV !== "development" && <Analytics />}
      </body>
    </html>
  );
}
