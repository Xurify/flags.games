import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Guess the Country | Flags.games",
  description: "Test your knowledge and identify countries by their flags",
  openGraph: {
    title: "Guess the Country | Flags.games",
    description: "Test your knowledge and identify countries by their flags",
    url: "https://www.flags.games",
    siteName: "flags.games",
    images: [
      {
        url: "/icon.svg",
        width: 1200,
        height: 630,
        alt: "flags.games Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Guess the Country | flags.games",
    description: "Test your knowledge and identify countries by their flags",
    images: [
      {
        url: "/icon.svg",
        alt: "flags.games Logo",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
