'use client';

import { useEffect, useId, useRef, type ComponentType, type ReactNode } from 'react';
import { XIcon } from 'lucide-react';
import { cn } from '@/shared/utils/cn';

interface ConfirmModalProps {
  open: boolean;
  icon: ComponentType<{ className?: string }>;
  eyebrow?: string;
  title: string;
  description: ReactNode;
  children?: ReactNode;
  cancelLabel?: string;
  confirmLabel: string;
  confirming?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

const FOCUSABLE =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function ConfirmModal({
  open,
  icon: Icon,
  eyebrow,
  title,
  description,
  children,
  cancelLabel = 'Cancelar',
  confirmLabel,
  confirming = false,
  onCancel,
  onConfirm,
}: ConfirmModalProps) {
  const titleId = useId();
  const descId = useId();
  const cancelRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const onCancelRef = useRef(onCancel);

  useEffect(() => {
    onCancelRef.current = onCancel;
  }, [onCancel]);

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    cancelRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancelRef.current();
        return;
      }
      if (e.key !== 'Tab' || !dialogRef.current) return;
      const nodes = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (nodes.length === 0) return;
      const index = nodes.indexOf(document.activeElement as HTMLElement);
      const last = nodes.length - 1;
      if (e.shiftKey && index <= 0) {
        e.preventDefault();
        nodes[last].focus();
      } else if (!e.shiftKey && (index === -1 || index === last)) {
        e.preventDefault();
        nodes[0].focus();
      }
    };

    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      previous?.focus();
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div aria-hidden="true" className="absolute inset-0 bg-ink/55" onClick={onCancel} />
      <div
        ref={dialogRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        aria-busy={confirming || undefined}
        className="relative max-h-[calc(100vh-2rem)] w-full max-w-[560px] overflow-y-auto rounded-lg bg-white p-6 sm:p-8"
      >
        <div className="flex items-start gap-3 sm:gap-4">
          <span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-flame/60 bg-flame/15 text-truffle sm:h-11 sm:w-11">
            <Icon className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            {eyebrow && <p className="text-[11px] font-bold leading-[14px] text-truffle-dark">{eyebrow}</p>}
            <h2 id={titleId} className={cn('text-lg font-semibold leading-6 text-ink sm:text-xl sm:leading-7', eyebrow && 'mt-1')}>
              {title}
            </h2>
            <div id={descId} className="mt-1.5 text-sm leading-[22px] text-ink/75">
              {description}
            </div>
          </div>
          <button
            type="button"
            onClick={onCancel}
            aria-label="Cerrar"
            className="-mr-1 -mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-ink/60 hover:bg-palladian focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy"
          >
            <XIcon className="h-4 w-4" />
          </button>
        </div>

        {children && <div className="mt-5">{children}</div>}

        <div className="mt-6 flex flex-col-reverse gap-3 border-t border-oatmeal/60 pt-5 sm:flex-row sm:justify-end">
          <button
            ref={cancelRef}
            type="button"
            onClick={onCancel}
            className="inline-flex min-h-11 items-center justify-center rounded-lg border border-oatmeal bg-white px-5 py-2.5 text-sm font-semibold tracking-[0.5px] text-ink hover:bg-palladian/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={confirming}
            className="inline-flex min-h-11 items-center justify-center rounded-lg bg-truffle-dark px-5 py-2.5 text-center text-sm font-semibold tracking-[0.5px] text-white hover:bg-truffle disabled:cursor-progress disabled:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
