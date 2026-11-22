
import Link from "next/link";
import SignupForm from "./signup-form";

export const instant = false;
export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{
    name?: string;
    email?: string;
  }>;
}) {
  const params = await searchParams;
  const fullName = params.name ?? "";
  const email = (params.email ?? "").trim().toLowerCase();

  return (
    <main className="min-h-screen bg-[#faf8f3] px-5 py-8 md:px-10 md:py-12">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-6xl overflow-hidden rounded-3xl bg-white shadow-xl md:grid-cols-2">
        <section className="relative flex flex-col justify-between overflow-hidden bg-[#25352d] p-8 text-white md:p-12">
          <p className="relative z-10 text-sm font-semibold tracking-[0.25em] text-[#d7b98b]">
            THE GROWTH CIRCLE
          </p>

          <div className="relative z-10 my-12">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.3em] text-[#d7b98b]">
              Read. Connect. Grow.
            </p>

            <h1 className="font-[var(--font-playfair)] text-4xl leading-tight md:text-5xl">
              Your growth journey starts here.
            </h1>

            <p className="mt-6 max-w-md text-sm leading-7 text-white/75">
              Create your account and take the next step towards joining
              a community that grows together, one book at a time.
            </p>
          </div>

          <p className="relative z-10 text-xs text-white/50">
            READ → THINK → DISCUSS → APPLY → GROW
          </p>
        </section>

        <section className="flex items-center justify-center px-7 py-12 md:px-14">
          <div className="w-full max-w-md">
            <div className="mb-10">
              <Link
                href="/"
                className="text-sm font-medium text-[#4F6F4A] hover:underline"
              >
                ← Back to website
              </Link>

              <p className="mb-3 mt-8 text-sm font-semibold tracking-widest text-[#9b7545]">
                JOIN GROWTH CIRCLE
              </p>

              <h2 className="font-[var(--font-playfair)] text-3xl font-bold text-[#25352d] md:text-4xl">
                Create your account
              </h2>

              <p className="mt-3 text-sm leading-6 text-gray-500">
                Set up your account using the email address from your
                membership application. Your application will still need
                to be reviewed by our team.
              </p>
            </div>

            {!email ? (
              <div className="rounded-xl bg-[#F6F4EC] p-5">
                <p className="text-sm leading-6 text-[#25352d]">
                  Please submit the Get Involved form first so we can
                  connect your account to your application.
                </p>
                <Link
                  href="/get-involved"
                  className="mt-4 inline-block text-sm font-semibold text-[#4F6F4A] hover:underline"
                >
                  Go to Get Involved
                </Link>
              </div>
            ) : (
              <SignupForm fullName={fullName} email={email} />
            )}

            <p className="mt-10 text-center text-xs text-gray-400">
              The Growth Circle · Read. Connect. Grow.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
