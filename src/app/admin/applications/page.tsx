
import Link from "next/link";
import { requireAdminPermission } from "@/lib/admin";
import AdminSidebar from "../admin-sidebar";
import { connection } from "next/server";
import {
  approveMembershipApplication,
  rejectMembershipApplication,
} from "./actions";

const resultMessages: Record<string, string> = {
  approved: "Application approved. Membership is now active.",
  rejected: "Application rejected.",
  account_not_linked: "The applicant must create an account and link it first.",
  account_email_not_verified: "The applicant must verify their email address first.",
  account_email_mismatch: "The account email does not match the application.",
  cannot_review_own_application: "You cannot review your own application.",
  application_not_pending: "This application has already been reviewed.",
  application_not_found: "Application not found.",
  not_authorized: "You do not have permission to review applications.",
  failed: "Something went wrong. Please try again.",
};

export default async function ApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ result?: string }>;
}) {
  await connection();

  const { result } = await searchParams;
  const supabase = await requireAdminPermission("membership.review");

  const { data: applications, error } = await supabase
    .from("membership_applications")
    .select(
      "id, full_name, email, phone, interests, motivation, status, created_at, auth_user_id"
    )
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-[#F6F4EC] md:flex">
      <AdminSidebar />

      <div className="min-w-0 flex-1 px-5 py-8 md:px-10 md:py-10">
        <header className="mb-8">
          <Link
            href="/admin"
            className="text-sm font-medium text-[#4F6F4A] hover:underline"
          >
            ← Back to Dashboard
          </Link>

          <h1 className="mt-5 font-[var(--font-playfair)] text-3xl font-bold text-[#1D382A]">
            Membership Applications
          </h1>

          <p className="mt-2 text-sm text-[#758078]">
            Review people who have expressed interest in joining Growth Circle.
          </p>
        </header>

        {result && resultMessages[result] && (
          <p
            role="status"
            className="mb-6 rounded-lg border border-[#E2E4DC] bg-white p-4 text-sm text-[#1D382A]"
          >
            {resultMessages[result]}
          </p>
        )}

        <section className="rounded-xl border border-[#E2E4DC] bg-white p-6">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-semibold text-[#1D382A]">
              All Applications
            </h2>

            <span className="rounded-full bg-[#E9EDE3] px-4 py-2 text-xs font-semibold text-[#4F6F4A]">
              {applications?.length ?? 0} applications
            </span>
          </div>

          {error ? (
            <p className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
              Unable to load applications. Please check your database access.
            </p>
          ) : !applications || applications.length === 0 ? (
            <p className="rounded-lg bg-[#F6F4EC] p-6 text-center text-sm text-[#758078]">
              No membership applications have been received yet.
            </p>
          ) : (
            <div className="space-y-4">
              {applications.map((application) => (
                <article
                  key={application.id}
                  className="rounded-lg border border-[#E2E4DC] p-5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-[#1D382A]">
                        {application.full_name}
                      </h3>

                      <p className="mt-1 text-sm text-[#758078]">
                        {application.email}
                      </p>

                      <p className="mt-1 text-sm text-[#758078]">
                        {application.phone || "No phone number provided"}
                      </p>
                    </div>

                    <div className="flex flex-col items-start gap-2">
                      <span className="rounded-full bg-[#F6F4EC] px-3 py-1 text-xs font-semibold capitalize text-[#4F6F4A]">
                        {application.status}
                      </span>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          application.auth_user_id
                            ? "bg-[#E9EDE3] text-[#4F6F4A]"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {application.auth_user_id
                          ? "Account linked"
                          : "Account not linked"}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 border-t border-[#E2E4DC] pt-4">
                    <p className="text-xs font-semibold text-[#1D382A]">
                      Interests
                    </p>
                    <p className="mt-1 text-sm text-[#758078]">
                      {Array.isArray(application.interests)
                        ? application.interests.join(", ")
                        : application.interests || "Not provided"}
                    </p>

                    <p className="mt-4 text-xs font-semibold text-[#1D382A]">
                      Why they want to join
                    </p>
                    <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-[#758078]">
                      {application.motivation || "Not provided"}
                    </p>

                    <p className="mt-4 text-xs text-[#758078]">
                      Submitted:{" "}
                      {new Date(application.created_at).toLocaleDateString(
                        "en-NG",
                        {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        }
                      )}
                    </p>
                  </div>

                  {application.status === "pending" && (
                    <div className="mt-5 flex flex-wrap gap-3 border-t border-[#E2E4DC] pt-4">
                      {application.auth_user_id ? (
                        <form action={approveMembershipApplication}>
                          <input
                            type="hidden"
                            name="applicationId"
                            value={application.id}
                          />
                          <button
                            type="submit"
                            className="rounded-lg bg-[#1D382A] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#4F6F4A]"
                          >
                            Approve application
                          </button>
                        </form>
                      ) : (
                        <p className="text-sm text-amber-700">
                          Approval unavailable until the applicant links a
                          verified account.
                        </p>
                      )}

                      <form action={rejectMembershipApplication}>
                        <input
                          type="hidden"
                          name="applicationId"
                          value={application.id}
                        />
                        <button
                          type="submit"
                          className="rounded-lg border border-red-200 px-5 py-2.5 text-sm font-semibold text-red-700 hover:bg-red-50"
                        >
                          Reject application
                        </button>
                      </form>
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
