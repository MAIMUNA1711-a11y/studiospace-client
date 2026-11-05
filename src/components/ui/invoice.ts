import type { Booking } from "@/types";
import { formatDate, formatMoney } from "@/lib/format";

export async function downloadInvoice(b: Booking) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const left = 48;
  const right = 547;
  const ref = b._id.slice(-8).toUpperCase();

  doc.setFillColor(245, 124, 0);
  doc.rect(0, 0, 595, 90, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(26);
  doc.text("StudioSpace", left, 55);
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text("Booking Invoice", right, 55, { align: "right" });

  doc.setTextColor(30, 30, 30);
  let y = 135;

  const line = (label: string, value: string, bold = false) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(110, 110, 110);
    doc.text(label, left, y);
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setTextColor(30, 30, 30);
    doc.text(value, right, y, { align: "right" });
    y += 24;
  };

  const rule = () => {
    doc.setDrawColor(220, 220, 220);
    doc.line(left, y - 12, right, y - 12);
    y += 10;
  };

  line("Invoice reference", `SS-${ref}`, true);
  line("Issued on", formatDate(new Date().toISOString()));
  line("Booking status", b.status, true);
  rule();

  line("Studio", b.studioTitle, true);
  line("Category", b.studioCategory);
  line("Location", b.studioLocation.slice(0, 60));
  line("Host", b.ownerName);
  rule();

  line("Guest", b.userName);
  line("Guest email", b.userEmail);
  line("Booking date", formatDate(b.bookingDate));
  line("Time", `${b.startTime} to ${b.endTime}`);
  rule();

  line("Hourly rate", formatMoney(b.hourlyRate));
  line("Duration", `${b.durationHours} hour${b.durationHours === 1 ? "" : "s"}`);
  line("Security deposit", formatMoney(b.securityDeposit));
  rule();

  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.setTextColor(245, 124, 0);
  doc.text("Session total", left, y);
  doc.text(formatMoney(b.totalPrice), right, y, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(130, 130, 130);
  doc.text(
    "Thank you for booking with StudioSpace. The security deposit is arranged directly with the host.",
    left,
    780,
  );

  doc.save(`StudioSpace-Invoice-${ref}.pdf`);
}