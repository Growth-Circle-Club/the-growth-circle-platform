
"use client";

import { useActionState, useState } from "react";
import { signInAction } from "./actions";

const initialState = {
  error: "",
};

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(
    signInAction,
    initialState
  );

  const [showPassword, setShowPassword] = useState(false);

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label
          htmlFor="email"
          className="mb-2 block text-sm font-medium text-[#25352d]"
        >
          Email address
        </label>

        <input
          id="email"
          name="email"
          type="email"
          placeholder="Enter your email address"
          required
          autoComplete="email"
          className="w-full rounded-xl border border-gray-200 bg-[#faf8f3] px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-[#4F6F4A] focus:ring-2 focus:ring-[#4F6F4A]/20"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="mb-2 block text-sm font-medium text-[#25352d]"
        >
          Password
        </label>

        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            required
            autoComplete="current-password"
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

      {state.error && (
        <p
          role="alert"
          className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600"
        >
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-xl bg-[#25352d] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#4F6F4A] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
