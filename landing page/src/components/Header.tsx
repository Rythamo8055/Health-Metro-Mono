"use client";

import {
  Activity,
  Home,
  Stethoscope,
  HeartHandshake,
  ClipboardList,
  Microscope,
  Phone,
} from "lucide-react";
import { useModal } from "@/context/ModalContext";

// Shared style constants
const ICON_WRAP =
  "p-1.5 sm:p-3 bg-primary/5 text-primary rounded-xl transition-all duration-200 " +
  "active:scale-95 group-hover:bg-primary group-hover:text-white group-hover:shadow-[0_8px_20px_rgba(2,116,115,0.35)] " +
  "group-focus-visible:bg-primary group-focus-visible:text-white group-focus-visible:shadow-[0_8px_20px_rgba(2,116,115,0.35)]";

const LABEL_CLS =
  "text-[8px] sm:text-[10px] font-semibold text-primary/70 group-hover:text-primary " +
  "group-focus-visible:text-primary transition-colors leading-none mt-1 select-none";

const BTN_CLS =
  "group flex flex-col items-center gap-0 rounded-xl flex-shrink-0 min-w-[34px] sm:min-w-[48px] " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-white";

const ICON_SIZE = "w-4 h-4 sm:w-[22px] sm:h-[22px]";

interface DockItemProps {
  onClick: () => void;
  label: string;
  shortLabel: string;
  icon: React.ReactNode;
}

function DockItem({ onClick, label, shortLabel, icon }: DockItemProps) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      className={BTN_CLS}
    >
      <div className={ICON_WRAP}>{icon}</div>
      <span className={LABEL_CLS} aria-hidden="true">
        {shortLabel}
      </span>
    </button>
  );
}

export default function Header() {
  const { openModal } = useModal();

  return (
    <header
      className="fixed bottom-5 md:bottom-8 left-1/2 -translate-x-1/2 z-50 w-auto pointer-events-none"
      aria-label="Quick navigation dock"
    >
      <div className="pointer-events-auto">
        <nav
          aria-label="Services and booking"
          className="flex items-end gap-0.5 sm:gap-2 md:gap-3 px-1.5 sm:px-4 md:px-5 pt-2 pb-2 sm:pt-2.5 sm:pb-2.5 bg-white/90 backdrop-blur-3xl rounded-[2rem] md:rounded-[2.5rem] border border-primary/15 shadow-[0_16px_48px_rgba(2,116,115,0.15)] ring-1 ring-white/60 w-[calc(100vw-1rem)] md:w-auto justify-between md:justify-start"
        >
          {/* HM MOVE */}
          <DockItem
            onClick={() => openModal("product", "hm-move")}
            label="HM MOVE – Diagnostics & Health Packages"
            shortLabel="MOVE"
            icon={<Activity className={ICON_SIZE} strokeWidth={2} aria-hidden="true" />}
          />

          {/* HM EASY */}
          <DockItem
            onClick={() => openModal("product", "hm-easy")}
            label="HM EASY – Home Sample Collection"
            shortLabel="EASY"
            icon={<Home className={ICON_SIZE} strokeWidth={2} aria-hidden="true" />}
          />

          {/* HM TRUST */}
          <DockItem
            onClick={() => openModal("product", "hm-trust")}
            label="HM TRUST – Doctor Consultation"
            shortLabel="TRUST"
            icon={<Stethoscope className={ICON_SIZE} strokeWidth={2} aria-hidden="true" />}
          />

          {/* Divider */}
          <div
            className="w-px self-stretch mx-0.5 bg-primary/10 rounded-full flex-shrink-0"
            aria-hidden="true"
          />

          {/* CTA — Book Now (centre, prominent) */}
          <button
            onClick={() => openModal("contact")}
            aria-label="Book an appointment — opens contact form"
            title="Book an Appointment"
            className="group flex flex-col items-center gap-0 rounded-xl flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          >
            <div className="p-2 sm:p-3 bg-secondary text-white rounded-xl shadow-md transition-all duration-200 active:scale-95 group-hover:shadow-[0_8px_20px_rgba(217,114,52,0.45)] group-focus-visible:shadow-[0_8px_20px_rgba(217,114,52,0.45)]">
              <Phone className={ICON_SIZE} strokeWidth={2.5} aria-hidden="true" />
            </div>
            <span
              className="text-[8px] sm:text-[10px] font-bold text-secondary leading-none mt-1 select-none"
              aria-hidden="true"
            >
              BOOK
            </span>
          </button>

          {/* Divider */}
          <div
            className="w-px self-stretch mx-0.5 bg-primary/10 rounded-full flex-shrink-0"
            aria-hidden="true"
          />

          {/* HM RELY */}
          <DockItem
            onClick={() => openModal("product", "hm-rely")}
            label="HM RELY – NRI Care & Remote Health Management"
            shortLabel="RELY"
            icon={<HeartHandshake className={ICON_SIZE} strokeWidth={2} aria-hidden="true" />}
          />

          {/* HM OHR */}
          <DockItem
            onClick={() => openModal("product", "hm-ohr")}
            label="HM OHR – Digital Health Records"
            shortLabel="OHR"
            icon={<ClipboardList className={ICON_SIZE} strokeWidth={2} aria-hidden="true" />}
          />

          {/* HM CLIN */}
          <DockItem
            onClick={() => openModal("product", "hm-clin")}
            label="HM CLIN – Clinical Research & Wellness"
            shortLabel="CLIN"
            icon={<Microscope className={ICON_SIZE} strokeWidth={2} aria-hidden="true" />}
          />
        </nav>
      </div>
    </header>
  );
}
