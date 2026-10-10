import Image from "next/image";
import { placeholderImage, placeholderImageAlt } from "@/lib/data/home";

const tenets = [
  {
    index: "01",
    title: "Thoughtfully Crafted",
    body: "No sketch survives first contact with cloth unchanged. Each design is draped, pinned, and re-drafted until the architecture holds — only then does it earn the Karanyé name.",
    // TODO(content): replace with brand photography
    image: placeholderImage,
    alt: placeholderImageAlt,
  },
  {
    index: "02",
    title: "Made to Order as Ethos",
    body: "Nothing is cut before it is commissioned. Your piece does not exist until you order it — and from that moment, it exists only for you.",
    // TODO(content): replace with brand photography
    image: placeholderImage,
    alt: placeholderImageAlt,
  },
  {
    index: "03",
    title: "Form & Presence",
    body: "A Karanyé silhouette is a language of posture and proportion — sculptural where it should command, quiet where it should listen.",
    // TODO(content): replace with brand photography
    image: placeholderImage,
    alt: placeholderImageAlt,
  },
];

// Belief act: full-bleed manifesto band followed by the three tenets in
// alternating rows. Copy is screenshot placeholder.
// TODO(content): replace with approved About copy and photography.
export default function Craft() {
  return (
    <section aria-label="What we believe" className="bg-canvas">
      <div className="bg-crimson">
        <blockquote className="mx-auto max-w-4xl px-5 py-14 text-center md:px-8 lg:py-20">
          <p className="text-display-lg text-canvas">
            &ldquo;We do not make garments for fleeting seasons. We draft
            wearable architecture that honours the feminine posture and the
            human hand.&rdquo;
          </p>
          <cite className="mt-6 block text-label-md text-canvas/70 not-italic">
            The Karanyé Atelier
          </cite>
        </blockquote>
      </div>

      <div className="mx-auto max-w-7xl px-5 py-14 md:px-8 md:py-20 lg:px-16 lg:py-24">
        <p className="text-label-md text-muted">Belief</p>
        <h2 className="mt-3 text-display-lg text-ink">
          The Three Tenets of Karanyé Form
        </h2>

        <div className="mt-10 flex flex-col gap-14 md:gap-16 lg:gap-20">
          {tenets.map((tenet, position) => (
            <div
              key={tenet.index}
              className="grid items-center gap-8 md:grid-cols-8 md:gap-6 lg:grid-cols-12 lg:gap-8"
            >
              <div
                className={
                  position % 2 === 0
                    ? "md:col-span-4 lg:col-span-5"
                    : "md:order-2 md:col-span-4 lg:col-span-5"
                }
              >
                <p className="text-label-md text-crimson">Tenet {tenet.index}</p>
                <h3 className="mt-3 text-headline-lg text-ink">{tenet.title}</h3>
                <p className="mt-4 max-w-lg text-body-md text-muted">{tenet.body}</p>
              </div>
              <div
                className={
                  position % 2 === 0
                    ? "relative aspect-[4/5] w-full overflow-hidden border border-platinum md:col-span-4 md:aspect-[4/3] lg:col-span-7"
                    : "relative aspect-[4/5] w-full overflow-hidden border border-platinum md:order-1 md:col-span-4 md:aspect-[4/3] lg:col-span-7"
                }
              >
                <Image
                  src={tenet.image}
                  alt={tenet.alt}
                  fill
                  sizes="(min-width: 1024px) 55vw, (min-width: 768px) 50vw, 100vw"
                  className="object-cover object-[center_25%]"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
