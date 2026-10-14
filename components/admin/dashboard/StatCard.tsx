interface StatCardProps {
  label: string;
  value: string;
  sub: string;
}

// Reusable KPI card: linen surface, hairline frame, Bodoni value.
export default function StatCard({ label, value, sub }: StatCardProps) {
  return (
    <div className="border border-platinum bg-linen p-6 lg:p-8">
      <p className="text-label-md text-muted">{label}</p>
      <p
        className="mt-3 text-display-lg text-ink"
        style={{ fontFamily: "var(--font-bodoni)" }}
      >
        {value}
      </p>
      <p className="mt-2 text-body-sm text-muted">{sub}</p>
    </div>
  );
}
