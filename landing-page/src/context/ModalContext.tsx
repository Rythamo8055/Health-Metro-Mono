"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

type ModalType = "none" | "contact" | "product";

interface ModalContextType {
  isOpen: boolean;
  type: ModalType;
  data: any;
  openModal: (type: ModalType, data?: any) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState<ModalType>("none");
  const [data, setData] = useState<any>(null);

  const openModal = (newType: ModalType, newData?: any) => {
    setType(newType);
    setData(newData || null);
    setIsOpen(true);
    // Prevent body scroll when modal is open
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setIsOpen(false);
    setTimeout(() => {
      setType("none");
      setData(null);
    }, 300); // clear data after animation
    // Restore body scroll
    document.body.style.overflow = "unset";
  };

  return (
    <ModalContext.Provider value={{ isOpen, type, data, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
}
