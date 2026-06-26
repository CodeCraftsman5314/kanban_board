"use client";

import type { ReactNode, ReactElement, MouseEvent as ReactMouseEvent } from "react";
import { useRef, useEffect } from "react";
import { clsx } from "clsx";

import { Button } from "@/components/atoms";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  className?: string;
}

const BACKDROP_CLASSES = clsx(
  "fixed inset-0 bg-black/50 z-50",
  "flex items-center justify-center p-4",
  "animate-fade-in"
);

const MODAL_CLASSES = clsx(
  "bg-white rounded-xl shadow-2xl",
  "w-full max-w-md max-h-screen overflow-y-auto"
);

const HEADER_CLASSES = clsx(
  "flex items-center justify-between p-6 border-b border-gray-100"
);

const TITLE_CLASSES = clsx("text-lg font-semibold text-gray-900");
const BODY_CLASSES = clsx("p-6");

const ESCAPE_KEY = "Escape" as const;
const CLOSE_ICON = "✕" as const;
const CLOSE_ARIA_LABEL = "Close modal" as const;

function Modal({
  isOpen,
  onClose,
  title,
  children,
  className,
}: ModalProps): ReactElement | null {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent): void => {
      if (e.key === ESCAPE_KEY) onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) modalRef.current?.focus();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleContentClick = (e: ReactMouseEvent<HTMLDivElement>): void => {
    e.stopPropagation();
  };

  return (
    <div className={clsx(BACKDROP_CLASSES)} onClick={onClose}>
      <div
        ref={modalRef}
        tabIndex={-1}
        onClick={handleContentClick}
        className={clsx(MODAL_CLASSES, className)}
      >
        <div className={clsx(HEADER_CLASSES)}>
          <h2 className={clsx(TITLE_CLASSES)}>{title}</h2>
          <Button variant="ghost" size="sm" onClick={onClose} ariaLabel={CLOSE_ARIA_LABEL}>
            {CLOSE_ICON}
          </Button>
        </div>
        <div className={clsx(BODY_CLASSES)}>{children}</div>
      </div>
    </div>
  );
}

export default Modal;
