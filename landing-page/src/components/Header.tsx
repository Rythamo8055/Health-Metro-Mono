"use client";

import Image from "next/image";
import React from "react";
import { Phone } from "lucide-react";
import { useModal } from "@/context/ModalContext";

// Shared style constants
const ICON_WRAP =
  "p-1.5 sm:p-2 bg-white/0 rounded-full transition-all duration-300 " +
  "group-hover:bg-primary/5 group-focus-visible:bg-primary/5 " +
  "relative flex items-center justify-center";

const LABEL_CLS =
  "text-[8px] sm:text-[10px] font-bold text-primary/70 group-hover:text-secondary " +
  "group-focus-visible:text-secondary transition-all duration-300 leading-none mt-1 select-none origin-center";

const BTN_CLS =
  "group flex flex-col items-center gap-0 rounded-2xl flex-shrink-0 min-w-[34px] sm:min-w-[48px] " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-white " +
  "transition-all duration-200 active:scale-95 select-none";

const ICON_SIZE = 48; // Set higher to ensure crispness when scaled up

interface DockItemProps {
  onClick: () => void;
  label: string;
  shortLabel: string;
  iconSrc: string;
}

function DockItem({ onClick, label, shortLabel, iconSrc }: DockItemProps) {
  // Resolve fill/hover icon path: hm-move.png -> hm-move-fill.png
  const fillIconSrc = iconSrc.replace(".png", "-fill.png");

  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      className={BTN_CLS}
    >
      <div className={`${ICON_WRAP} w-11 h-11 sm:w-13 sm:h-13 overflow-hidden rounded-full`}>
        {/* Sleek backing glow */}
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-secondary/10 rounded-full opacity-0 group-hover:opacity-100 blur-md scale-75 group-hover:scale-105 transition-all duration-300" />
        
        {/* Normal Icon (cropped to show only the circular flask/syringe/etc.) */}
        <Image 
          src={iconSrc} 
          alt={shortLabel} 
          width={ICON_SIZE} 
          height={ICON_SIZE} 
          unoptimized
          className="w-9 h-9 sm:w-11 sm:h-11 object-cover object-left transition-all duration-300 group-hover:scale-110 group-hover:opacity-0 absolute z-10"
        />
        
        {/* Hover Highlight Icon (cropped to show only the circular flask/syringe/etc.) */}
        <Image 
          src={fillIconSrc} 
          alt={`${shortLabel} Hover`} 
          width={ICON_SIZE} 
          height={ICON_SIZE} 
          unoptimized
          className="w-9 h-9 sm:w-11 sm:h-11 object-cover object-left transition-all duration-300 group-hover:scale-110 opacity-0 group-hover:opacity-100 absolute z-20"
        />
      </div>
      
      {/* Label */}
      <span className={`${LABEL_CLS} group-hover:translate-y-[-2px]`} aria-hidden="true">
        {shortLabel}
      </span>
      
      {/* Active / Hover Mac-style dot */}
      <div className="w-1 h-1 rounded-full bg-secondary/0 group-hover:bg-secondary/80 scale-50 group-hover:scale-150 transition-all duration-300 mt-0.5" />
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
          className="flex items-end gap-1.5 sm:gap-2.5 px-3 sm:px-5 py-2 sm:py-2.5 bg-white/70 backdrop-blur-3xl rounded-[2.2rem] md:rounded-[2.7rem] border border-white/30 shadow-[0_24px_50px_rgba(2,116,115,0.14),0_6px_20px_rgba(2,116,115,0.06)] ring-1 ring-white/20 w-[calc(100vw-1rem)] md:w-auto justify-between md:justify-start transition-all duration-300"
        >
          {/* HM MOVE */}
          <DockItem
            onClick={() => openModal("product", "hm-move")}
            label="HM MOVE – Diagnostics & Health Packages"
            shortLabel="MOVE"
            iconSrc="/icons/hm-move.png"
          />

          {/* HM EASY */}
          <DockItem
            onClick={() => openModal("product", "hm-easy")}
            label="HM EASY – Home Sample Collection"
            shortLabel="EASY"
            iconSrc="/icons/hm-easy.png"
          />

          {/* HM TRUST */}
          <DockItem
            onClick={() => openModal("product", "hm-trust")}
            label="HM TRUST – Doctor Consultation"
            shortLabel="TRUST"
            iconSrc="/icons/hm-trust.png"
          />

          {/* Divider */}
          <div
            className="w-px h-8 sm:h-10 self-center mx-1 bg-primary/10 rounded-full flex-shrink-0"
            aria-hidden="true"
          />

          {/* CTA — Book Now */}
          <button
            onClick={() => openModal("contact")}
            aria-label="Book an appointment — opens contact form"
            title="Book an Appointment"
            className={BTN_CLS}
          >
            <div className="p-2.5 sm:p-3 bg-secondary text-white rounded-2xl shadow-[0_4px_12px_rgba(217,114,52,0.25)] transition-all duration-300 group-hover:shadow-[0_8px_20px_rgba(217,114,52,0.45)] group-hover:bg-secondary/90 flex items-center justify-center w-11 h-11 sm:w-13 sm:h-13 relative overflow-hidden">
              <div className="absolute inset-0 rounded-2xl border border-secondary opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300" />
              <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-white transition-transform duration-300 group-hover:rotate-12" strokeWidth={2.5} aria-hidden="true" />
            </div>
            <span
              className={`${LABEL_CLS} text-secondary group-hover:text-secondary group-hover:translate-y-[-2px] font-extrabold`}
              aria-hidden="true"
            >
              BOOK
            </span>
            <div className="w-1 h-1 rounded-full bg-secondary/0 group-hover:bg-secondary/80 scale-50 group-hover:scale-150 transition-all duration-300 mt-0.5" />
          </button>

          {/* Divider */}
          <div
            className="w-px h-8 sm:h-10 self-center mx-1 bg-primary/10 rounded-full flex-shrink-0"
            aria-hidden="true"
          />

          {/* HM RELY */}
          <DockItem
            onClick={() => openModal("product", "hm-rely")}
            label="HM RELY – NRI Care & Remote Health Management"
            shortLabel="RELY"
            iconSrc="/icons/hm-rely.png"
          />
        </nav>
      </div>
    </header>
  );
}

