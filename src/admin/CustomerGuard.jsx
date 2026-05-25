import { Navigate, Outlet } from "react-router-dom";
import { hasAdminApiSession } from "../lib/authRole.js";

/** Admin đã đăng nhập không xem landing khách. */
export default function CustomerGuard() {
  if (hasAdminApiSession()) {
    return <Navigate to="/admin/packages" replace />;
  }

  return <Outlet />;
}
