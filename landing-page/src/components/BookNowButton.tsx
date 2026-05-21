"use client";

import { useModal } from "@/context/ModalContext";
import { ButtonHTMLAttributes, ReactNode } from "react";

interface BookNowButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  productId?: string;
}

export default function BookNowButton({ children, className, productId, ...props }: BookNowButtonProps) {
  const { openModal } = useModal();
  
  return (
    <button
      {...props}
      onClick={(e) => {
        openModal("contact", productId);
        props.onClick?.(e);
      }}
      className={className}
    >
      {children || "Book Appointment"}
    </button>
  );
}
