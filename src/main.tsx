import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import { AuthProvider } from "./context/AuthContext";
import { EvidenceProvider } from "./context/EvidenceContext";
import AppLayout from "./components/AppLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import IntakePage from "./pages/IntakePage";
import TransferPage from "./pages/TransferPage";
import VerifyPage from "./pages/VerifyPage";
import RegistryPage from "./pages/RegistryPage";
import ActivityPage from "./pages/ActivityPage";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <EvidenceProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<AppLayout />}>
              {/* Public routes */}
              <Route index element={<HomePage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
              <Route path="unauthorized" element={<UnauthorizedPage />} />

              {/* Forensic Analyst + Case Manager: Evidence Intake */}
              <Route element={<ProtectedRoute allowedRoles={["forensic_analyst", "case_manager"]} />}>
                <Route path="intake" element={<IntakePage />} />
              </Route>

              {/* Lab Technician + Case Manager: Custody Transfer */}
              <Route element={<ProtectedRoute allowedRoles={["lab_technician", "case_manager"]} />}>
                <Route path="transfer" element={<TransferPage />} />
              </Route>

              {/* All roles: Verification */}
              <Route element={<ProtectedRoute allowedRoles={["forensic_analyst", "lab_technician", "case_manager", "court_officer"]} />}>
                <Route path="verify" element={<VerifyPage />} />
              </Route>

              {/* All roles: Evidence Registry */}
              <Route element={<ProtectedRoute allowedRoles={["forensic_analyst", "lab_technician", "case_manager", "court_officer"]} />}>
                <Route path="registry" element={<RegistryPage />} />
              </Route>

              {/* Forensic Analyst + Lab Technician + Case Manager: Recent Activity */}
              <Route element={<ProtectedRoute allowedRoles={["forensic_analyst", "lab_technician", "case_manager"]} />}>
                <Route path="activity" element={<ActivityPage />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </EvidenceProvider>
    </AuthProvider>
  </StrictMode>
);
