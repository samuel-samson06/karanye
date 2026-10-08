"use client";

import { toast } from "react-toastify";

const enquiryTypes = ["General", "Order", "Size & Fit", "Made to Measure", "Other"];

const inputClass =
  "h-[52px] min-h-11 w-full border border-hairline bg-canvas px-4 text-body-md text-ink placeholder:text-muted focus:border-crimson focus:outline-none";

// Correspondence form: UI only. Submit is dead — it fires a placeholder toast
// and keeps the entered values. Real sending (POST /api/contact + Resend)
// arrives with Phase 4; the honeypot field is already in place for it.
// TODO(content): replace toast copy and wire to the API in Phase 4.
export default function FormSection() {
  const notifyNoted = (): void => {
    toast.info("Correspondence noted — sending opens soon.", {
      toastId: "contact-coming-soon",
    });
  };

  return (
    <div className="border border-platinum bg-canvas p-6 md:p-10">
      <p className="text-label-md text-muted">Bespoke Dispatch</p>
      <h2
        className="mt-3 text-headline-lg text-ink"
        style={{ fontFamily: "var(--font-bodoni)" }}
      >
        Initiate Correspondence
      </h2>
      <p className="mt-3 text-body-md text-muted">
        Please enter your details below. For custom sizing or bespoke bridal
        inquiries, feel free to reference specific silhouettes or fabrics.
      </p>

      <form
        className="mt-8 flex flex-col gap-5"
        onSubmit={(event) => {
          event.preventDefault();
          notifyNoted();
        }}
      >
        {/* Honeypot for Phase 4 server validation — ignored for now. */}
        <input
          type="text"
          name="company"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="hidden"
          defaultValue=""
        />

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label htmlFor="contact-name" className="text-label-md text-muted">
              Full Name *
            </label>
            <input
              id="contact-name"
              name="name"
              type="text"
              autoComplete="name"
              required
              minLength={2}
              placeholder="e.g. Amina Adeleke"
              className={inputClass}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="contact-email" className="text-label-md text-muted">
              Email Address *
            </label>
            <input
              id="contact-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="e.g. amina@domain.com"
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label htmlFor="contact-phone" className="text-label-md text-muted">
              Contact Telephone / WhatsApp <span aria-hidden="true">(optional)</span>
            </label>
            <input
              id="contact-phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              placeholder="+234 or +44…"
              className={inputClass}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="contact-type" className="text-label-md text-muted">
              Nature of Inquiry *
            </label>
            <select id="contact-type" name="enquiryType" required className={inputClass} defaultValue="">
              <option value="" disabled>
                Select inquire intent…
              </option>
              {enquiryTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="contact-reference" className="text-label-md text-muted">
            Garment Silhouette Reference <span aria-hidden="true">(optional)</span>
          </label>
          <input
            id="contact-reference"
            name="reference"
            type="text"
            placeholder="e.g. The Zaria Gown, The Moremi Blazer, or Bespoke Brief"
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="contact-message" className="text-label-md text-muted">
            Message / Anatomical Specifications *
          </label>
          <textarea
            id="contact-message"
            name="message"
            required
            minLength={10}
            rows={6}
            placeholder="Kindly share your specific requirements, preferred atelier fitting dates, or questions on fabrication…"
            className="min-h-32 w-full border border-hairline bg-canvas px-4 py-3 text-body-md text-ink placeholder:text-muted focus:border-crimson focus:outline-none"
          />
        </div>

        <button
          type="submit"
          className="inline-flex h-[52px] min-h-11 items-center justify-center gap-3 bg-crimson px-8 text-label-md text-canvas transition-colors hover:bg-crimson-deep"
        >
          Send Message
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M2 7h9M8 3.5L11.5 7 8 10.5" stroke="currentColor" strokeWidth="1" />
          </svg>
        </button>

        <p className="flex items-center gap-2 text-label-md text-muted">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <rect x="2" y="5" width="8" height="6" stroke="currentColor" strokeWidth="1" />
            <path d="M4 5V3.5a2 2 0 0 1 4 0V5" stroke="currentColor" strokeWidth="1" />
          </svg>
          All correspondence is held in strict atelier confidentiality.
        </p>
      </form>
    </div>
  );
}
