import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import AuthSection from "@/components/ui/auth-section-3";

const root = document.getElementById("root")!;
const raw = root.dataset.mode;
const mode = raw === "login" || raw === "address" ? raw : "signup";

createRoot(root).render(
  <StrictMode>
    <AuthSection
      mode={mode}
      error={root.dataset.error || undefined}
      userId={root.dataset.userId || undefined}
    />
  </StrictMode>
);