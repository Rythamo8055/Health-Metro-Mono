"use client";

import { ModalProvider } from "@/context/ModalContext";
import ModalRoot from "@/components/modals/ModalRoot";
import { ReactNode } from "react";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ModalProvider>
      {children}
      <ModalRoot />
    </ModalProvider>
  );
}
