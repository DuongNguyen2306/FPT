import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAdminStore } from "../stores/adminStore.js";

export default function AdminGuard() {
  const location = useLocation();
  const accessToken = useAdminStore((s) => s.accessToken);
  const admin = useAdminStore((s) => s.admin);

  if (!accessToken || !admin) {
    return <Navigate to="/login" replace state={{ from: location.pathname, role: "ADMIN" }} />;
  }

  return <Outlet />;
}
