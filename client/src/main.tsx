import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import AuthSectionThree from "@/components/ui/auth-section-3";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthSectionThree />
  </StrictMode>
);