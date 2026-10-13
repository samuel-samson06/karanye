// Temporary kobo → Naira display for dummy data.
// The canonical helper grows here with checkout (Phase 5).
export function formatNaira(kobo: number): string {
  const naira = kobo / 100;
  return `₦${naira.toLocaleString("en-NG")}`;
}
