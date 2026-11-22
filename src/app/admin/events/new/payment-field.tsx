"use client";

import { useState } from "react";

export default function PaymentFields() {
  const [paymentType, setPaymentType] = useState("free");

  const inputClass =
    "w-full rounded-lg border border-[#E2E4DC] bg-white px-4 py-3 text-sm outline-none focus:border-[#4F6F4A]";

  return (
    <div className="space-y-5">
      <div>
        <label className="mb-2 block text-sm font-medium text-[#35483D]">
          Payment Type *
        </label>

        <select
          name="payment_type"
          value={paymentType}
          onChange={(event) => setPaymentType(event.target.value)}
          required
          className={inputClass}
        >
          <option value="free">Free Event</option>
          <option value="paid">Paid Event</option>
          <option value="optional_contribution">
            Optional Contribution
          </option>
        </select>

        <p className="mt-2 text-xs text-[#758078]">
          Choose whether attendees pay a fixed ticket price or can contribute
          voluntarily.
        </p>
      </div>

      {paymentType === "paid" && (
        <div>
          <label className="mb-2 block text-sm font-medium text-[#35483D]">
            Ticket Price (₦) *
          </label>

          <input
            type="number"
            name="ticket_price_naira"
            min="1"
            step="0.01"
            required
            placeholder="e.g. 5000"
            className={inputClass}
          />
        </div>
      )}

      {paymentType === "optional_contribution" && (
        <div>
          <label className="mb-2 block text-sm font-medium text-[#35483D]">
            Minimum Contribution (₦)
          </label>

          <input
            type="number"
            name="contribution_minimum_naira"
            min="0.01"
            step="0.01"
            placeholder="e.g. 1000"
            className={inputClass}
          />

          <p className="mt-2 text-xs text-[#758078]">
            Leave blank if attendees can contribute any amount.
          </p>
        </div>
      )}
    </div>
  );
}