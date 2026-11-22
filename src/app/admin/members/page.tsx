
import { requireAdminPermission } from "@/lib/admin";
import AdminSidebar from "../admin-sidebar";
import { updateMemberStatus } from "./actions";
import { connection } from "next/server";

type MembersPageProps = {
  searchParams: Promise<{
    search?: string;
    status?: string;
  }>;
};

export default async function MembersPage({
  searchParams,
}: MembersPageProps) {
  await connection();
  const params = await searchParams;
  const search = (params.search || "").trim().toLowerCase();
  const statusFilter = params.status || "all";

  const supabase = await requireAdminPermission("members.manage");

  const { data: members, error } = await supabase
    .from("profiles")
    .select(
      "id, full_name, phone, location, bio, member_status, created_at"
    )
    .order("created_at", { ascending: false });

  const memberList = members ?? [];

  const totalMembers = memberList.length;
  const activeMembers = memberList.filter(
    (member) => member.member_status === "active"
  ).length;
  const pendingMembers = memberList.filter(
    (member) => member.member_status === "pending"
  ).length;
  const suspendedMembers = memberList.filter(
    (member) => member.member_status === "suspended"
  ).length;

  const filteredMembers = memberList.filter((member) => {
    const matchesSearch =
      !search ||
      (member.full_name || "").toLowerCase().includes(search) ||
      (member.phone || "").toLowerCase().includes(search) ||
      (member.location || "").toLowerCase().includes(search);

    const matchesStatus =
      statusFilter === "all" ||
      member.member_status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <main className="min-h-screen bg-[#F6F4EC] md:flex">
      <AdminSidebar />

      <div className="min-w-0 flex-1 px-5 py-8 md:px-10 md:py-10">
        <header className="mb-8">
          <p className="text-xs font-semibold tracking-[0.2em] text-[#4F6F4A]">
            THE GROWTH CIRCLE
          </p>

          <h1 className="mt-3 font-[var(--font-playfair)] text-3xl font-bold text-[#1D382A]">
            Members Management
          </h1>

          <p className="mt-2 text-sm text-[#758078]">
            View and manage your community members.
          </p>
        </header>

        {error ? (
          <div className="rounded-xl bg-red-50 p-5 text-sm text-red-700">
            We could not load members. Please check database permissions.
          </div>
        ) : (
          <>
            <section className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
              {[
                { label: "Total Members", value: totalMembers },
                { label: "Active Members", value: activeMembers },
                { label: "Pending Members", value: pendingMembers },
                { label: "Suspended Members", value: suspendedMembers },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl border border-[#E2E4DC] bg-white p-5"
                >
                  <p className="text-sm text-[#758078]">{item.label}</p>
                  <p className="mt-2 font-[var(--font-playfair)] text-3xl font-bold text-[#1D382A]">
                    {item.value}
                  </p>
                </div>
              ))}
            </section>

            <section className="rounded-xl border border-[#E2E4DC] bg-white p-5 md:p-7">
              <div className="mb-6">
                <h2 className="font-[var(--font-playfair)] text-xl font-bold text-[#1D382A]">
                  Community Members
                </h2>
                <p className="mt-1 text-sm text-[#758078]">
                  {filteredMembers.length} member(s) found
                </p>
              </div>

              <form
                method="GET"
                className="mb-6 flex flex-col gap-3 sm:flex-row"
              >
                <input
                  type="search"
                  name="search"
                  defaultValue={params.search || ""}
                  placeholder="Search name, phone or location..."
                  className="min-w-0 flex-1 rounded-lg border border-[#E2E4DC] px-4 py-3 text-sm outline-none focus:border-[#4F6F4A]"
                />

                <select
                  name="status"
                  defaultValue={statusFilter}
                  className="rounded-lg border border-[#E2E4DC] bg-white px-4 py-3 text-sm"
                >
                  <option value="all">All statuses</option>
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="suspended">Suspended</option>
                </select>

                <button
                  type="submit"
                  className="rounded-lg bg-[#1D382A] px-6 py-3 text-sm font-semibold text-white hover:bg-[#4F6F4A]"
                >
                  Filter
                </button>
              </form>

              {filteredMembers.length === 0 ? (
                <div className="rounded-lg bg-[#F6F4EC] p-8 text-center text-sm text-[#758078]">
                  No members match your search.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[850px] text-left text-sm">
                    <thead>
                      <tr className="border-b border-[#E2E4DC] text-xs uppercase tracking-wide text-[#758078]">
                        <th className="px-4 py-3">Member</th>
                        <th className="px-4 py-3">Phone</th>
                        <th className="px-4 py-3">Location</th>
                        <th className="px-4 py-3">Joined</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Manage</th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredMembers.map((member) => (
                        <tr
                          key={member.id}
                          className="border-b border-[#E2E4DC] last:border-0"
                        >
                          <td className="px-4 py-4">
                            <p className="font-medium text-[#1D382A]">
                              {member.full_name || "Unnamed member"}
                            </p>
                            {member.bio && (
                              <p className="mt-1 max-w-xs truncate text-xs text-[#758078]">
                                {member.bio}
                              </p>
                            )}
                          </td>

                          <td className="px-4 py-4 text-[#35483D]">
                            {member.phone || "—"}
                          </td>

                          <td className="px-4 py-4 text-[#35483D]">
                            {member.location || "—"}
                          </td>

                          <td className="px-4 py-4 text-[#35483D]">
                            {new Date(member.created_at).toLocaleDateString("en-NG")}
                          </td>

                          <td className="px-4 py-4">
                            <span className="rounded-full bg-[#F6F4EC] px-3 py-1 text-xs capitalize text-[#35483D]">
                              {member.member_status}
                            </span>
                          </td>

                          <td className="px-4 py-4">
                            <form
                              action={updateMemberStatus}
                              className="flex items-center gap-2"
                            >
                              <input
                                type="hidden"
                                name="userId"
                                value={member.id}
                              />

                              <select
                                name="status"
                                defaultValue={member.member_status}
                                className="rounded-lg border border-[#E2E4DC] bg-white px-2 py-2 text-xs"
                              >
                                <option value="active">Active</option>
                                <option value="pending">Pending</option>
                                <option value="suspended">Suspended</option>
                              </select>

                              <button
                                type="submit"
                                className="rounded-lg bg-[#1D382A] px-3 py-2 text-xs font-semibold text-white hover:bg-[#4F6F4A]"
                              >
                                Save
                              </button>
                            </form>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </main>
  );
}
