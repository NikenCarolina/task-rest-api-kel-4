import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import InformasiSaldo from "./components/InformasiSaldo.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <InformasiSaldo />
  </StrictMode>
);
