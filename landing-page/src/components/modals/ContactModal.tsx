"use client";

import { useState } from "react";
import { useModal } from "@/context/ModalContext";
import { supabase } from "@/lib/supabase";

interface CountryConfig {
  code: string;
  name: string;
  dialCode: string;
  flag: string;
  length: number;
  placeholder: string;
}

const COUNTRIES: CountryConfig[] = [
  { code: "IN", name: "India", dialCode: "+91", flag: "🇮🇳", length: 10, placeholder: "98765 43210" },
  { code: "US", name: "United States", dialCode: "+1", flag: "🇺🇸", length: 10, placeholder: "(555) 000-0000" },
  { code: "GB", name: "United Kingdom", dialCode: "+44", flag: "🇬🇧", length: 10, placeholder: "7911 123456" },
  { code: "AE", name: "United Arab Emirates", dialCode: "+971", length: 9, placeholder: "50 123 4567" },
  { code: "CA", name: "Canada", dialCode: "+1", flag: "🇨🇦", length: 10, placeholder: "(555) 000-0000" },
  { code: "AU", name: "Australia", dialCode: "+61", length: 9, placeholder: "412 345 678" }
];

const formatPhoneNumber = (value: string, countryCode: string) => {
  const numbers = value.replace(/\D/g, "");
  
  if (countryCode === "IN") {
    if (numbers.length <= 5) return numbers;
    return `${numbers.slice(0, 5)} ${numbers.slice(5, 10)}`;
  } else if (countryCode === "US" || countryCode === "CA") {
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`;
    return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;
  } else if (countryCode === "GB") {
    if (numbers.length <= 4) return numbers;
    return `${numbers.slice(0, 4)} ${numbers.slice(4, 10)}`;
  } else if (countryCode === "AE") {
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 5) return `${numbers.slice(0, 2)} ${numbers.slice(2)}`;
    return `${numbers.slice(0, 2)} ${numbers.slice(2, 5)} ${numbers.slice(5, 9)}`;
  } else if (countryCode === "AU") {
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return `${numbers.slice(0, 3)} ${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)} ${numbers.slice(3, 6)} ${numbers.slice(6, 9)}`;
  }
  return numbers;
};

const isValidPhone = (value: string, country: CountryConfig) => {
  const digits = value.replace(/\D/g, "");
  return digits.length === country.length;
};

export default function ContactModal() {
  const { closeModal } = useModal();
  const [form, setForm] = useState({ name: "", service: "" });
  const [phone, setPhone] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<CountryConfig>(COUNTRIES[0]);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!isValidPhone(phone, selectedCountry)) {
      setError(`Please enter a valid ${selectedCountry.length}-digit phone number.`);
      setLoading(false);
      return;
    }

    const fullPhoneNumber = `${selectedCountry.dialCode} ${phone.replace(/[^\d]/g, "")}`;

    try {
      const { error: submitError } = await supabase
        .from("appointment_requests")
        .insert([
          {
            full_name: form.name,
            mobile: fullPhoneNumber,
            service_needed: form.service || "other",
          }
        ]);

      if (submitError) throw submitError;
      setSubmitted(true);
    } catch (err: any) {
      console.error("Error submitting appointment request:", err);
      setError("Failed to submit. Please check your network or try again.");
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = form.name.trim() !== "" && isValidPhone(phone, selectedCountry);

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
              className="w-full h-[52px] px-4 rounded-xl border border-primary/15 bg-surface text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition font-semibold"
            />
          </div>

          <div>
            <label htmlFor="modal-phone" className="block text-sm font-bold text-foreground mb-1.5">Mobile Number *</label>
            <div className="relative flex items-center h-[52px] rounded-xl border border-primary/15 bg-surface focus-within:ring-2 focus-within:ring-primary/30 transition overflow-hidden">
              {/* Country dropdown container */}
              <div className="relative h-full flex items-center px-3 border-r border-primary/10 bg-slate-50/50 cursor-pointer hover:bg-slate-50 transition">
                <select
                  value={selectedCountry.code}
                  onChange={(e) => {
                    const country = COUNTRIES.find(c => c.code === e.target.value)!;
                    setSelectedCountry(country);
                    setPhone("");
                    setError(null);
                  }}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                >
                  {COUNTRIES.map(c => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.name} ({c.dialCode})
                    </option>
                  ))}
                </select>
                <div className="flex items-center gap-1.5 select-none pointer-events-none">
                  <span className="text-base leading-none">{selectedCountry.flag}</span>
                  <span className="text-sm font-extrabold text-foreground opacity-80">{selectedCountry.dialCode}</span>
                  <svg className="w-3 h-3 text-foreground opacity-40 ml-0.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </div>
              </div>

              {/* Number Input */}
              <input
                id="modal-phone"
                type="tel"
                required
                placeholder={selectedCountry.placeholder}
                value={phone}
                onChange={e => {
                  const formatted = formatPhoneNumber(e.target.value, selectedCountry.code);
                  setPhone(formatted);
                  setError(null);
                }}
                className="w-full h-full px-4 bg-transparent text-foreground text-sm focus:outline-none placeholder:text-slate-300 font-semibold"
              />

              {/* Visual validation tick/cross indicator */}
              {phone && (
                <div className="pr-4 shrink-0 flex items-center">
                  {isValidPhone(phone, selectedCountry) ? (
                    <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center animate-scale-in" title="Valid Phone Number">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </span>
                  ) : (
                    <span className="w-5 h-5 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center animate-scale-in" title="Invalid length">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </span>
                  )}
                </div>
              )}
            </div>
            {phone && !isValidPhone(phone, selectedCountry) && (
              <p className="text-[10px] text-amber-600 font-semibold mt-1">
                Must be exactly {selectedCountry.length} digits long.
              </p>
            )}
          </div>

          <div>
            <label htmlFor="modal-service" className="block text-sm font-bold text-foreground mb-1.5">Service Needed</label>
            <select
              id="modal-service"
              value={form.service}
              onChange={e => setForm(f => ({ ...f, service: e.target.value }))}
              className="w-full h-[52px] px-4 rounded-xl border border-primary/15 bg-surface text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition bg-white font-semibold cursor-pointer"
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

          {error && (
            <p className="text-red-500 text-xs font-bold text-center mt-1">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || !isFormValid}
            className="w-full h-[56px] bg-secondary text-white rounded-xl font-bold text-base hover:scale-[1.02] active:scale-95 transition-all shadow-md shadow-secondary/20 mt-4 disabled:opacity-40 disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Submitting...
              </span>
            ) : (
              "Submit Request →"
            )}
          </button>
          
          <p className="text-center text-[11px] text-foreground opacity-40 mt-3">
            We respect your privacy. Your details are secured.
          </p>
        </form>
      )}
    </div>
  );
}
