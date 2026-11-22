"use client";

type Attendee = {
  attendee_name: string | null;
  attendee_email: string | null;
  attendee_phone: string | null;
  attendee_organisation: string | null;
  registered_at: string;
  attendance_status: string;
  id: string;
};

export default function RegistrationsExport({
  attendees,
}: {
  attendees: Attendee[];
}) {
  function downloadCSV() {
    const headers = [
      "Name",
      "Email",
      "Phone",
      "Organisation",
      "Registration Reference",
      "Registered At",
      "Status",
    ];

    const rows = attendees.map((attendee) => [
      attendee.attendee_name || "",
      attendee.attendee_email || "",
      attendee.attendee_phone || "",
      attendee.attendee_organisation || "",
      `GC-${attendee.id.slice(0, 8).toUpperCase()}`,
      attendee.registered_at,
      attendee.attendance_status,
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row
          .map((value) => `"${String(value).replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\r\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "growth-circle-attendees.csv";
    link.click();

    URL.revokeObjectURL(url);
  }

  return (
    <button
      onClick={downloadCSV}
      disabled={attendees.length === 0}
      className="rounded-lg bg-[#1D382A] px-5 py-3 text-sm font-semibold text-white hover:bg-[#4F6F4A] disabled:cursor-not-allowed disabled:opacity-50"
    >
      Download Attendee List
    </button>
  );
}