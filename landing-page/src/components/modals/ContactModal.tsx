"use client";

import { useState } from "react";
import { useModal } from "@/context/ModalContext";

export default function ContactModal() {
  const { closeModal } = useModal();
  const [form, setForm] = useState({ name: "", phone: "", service: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="p-6 md:p-8 flex flex-col flex-1 min-h-0 overflow-y-auto custom-scrollbar">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-primary mb-2">Book Appointment</h2>
        <p className="text-foreground opacity-60 text-sm md:text-base">We&apos;ll confirm within hours.</p>
      </div>

      {submitted ? (
        <div className="text-center py-10">
          <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-primary mb-2">We&apos;ll be in touch!</h3>
          <p className="text-foreground opacity-70 mb-8">
            Thank you for reaching out. Our team will contact you shortly to confirm your appointment.
          </p>
          <button 
            onClick={closeModal}
            className="w-full py-4 bg-primary text-white rounded-2xl font-bold hover:scale-[1.02] transition-all"
          >
            Done
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="modal-name" className="block text-sm font-bold text-foreground mb-1.5">Full Name *</label>
            <input
              id="modal-name"
              type="text"
              required
              placeholder="e.g. Rajesh Kumar"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              className="w-full px-4 py-3.5 rounded-xl border border-primary/15 bg-surface text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition"
            />
          </div>

          <div>
            <label htmlFor="modal-phone" className="block text-sm font-bold text-foreground mb-1.5">Mobile Number *</label>
            <input
              id="modal-phone"
              type="tel"
              required
              placeholder="+91 XXXXX XXXXX"
              value={form.phone}
              onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
              className="w-full px-4 py-3.5 rounded-xl border border-primary/15 bg-surface text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition"
            />
          </div>

          <div>
            <label htmlFor="modal-service" className="block text-sm font-bold text-foreground mb-1.5">Service Needed</label>
            <select
              id="modal-service"
              value={form.service}
              onChange={e => setForm(f => ({ ...f, service: e.target.value }))}
              className="w-full px-4 py-3.5 rounded-xl border border-primary/15 bg-surface text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition"
            >
              <option value="">Select a service…</option>
              <option value="home-collection">Home Sample Collection</option>
              <option value="diagnostic-test">Diagnostic / Pathology Test</option>
              <option value="doctor-consultation">Doctor Consultation</option>
              <option value="health-records">Health Records</option>
              <option value="nri-care">NRI Care – HM Rely</option>
              <option value="other">Other / Not sure</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-secondary text-white rounded-xl font-bold text-base hover:scale-[1.02] active:scale-95 transition-all shadow-md shadow-secondary/20 mt-4"
          >
            Submit Request →
          </button>
          
          <p className="text-center text-[11px] text-foreground opacity-40">
            We respect your privacy. Your details are secured.
          </p>
        </form>
      )}
    </div>
  );
}
