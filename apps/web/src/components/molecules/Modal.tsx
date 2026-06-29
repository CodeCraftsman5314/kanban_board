"use client";

import type { ReactNode, ReactElement, MouseEvent as ReactMouseEvent } from "react";
import { useRef, useEffect } from "react";
import { clsx } from "clsx";

import { Button } from "@/components/atoms";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  ariaLabel?: string;
  children: ReactNode;
  className?: string;
}

const BACKDROP_CLASSES = "fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in";
const MODAL_CLASSES = "bg-white rounded-xl shadow-2xl w-full max-h-screen overflow-y-auto dark:bg-gray-900 dark:shadow-black/40";
const HEADER_CLASSES = "flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800";
const TITLE_CLASSES = "text-lg font-semibold text-gray-900 dark:text-gray-100";
const BODY_CLASSES = "h-full p-6";
const ESCAPE_KEY = "Escape" as const;
const TAB_KEY = "Tab" as const;
const CLOSE_ARIA_LABEL = "Close modal" as const;
const CLOSE_ICON_CLASS = "ti ti-x" as const;
const DEFAULT_DIALOG_LABEL = "Dialog" as const;
const MODAL_TITLE_ID = "modal-title" as const;
const FOCUSABLE_SELECTOR =
  "a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex='-1'])" as const;

function Modal({
  isOpen,
  onClose,
  title,
  ariaLabel = DEFAULT_DIALOG_LABEL,
  children,
  className,
}: ModalProps): ReactElement | null {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<Element | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    previousActiveElement.current = document.activeElement;

    const handleKeyDown = (e: KeyboardEvent): void => {
      if (e.key === ESCAPE_KEY) {
        onClose();
        return;
      }

      if (e.key !== TAB_KEY || !modalRef.current) return;

      const focusableElements = Array.from(
        modalRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
      );
      const firstFocusable = focusableElements[0];
      const lastFocusable = focusableElements[focusableElements.length - 1];

      if (!firstFocusable || !lastFocusable) {
        e.preventDefault();
        modalRef.current.focus();
        return;
      }

      if (e.shiftKey && document.activeElement === firstFocusable) {
        e.preventDefault();
        lastFocusable.focus();
      } else if (!e.shiftKey && document.activeElement === lastFocusable) {
        e.preventDefault();
        firstFocusable.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      if (previousActiveElement.current instanceof HTMLElement) {
        previousActiveElement.current.focus();
      }
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
        role="dialog"
        aria-modal="true"
        aria-labelledby={title !== undefined ? MODAL_TITLE_ID : undefined}
        aria-label={title === undefined ? ariaLabel : undefined}
        tabIndex={-1}
        onClick={handleContentClick}
        className={clsx(MODAL_CLASSES, className)}
      >
        {title !== undefined && (
          <div className={HEADER_CLASSES}>
            <h2 id={MODAL_TITLE_ID} className={TITLE_CLASSES}>{title}</h2>
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
