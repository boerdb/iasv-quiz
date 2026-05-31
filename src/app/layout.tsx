import type { Metadata, Viewport } from "next";
import { Nunito } from "next/font/google";
import { PwaPrompts } from "@/components/PwaPrompts";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

const appName = process.env.NEXT_PUBLIC_APP_NAME ?? "iASV Beademing Quiz";

export const metadata: Metadata = {
  title: appName,
  description:
    "Vrolijke quiz over iASV beademing met 10 random vragen, score 0-10 en uitleg.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "iASV Quiz",
  },
  icons: {
    icon: "/icons/icon-192.svg",
    apple: "/icons/icon-512.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#14b8a6",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl" className={`${nunito.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        {children}
        <PwaPrompts />
      </body>
    </html>
  );
}
