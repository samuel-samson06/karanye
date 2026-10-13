"use client";

import { useState } from "react";

// TODO(content): replace with approved private list copy.
const title = "Join Our Private List";
const body =
  "New designs, atelier notes, and first access to limited pieces. One letter at a time.";
const nameLabel = "Name";
const emailLabel = "Email";
const submitLabel = "Join the Private List";
const note = "We write rarely and only when it matters. Unsubscribe anytime.";

// Private List invitation: name + email. UI only — no API wiring yet.
// TODO(content): wire to POST /api/waitlist in Phase 4 (with honeypot + Resend).
export default function NewsLetter() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <section aria-label="Join our private list" className="border-t border-platinum bg-canvas">
      <div className="mx-auto max-w-2xl px-5 py-14 text-center md:px-8 md:py-20 lg:py-24">
        <h2 className="text-display-lg text-ink">{title}</h2>
        <p className="mx-auto mt-4 max-w-md text-body-md text-muted">
          {body}
        </p>

        {submitted ? (
          <p role="status" className="mx-auto mt-10 max-w-md border border-platinum bg-linen px-6 py-5 text-body-md text-ink">
            Thank you — you are on the list. Watch your inbox.
          </p>
        ) : (
          <form
            className="mt-10 flex flex-col gap-8 text-left"
            onSubmit={(event) => {
              event.preventDefault();
              setSubmitted(true);
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
            <div className="grid gap-8 md:grid-cols-2 md:gap-6">
              <div className="flex flex-col gap-2">
                <label htmlFor="private-list-name" className="text-label-md text-muted">
                  {nameLabel}
                </label>
                <input
                  id="private-list-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  minLength={2}
                  placeholder="Your name"
                  className="h-12 border-0 border-b border-hairline bg-transparent px-0 text-body-md text-ink placeholder:text-muted focus:border-crimson focus:outline-none"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="private-list-email" className="text-label-md text-muted">
                  {emailLabel}
                </label>
                <input
                  id="private-list-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="you@example.com"
                  className="h-12 border-0 border-b border-hairline bg-transparent px-0 text-body-md text-ink placeholder:text-muted focus:border-crimson focus:outline-none"
                />
              </div>
            </div>
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between md:gap-8">
              <p className="text-body-sm text-muted md:max-w-xs">{note}</p>
              <button
                type="submit"
                className="inline-flex h-13 shrink-0 items-center justify-center bg-crimson px-10 text-label-md text-canvas transition-colors hover:bg-crimson-deep"
              >
                {submitLabel}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
