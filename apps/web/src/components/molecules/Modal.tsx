"use client";

import type { ReactNode, ReactElement, MouseEvent as ReactMouseEvent } from "react";
import { useRef, useEffect } from "react";
import { clsx } from "clsx";

import { Button } from "@/components/atoms";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
}

const BACKDROP_CLASSES = "fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in";
const MODAL_CLASSES = "bg-white rounded-xl shadow-2xl w-full max-h-screen overflow-y-auto dark:bg-gray-900 dark:shadow-black/40";
const HEADER_CLASSES = "flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800";
const TITLE_CLASSES = "text-lg font-semibold text-gray-900 dark:text-gray-100";
const BODY_CLASSES = "h-full p-6";
const ESCAPE_KEY = "Escape" as const;
const CLOSE_ARIA_LABEL = "Close modal" as const;
const CLOSE_ICON_CLASS = "ti ti-x" as const;

function Modal({ isOpen, onClose, title, children, className }: ModalProps): ReactElement | null {
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
    <div className={BACKDROP_CLASSES} onClick={onClose}>
      <div
        ref={modalRef}
        tabIndex={-1}
        onClick={handleContentClick}
        className={clsx(MODAL_CLASSES, className)}
      >
        {title !== undefined && (
          <div className={HEADER_CLASSES}>
            <h2 className={TITLE_CLASSES}>{title}</h2>
            <Button variant="ghost" size="sm" onClick={onClose} ariaLabel={CLOSE_ARIA_LABEL}>
              <i className={CLOSE_ICON_CLASS} />
            </Button>
          </div>
        )}
        <div className={BODY_CLASSES}>{children}</div>
      </div>
    </div>
  );
}

export default Modal;
