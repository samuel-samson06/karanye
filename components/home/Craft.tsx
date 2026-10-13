import Image from "next/image";
import Link from "next/link";

// TODO(content): replace with approved craft copy, and assign final images
// once art direction is set.
const eyebrow = "The atelier";
const title = "Seasoned with Integrity, Cut with Intent";
const body =
  "Inside the atelier, each commission passes through the same hands — from pattern draft to final press. Slow work, on purpose.";
const linkLabel = "Explore our story";
const linkHref = "/about";
const image = "/images/style_01.jpeg";
const imageAlt =
  "Model in a strapless yellow and blue geometric-print dress with a cobalt tulle hem";

// Atelier craft editorial: asymmetric imagery with narrative beside it.
// Mobile stacks; tablet pairs the images above the text; desktop runs
// the large image down the left with detail image and text to its right.
export default function Craft() {
  return (
    <section aria-label="Inside the atelier" className="border-t border-platinum bg-canvas">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-8 md:gap-6 md:px-8 md:py-20 lg:grid-cols-12 lg:gap-8 lg:px-16 lg:py-24">
        <div className="relative aspect-[4/5] w-full overflow-hidden border border-platinum md:col-span-5 lg:col-span-7 lg:row-span-2 lg:aspect-[3/4]">
          <Image
            src={image}
            alt={imageAlt}
            fill
            sizes="(min-width: 1024px) 55vw, (min-width: 768px) 60vw, 100vw"
            className="object-cover object-[center_25%]"
          />
        </div>
        <div className="relative aspect-square w-full overflow-hidden border border-platinum md:col-span-3 md:self-end lg:col-span-5 lg:aspect-[4/3] lg:self-start">
          <Image
            src={image}
            alt={imageAlt}
            fill
            sizes="(min-width: 1024px) 35vw, (min-width: 768px) 36vw, 100vw"
            className="object-cover object-[center_25%]"
          />
        </div>
        <div className="md:col-span-6 lg:col-span-5 lg:self-end">
          <p className="text-label-md text-muted">{eyebrow}</p>
          <h2 className="mt-3 text-headline-lg text-ink">{title}</h2>
          <p className="mt-4 max-w-xl text-body-md text-muted">{body}</p>
          <Link
            href={linkHref}
            className="editorial-link mt-6 inline-block text-label-md text-crimson"
          >
            {linkLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
