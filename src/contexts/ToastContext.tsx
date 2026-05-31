"use client";

import {
  HaloToast,
  HALO_TOAST_DEFAULT_ICON,
  HALO_TOAST_SUCCESS_ICON,
  type HaloToastPayload,
} from "@/src/components/toast/HaloToast";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type ShowToastOptions = {
  title: string;
  message: string;
  duration?: number;
  iconSrc?: string;
};

type ToastContextValue = {
  show: (options: ShowToastOptions) => void;
  showError: (message: string, title?: string) => void;
  showSuccess: (message: string, title?: string) => void;
  hide: () => void;
};

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

const DEFAULT_DURATION_MS = 8000;

function toPayload(options: ShowToastOptions): HaloToastPayload {
  return {
    title: options.title,
    message: options.message,
    duration: options.duration ?? DEFAULT_DURATION_MS,
    iconSrc: options.iconSrc ?? HALO_TOAST_DEFAULT_ICON,
  };
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [queue, setQueue] = useState<HaloToastPayload[]>([]);
  const current = queue[0] ?? null;

  const advance = useCallback(() => {
    setQueue((prev) => prev.slice(1));
  }, []);

  const hide = useCallback(() => advance(), [advance]);

  const show = useCallback((options: ShowToastOptions) => {
    setQueue((prev) => [...prev, toPayload(options)]);
  }, []);

  const showError = useCallback(
    (message: string, title = "Error") => {
      show({ title, message, iconSrc: HALO_TOAST_DEFAULT_ICON });
    },
    [show],
  );

  const showSuccess = useCallback(
    (message: string, title = "Success") => {
      show({ title, message, iconSrc: HALO_TOAST_SUCCESS_ICON });
    },
    [show],
  );

  const value = useMemo(() => ({ show, showError, showSuccess, hide }), [show, showError, showSuccess, hide]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <HaloToast toast={current} onClose={advance} />
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
