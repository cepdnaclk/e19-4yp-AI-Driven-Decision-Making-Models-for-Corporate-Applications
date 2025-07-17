// hooks/useAuth.js
export const useAuth = () => {
  const token = localStorage.getItem("access_token");
  return {
    isAuthenticated: !!token,
    role: localStorage.getItem("role") || null,
  };
};
