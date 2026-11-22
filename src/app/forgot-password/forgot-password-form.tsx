
"use client";

import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setMessage("");
    setError("");
    setLoading(true);

    const supabase = createClient();

    const { error } = await supabase.auth.resetPasswordForEmail(
      email.trim(),
      {
        redirectTo: `${window.location.origin}/auth/confirm?next=/reset-password`,
      }
    );

    if (error) {
      setError("Unable to send the reset link. Please try again.");
    } else {
      setMessage(
        "If an account exists for this email, a password reset link will be sent."
      );
    }

    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <div className="auth-field">
        <label htmlFor="email" className="auth-label">
          Admin email address
        </label>

        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          autoComplete="email"
          required
          className="auth-input"
        />
      </div>

      {message && (
        <p className="auth-feedback auth-success" role="status">
          {message}
        </p>
      )}

      {error && (
        <p className="auth-feedback auth-error" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="auth-submit"
      >
        {loading ? "Sending..." : "Send Reset Link"}
      </button>

      <div className="auth-link-row" style={{ justifyContent: "center", marginTop: 0 }}>
        <Link href="/login" className="auth-link">
          Back to Login
        </Link>
      </div>
    </form>
  );
}
