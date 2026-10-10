import { announcementLines } from "@/lib/data/home";
import Navigation from "@/components/layout/Navigation";

// Universal header: slim announcement bar + bordered navigation shell.
export default function Header() {
  return (
    <header className="bg-canvas">
      <div className="border-b border-platinum">
        <p className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-6 gap-y-1 px-5 py-2 text-center text-label-md text-muted">
          {announcementLines.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </p>
      </div>
      <div className="border-b border-platinum">
        <div className="mx-auto max-w-7xl px-3 py-3 md:px-6 md:py-4 lg:px-16">
          <Navigation />
        </div>
      </div>
    </header>
  );
}
