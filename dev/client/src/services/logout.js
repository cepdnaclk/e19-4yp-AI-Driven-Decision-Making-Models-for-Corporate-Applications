export const logout = (navigate) => {
  localStorage.clear();
  navigate("/login", { replace: true });
};
