import { useEffect } from "react";
import { useAppContext } from "../context/AppContext";

export default function Toast() {
  const { toast, showToast } = useAppContext();

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => showToast(null), 3200);
    return () => clearTimeout(timer);
  }, [showToast, toast]);

  if (!toast?.message) return null;

  return (
    <div className={`toast toast-${toast.type || "success"}`} role="status">
      {toast.message}
    </div>
  );
}
