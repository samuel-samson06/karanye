import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import logo from "@/public/images/logo.png";

export const metadata: Metadata = {
  title: "Page Not Found — KARANYÉ",
  description: "The page you are looking for could not be found.",
};

// Minimal editorial 404: shared storefront chrome with a centered wordmark,
// error indicator, concise message, and a single homepage action.
export default function NotFound() {
  return (
    <>
      <Header />
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center px-5 py-16 text-center md:px-8 lg:py-24">
        <Image
          src={logo}
          alt="Karanyé"
          width={180}
          className="h-auto w-[180px]"
          priority
        />
        <p className="mt-10 text-label-md text-muted">Error 404</p>
        <h1
          className="mt-4 text-display-lg text-ink"
          style={{ fontFamily: "var(--font-bodoni)" }}
        >
          This page could not be found.
        </h1>
        <p className="mt-4 max-w-md text-body-md text-muted">
          The piece you are looking for is no longer on the rail. Let us take
          you back to the house.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex h-[52px] min-h-11 items-center justify-center bg-crimson px-8 text-label-md text-canvas transition-colors hover:bg-crimson-deep"
        >
          Back to Homepage
        </Link>
      </main>
      <Footer />
    </>
  );
}
