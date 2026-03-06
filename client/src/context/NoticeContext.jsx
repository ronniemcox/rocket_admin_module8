import { createContext, useContext, useRef, useState } from "react";

const NoticeContext = createContext(null);

export function NoticeProvider({ children }) {
  const [notice, setNotice] = useState({
    show: false,
    variant: "success",
    message: "",
  });

  const timerRef = useRef(null);

  const clearNotice = () => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = null;
    setNotice({ show: false, variant: "success", message: "" });
  };

  const showNotice = (variant, message, autoHideMs = 6000) => {
    if (timerRef.current) window.clearTimeout(timerRef.current);

    setNotice({ show: true, variant, message });

    if (autoHideMs && autoHideMs > 0) {
      timerRef.current = window.setTimeout(() => {
        clearNotice();
      }, autoHideMs);
    }
  };

  return (
    <NoticeContext.Provider value={{ notice, showNotice, clearNotice }}>
      {children}
    </NoticeContext.Provider>
  );
}

export function useNotice() {
  const ctx = useContext(NoticeContext);
  if (!ctx) throw new Error("useNotice must be used inside <NoticeProvider>");
  return ctx;
}