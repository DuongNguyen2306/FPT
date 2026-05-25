import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AdminGuard from "./admin/AdminGuard.jsx";
import AdminLayout from "./admin/AdminLayout.jsx";
import CustomerGuard from "./admin/CustomerGuard.jsx";
import FallbackRedirect from "./admin/FallbackRedirect.jsx";
import HomePage from "./pages/HomePage.jsx";
import PackageDetailPage from "./pages/PackageDetailPage.jsx";
import RegistrationPage from "./pages/RegistrationPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import AdminPackagesPage from "./pages/admin/AdminPackagesPage.jsx";
import AdminPackageFormPage from "./pages/admin/AdminPackageFormPage.jsx";
import AdminLeadsPage from "./pages/admin/AdminLeadsPage.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin/login" element={<Navigate to="/login?role=admin" replace />} />

        <Route element={<CustomerGuard />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/goi/id/:id" element={<PackageDetailPage />} />
          <Route path="/goi/:code" element={<PackageDetailPage />} />
          <Route path="/dang-ky" element={<RegistrationPage />} />
        </Route>

        <Route path="/admin" element={<AdminGuard />}>
          <Route element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/packages" replace />} />
            <Route path="packages" element={<AdminPackagesPage />} />
            <Route path="packages/new" element={<AdminPackageFormPage mode="create" />} />
            <Route path="packages/:id/edit" element={<AdminPackageFormPage mode="edit" />} />
            <Route path="leads" element={<AdminLeadsPage />} />
          </Route>
        </Route>

        <Route path="*" element={<FallbackRedirect />} />
      </Routes>
    </BrowserRouter>
  );
}
