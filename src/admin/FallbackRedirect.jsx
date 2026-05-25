import { Navigate } from "react-router-dom";
import { hasAdminApiSession } from "../lib/authRole.js";

export default function FallbackRedirect() {
  if (hasAdminApiSession()) {
    return <Navigate to="/admin/packages" replace />;
  }

  return <Navigate to="/" replace />;
}
