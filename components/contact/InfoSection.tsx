// Contact info column: direct channels, atelier cards, response cadence.
// All details transcribed from the approved screenshot — TODO(content)
// throughout; real contact details arrive with Phase 4.
export default function InfoSection() {
  return (
    <div className="flex flex-col gap-10">
      <div>
        <p className="text-label-md text-muted">Direct Channels &amp; Communications</p>

        <div className="mt-6 border-t border-hairline pt-6">
          <p className="text-label-md text-muted">Private client inquiries &amp; orders</p>
          <p className="mt-2 text-headline-sm text-ink">clientcare@karanye.com</p>
        </div>

        <div className="mt-6">
          <p className="text-label-md text-muted">Direct atelier liaison / concierge WhatsApp</p>
          <p className="mt-2 text-body-md text-ink">+234 802 000 0000 (Lagos hub)</p>
          <p className="mt-1 text-body-md text-ink">+44 20 7946 0000 (London suite)</p>
        </div>

        <div className="mt-6">
          <p className="text-label-md text-muted">Press &amp; editorial archive</p>
          <p className="mt-2 text-headline-sm text-ink">press@karanye.com</p>
        </div>

        <div className="mt-6">
          <p className="text-label-md text-muted">Social / house chronicle</p>
          <p className="mt-2 text-body-md text-ink">@karanye.official · Journal Archive</p>
        </div>
      </div>

      <div>
        <p className="text-label-md text-muted">Atelier Salons &amp; Fitting Chambers</p>
        <ul className="mt-6 flex flex-col gap-4">
          <li className="border border-platinum bg-linen p-6">
            <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
              <h2 className="text-headline-sm text-ink">Victoria Island Atelier &amp; Archive</h2>
              <span className="shrink-0 border border-platinum px-2 py-1 text-label-sm text-muted">
                Primary
              </span>
            </div>
            <p className="mt-3 text-body-md text-muted">
              14 Akin Adesola St, Victoria Island
              <br />
              Lagos, Nigeria
            </p>
            <p className="mt-3 text-label-md text-muted">Mon–Sat, 10:00–18:00 · By appointment</p>
          </li>
          <li className="border border-platinum bg-linen p-6">
            <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
              <h2 className="text-headline-sm text-ink">Mayfair Private Client Suite</h2>
              <span className="shrink-0 border border-platinum px-2 py-1 text-label-sm text-muted">
                Salon
              </span>
            </div>
            <p className="mt-3 text-body-md text-muted">
              28 Conduit Street, Mayfair
              <br />
              London W1S 2XD, United Kingdom
            </p>
            <p className="mt-3 text-label-md text-muted">Mon–Fri, 10:00–17:30 · Private reservation</p>
          </li>
        </ul>
      </div>

      <aside className="border-l-2 border-ink bg-linen px-6 py-5">
        <p className="text-label-md text-ink">Response cadence protocol</p>
        <p className="mt-2 text-body-md text-muted">
          Our atelier client directors review each inquiry personally within 24
          business hours. Complex bespoke commissions may require additional
          consultation with our lead patternmakers.
        </p>
      </aside>
    </div>
  );
}
