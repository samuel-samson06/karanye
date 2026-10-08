"use client";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Client host for toast notifications. Kept separate so app/layout.tsx
// stays a server component. Styling is overridden in globals.css to meet
// the radius-0 / no-shadow / canonical-token rules.
export default function ToastHost() {
  return (
    <ToastContainer
      position="bottom-right"
      autoClose={4000}
      newestOnTop
      closeOnClick
      pauseOnHover
      aria-label="Notifications"
    />
  );
}
