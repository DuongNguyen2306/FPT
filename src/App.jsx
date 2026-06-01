import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AdminGuard from "./admin/AdminGuard.jsx";
import AdminLayout from "./admin/AdminLayout.jsx";
import CustomerGuard from "./admin/CustomerGuard.jsx";
import FallbackRedirect from "./admin/FallbackRedirect.jsx";
import HomePage from "./pages/HomePage.jsx";
import PackageQuizWizardPage from "./pages/PackageQuizWizardPage.jsx";
import PackageQuizResultsPage from "./pages/PackageQuizResultsPage.jsx";
import PackageDetailPage from "./pages/PackageDetailPage.jsx";
import RegistrationPage from "./pages/RegistrationPage.jsx";
import OrderSuccessPage from "./pages/OrderSuccessPage.jsx";
import OrderHistoryPage from "./pages/OrderHistoryPage.jsx";
import MyOrdersPage from "./pages/MyOrdersPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import AdminPackagesPage from "./pages/admin/AdminPackagesPage.jsx";
import AdminPackageFormPage from "./pages/admin/AdminPackageFormPage.jsx";
import AdminLeadsPage from "./pages/admin/AdminLeadsPage.jsx";
import AdminBannersPage from "./pages/admin/AdminBannersPage.jsx";
import AdminBannerFormPage from "./pages/admin/AdminBannerFormPage.jsx";
import AdminNavigationPage from "./pages/admin/AdminNavigationPage.jsx";
import AdminNavigationFormPage from "./pages/admin/AdminNavigationFormPage.jsx";
import AdminPackageQuizPage from "./pages/admin/AdminPackageQuizPage.jsx";
import AdminPackageQuizFormPage from "./pages/admin/AdminPackageQuizFormPage.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin/login" element={<Navigate to="/login?role=admin" replace />} />

        <Route element={<CustomerGuard />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/tu-van-goi" element={<PackageQuizWizardPage />} />
          <Route path="/ket-qua-tu-van" element={<PackageQuizResultsPage />} />
          <Route path="/goi/id/:id" element={<PackageDetailPage />} />
          <Route path="/goi/:code" element={<PackageDetailPage />} />
          <Route path="/dang-ky" element={<RegistrationPage />} />
          <Route path="/dat-hang-thanh-cong" element={<OrderSuccessPage />} />
          <Route path="/tra-cuu-don" element={<OrderHistoryPage />} />
          <Route path="/don-cua-toi" element={<MyOrdersPage />} />
        </Route>

        <Route path="/admin" element={<AdminGuard />}>
          <Route element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/packages" replace />} />
            <Route path="packages" element={<AdminPackagesPage />} />
            <Route path="packages/new" element={<AdminPackageFormPage mode="create" />} />
            <Route path="packages/:id/edit" element={<AdminPackageFormPage mode="edit" />} />
            <Route path="banners" element={<AdminBannersPage />} />
            <Route path="banners/new" element={<AdminBannerFormPage mode="create" />} />
            <Route
              path="banners/package/:packageId/edit"
              element={<AdminBannerFormPage mode="edit" linkType="package" />}
            />
            <Route
              path="banners/:bannerId/edit"
              element={<AdminBannerFormPage mode="edit" linkType="standalone" />}
            />
            <Route path="navigation" element={<AdminNavigationPage />} />
            <Route path="navigation/new" element={<AdminNavigationFormPage mode="create" />} />
            <Route path="navigation/:id/edit" element={<AdminNavigationFormPage mode="edit" />} />
            <Route path="package-quiz" element={<AdminPackageQuizPage />} />
            <Route path="package-quiz/new" element={<AdminPackageQuizFormPage mode="create" />} />
            <Route path="package-quiz/:id/edit" element={<AdminPackageQuizFormPage mode="edit" />} />
            <Route path="leads" element={<AdminLeadsPage />} />
          </Route>
        </Route>

        <Route path="*" element={<FallbackRedirect />} />
      </Routes>
    </BrowserRouter>
  );
}
