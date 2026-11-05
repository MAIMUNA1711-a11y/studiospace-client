import type { BookingStatus } from "@/types";

const STYLES: Record<BookingStatus, string> = {
  Pending: "badge-warning",
  Confirmed: "badge-info",
  Completed: "badge-success",
  Cancelled: "badge-error",
};

export default function StatusBadge({ status }: { status: BookingStatus }) {
  return <span className={`badge ${STYLES[status]}`}>{status}</span>;
}