
"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { signUpAction, type SignupState } from "./actions";

const initialState: SignupState = {
  status: "idle",
  message: "",
};

export default function SignupForm({
  fullName,
  email,
}: {
  fullName: string;
  email: string;
}) {
  const [state, formAction, pending] = useActionState(
    signUpAction,
    initialState
  );

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  if (state.status === "success") {
    return (
      <div
        role="status"
        className="rounded-xl border border-[#DCE6D7] bg-[#F3F7F0] p-6"
      >
        <h3 className="font-semibold text-[#1D382A]">
          Check your email
        </h3>
        <p className="mt-3 text-sm leading-6 text-[#4F6F4A]">
          {state.message}
        </p>
        <p className="mt-5 text-sm text-gray-600">
          Already confirmed your email?{" "}
          <Link
            href="/login"
            className="font-semibold text-[#4F6F4A] hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label
          htmlFor="fullName"
          className="mb-2 block text-sm font-medium text-[#25352d]"
        >
          Full name
        </label>
        <input
          id="fullName"
          name="fullName"
          type="text"
          defaultValue={fullName}
          required
          maxLength={120}
          autoComplete="name"
          className="w-full rounded-xl border border-gray-200 bg-[#faf8f3] px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-[#4F6F4A] focus:ring-2 focus:ring-[#4F6F4A]/20"
        />
      </div>

      <div>
        <label
          htmlFor="email"
          className="mb-2 block text-sm font-medium text-[#25352d]"
        >
          Application email address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={email}
          readOnly
          required
          autoComplete="email"
          className="w-full rounded-xl border border-gray-200 bg-gray-100 px-4 py-3 text-sm text-gray-600 outline-none"
        />
        <p className="mt-2 text-xs text-gray-500">
          Use the email address you entered in your membership application.
        </p>
      </div>

      <div>
        <label
          htmlFor="password"
          className="mb-2 block text-sm font-medium text-[#25352d]"
        >
          Create password
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="At least 8 characters"
            required
            minLength={8}
            autoComplete="new-password"
            className="w-full rounded-xl border border-gray-200 bg-[#faf8f3] px-4 py-3 pr-20 text-sm text-gray-800 outline-none transition focus:border-[#4F6F4A] focus:ring-2 focus:ring-[#4F6F4A]/20"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#4F6F4A] hover:underline"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
      </div>

      <div>
        <label
          htmlFor="confirmPassword"
          className="mb-2 block text-sm font-medium text-[#25352d]"
        >
          Confirm password
        </label>
        <div className="relative">
          <input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Enter your password again"
            required
            minLength={8}
            autoComplete="new-password"
            className="w-full rounded-xl border border-gray-200 bg-[#faf8f3] px-4 py-3 pr-20 text-sm text-gray-800 outline-none transition focus:border-[#4F6F4A] focus:ring-2 focus:ring-[#4F6F4A]/20"
          />
          <button
            type="button"
            onClick={() =>
              setShowConfirmPassword(!showConfirmPassword)
            }
            className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#4F6F4A] hover:underline"
          >
            {showConfirmPassword ? "Hide" : "Show"}
          </button>
        </div>
      </div>

      {state.status === "error" && (
        <p
          role="alert"
          className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600"
        >
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-xl bg-[#25352d] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#4F6F4A] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Creating account..." : "Create account"}
      </button>

      <p className="text-center text-sm text-gray-500">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-[#4F6F4A] hover:underline"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}
