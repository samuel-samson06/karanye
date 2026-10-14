import type { Metadata } from "next";
import { Bodoni_Moda, Geist, Geist_Mono, Hanken_Grotesk } from "next/font/google";
import ToastHost from "@/components/layout/ToastHost";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const bodoniModa = Bodoni_Moda({
  variable: "--font-bodoni-moda",
  subsets: ["latin"],
  // Italic is needed for the hero's "Made to Order." (Stitch homepage);
  // without it the browser would synthesise a faux italic.
  style: ["normal", "italic"],
  display: "swap",
});

const hankenGrotesk = Hanken_Grotesk({
  variable: "--font-hanken-grotesk",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  // TODO(content): confirm site title and description
  title: "KARANYÉ — Thoughtfully Crafted. Made to Order.",
  description:
    "Karanyé is a Nigerian fashion label creating distinctive, made-to-order contemporary pieces.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${bodoniModa.variable} ${hankenGrotesk.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-canvas text-ink">
        {children}
        <ToastHost />
      </body>
    </html>
  );
}
