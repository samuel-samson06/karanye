import Link from "next/link";
import {
  formatAdminDate,
  getUnresolvedComplaints,
  type MockComplaint,
} from "@/lib/admin/data";

function complaintLabel(status: MockComplaint["status"]): string {
  return status === "in_review" ? "In Review" : "Open";
}

// Unresolved complaints (open + in review), newest first, capped at three.
export default function ComplaintsOverview() {
  const complaints = getUnresolvedComplaints().slice(0, 3);

  return (
    <section
      aria-label="Unresolved complaints"
      className="flex flex-col border border-platinum bg-canvas"
    >
      <div className="flex items-center justify-between gap-4 border-b border-platinum px-6 py-5">
        <h2 className="text-headline-sm text-ink">
          Complaints{" "}
          <span className="text-label-md text-muted">
            ({getUnresolvedComplaints().length} unresolved)
          </span>
        </h2>
        <Link
          href="/admin/complaints"
          className="editorial-link shrink-0 text-label-md text-crimson"
        >
          View All Complaints
        </Link>
      </div>

      {complaints.length === 0 ? (
        <p className="px-6 py-10 text-center text-body-md text-muted">
          No unresolved complaints. The atelier is at peace.
        </p>
      ) : (
        <ul className="flex flex-col divide-y divide-platinum">
          {complaints.map((complaint) => (
            <li
              key={`${complaint.subject}-${complaint.createdAt}`}
              className="flex flex-wrap items-center gap-x-6 gap-y-2 px-6 py-4"
            >
              <div className="min-w-0">
                <p className="text-body-md text-ink">{complaint.subject}</p>
                <p className="mt-1 truncate text-body-sm text-muted">
                  {complaint.customerName} · {formatAdminDate(complaint.createdAt)}
                </p>
              </div>
              <span className="ml-auto border border-platinum bg-linen px-3 py-2 text-label-md text-ink">
                {complaintLabel(complaint.status)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
