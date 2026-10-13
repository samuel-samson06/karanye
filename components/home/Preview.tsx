import Image from "next/image";

// TODO(content): assign final image and alt once art direction is set.
const detailImage = "/images/style_01.jpeg";
const detailAlt =
  "Model in a strapless yellow and blue geometric-print dress with a cobalt tulle hem";


const stats = [{ value: "100%", label: "Made to order" },{ value: "5–7 Days", label: "Processing time" }, { value: "Lagos & London", label: "Atelier presence" }]


export default function Preview() {
  return (
    <section aria-label="Karanyé philosophy" className="bg-canvas">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-8 md:gap-6 md:px-8 md:py-20 lg:grid-cols-12 lg:gap-8 lg:px-16 lg:py-24">
        <div className="relative aspect-[4/5] w-full overflow-hidden border border-platinum md:col-span-3 lg:col-span-5">
          <Image
            src={detailImage}
            alt={detailAlt}
            fill
            sizes="(min-width: 1024px) 40vw, (min-width: 768px) 36vw, 100vw"
            className="object-cover"
          />
        </div>
        <div className="flex flex-col justify-center md:col-span-5 md:pl-4 lg:col-span-7 lg:pl-8">
          <blockquote className="text-headline-lg text-ink">
            &ldquo;We construct garments not as disposable inventory, but as wearable architecture — sculpted slowly, fitted personally.&rdquo;
          </blockquote>
          <p className="mt-6 max-w-xl text-body-md text-muted">
            Every Karanyé piece is made to order in our atelier. No mass production, no warehouses of stock — only considered cutting, careful finishing, and fabric chosen to last.
          </p>
          <dl className="mt-10 grid grid-cols-3 border-t border-hairline pt-6">
            {stats.map((stat) => (
              // dt must precede dd in the DOM; flex-col-reverse puts the value on top.
              <div
                key={stat.label}
                className="flex flex-col-reverse justify-end border-l border-hairline pl-4 first:border-l-0 first:pl-0 md:pl-6"
              >
                <dt className="mt-2 text-label-md text-muted">{stat.label}</dt>
                <dd className="text-headline-sm text-ink">{stat.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
