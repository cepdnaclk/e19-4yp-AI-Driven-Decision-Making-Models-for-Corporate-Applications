import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ element: Element, roles }) {
  const token = localStorage.getItem("access_token");
  const userRole = localStorage.getItem("role");

  if (!token) return <Navigate to="/" replace />;
  if (roles && !roles.includes(userRole)) return <Navigate to="/dashboard" replace />;

  return <Element />;
}
