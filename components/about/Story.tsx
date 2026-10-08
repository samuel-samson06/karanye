import Image from "next/image";

// Origin act: dress-form imagery beside the Lagos narrative and the
// three construction principles. Copy is screenshot placeholder.
// TODO(content): replace with approved About copy and photography.
export default function Story() {
  return (
    <section aria-label="Rooted in Lagos" className="bg-canvas">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:px-8 lg:grid-cols-12 lg:gap-8 lg:px-16 lg:py-24">
        <div className="relative aspect-[3/4] w-full overflow-hidden border border-platinum lg:col-span-5">
          {/* TODO(content): replace with brand photography */}
          <Image
            src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=900&auto=format&fit=crop"
            alt="Crimson fabric draped on a dress form in the atelier"
            fill
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="object-cover"
          />
        </div>

        <div className="flex flex-col justify-center lg:col-span-7 lg:pl-8">
          <p className="text-label-md text-muted">Origins</p>
          <h2
            className="mt-3 text-display-lg text-ink"
            style={{ fontFamily: "var(--font-bodoni)" }}
          >
            Rooted in Lagos, Cut for the World
          </h2>
          <p className="mt-6 max-w-xl text-body-md text-muted">
            Karanyé began with a single conviction: that Nigerian couture
            deserves the slow, deliberate construction of the great ateliers —
            pattern drafted by hand, cloth cut only upon commission, and every
            seam finished as if it will be worn for decades.
          </p>
          <p className="mt-4 max-w-xl text-body-md text-muted">
            Nothing here is mass-produced. Each piece passes through the same
            hands from first toile to final press, in Lagos and in London.
          </p>

          <ol className="mt-10 flex flex-col gap-6 border-t border-hairline pt-8">
            <li className="flex gap-5">
              <span aria-hidden="true" className="text-label-md text-crimson">01</span>
              <div>
                <h3 className="text-headline-sm text-ink">Pattern as Foundation</h3>
                <p className="mt-2 max-w-lg text-body-md text-muted">
                  Every silhouette begins as a geometric construction — drafted,
                  tested in muslin, and refined before a single fashion fabric
                  is cut.
                </p>
              </div>
            </li>
            <li className="flex gap-5">
              <span aria-hidden="true" className="text-label-md text-crimson">02</span>
              <div>
                <h3 className="text-headline-sm text-ink">Considered Construction</h3>
                <p className="mt-2 max-w-lg text-body-md text-muted">
                  Boning, interfacing, and hand-finishing where the garment
                  needs architecture — never decoration for its own sake.
                </p>
              </div>
            </li>
            <li className="flex gap-5">
              <span aria-hidden="true" className="text-label-md text-crimson">03</span>
              <div>
                <h3 className="text-headline-sm text-ink">Made to Be Reworn</h3>
                <p className="mt-2 max-w-lg text-body-md text-muted">
                  Generous seams and archival patterns mean your piece can be
                  altered, restored, and reworn for years — then handed down.
                </p>
              </div>
            </li>
          </ol>
        </div>
      </div>
    </section>
  );
}
