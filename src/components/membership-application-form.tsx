
"use client";

import { useActionState } from "react";
import {
  submitMembershipApplication,
  type ApplicationState,
} from "@/app/get-involved/actions";

const initialState: ApplicationState = {
  status: "idle",
  message: "",
};

export default function MembershipApplicationForm() {
  const [state, formAction, isPending] = useActionState(
    submitMembershipApplication,
    initialState
  );

  return (
    <form className="interest-form" action={formAction}>
      <div className="form-row">
        <label>
          Your name
          <input
            type="text"
            name="name"
            placeholder="Full name"
            autoComplete="name"
            maxLength={120}
            required
          />
        </label>

        <label>
          Email address
          <input
            type="email"
            name="email"
            placeholder="you@example.com"
            autoComplete="email"
            maxLength={254}
            required
          />
        </label>
      </div>

      <label>
        Phone number
        <input
          type="tel"
          name="phone"
          placeholder="Your phone number"
          autoComplete="tel"
          maxLength={30}
        />
      </label>

      <label>
        Why would you like to join the Growth Circle?
        <textarea
          name="motivation"
          placeholder="Tell us a little about yourself and what you hope to gain from the community."
          maxLength={1500}
          rows={5}
        />
      </label>

      {/* Spam protection field */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ position: "absolute", left: "-10000px" }}
      />

      <button className="button" type="submit" disabled={isPending}>
        {isPending ? "Submitting..." : "Submit application ↗"}
      </button>

      {state.message && (
        <p role="status" aria-live="polite">
          {state.message}
        </p>
      )}
    </form>
  );
}
