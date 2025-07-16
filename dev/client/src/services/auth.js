import api from "./api";

export const loginUser = async (username, password) => {
  const formData = new URLSearchParams();
  formData.append("username", username);
  formData.append("password", password);

  const res = await api.post("/login", formData.toString(), {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });

  localStorage.setItem("access_token", res.data.access_token);
  localStorage.setItem("role", res.data.role);
  localStorage.setItem("user_id", res.data.user_id);
  return res.data;
};

export async function registerCustomer(username, password, email) {
  const formData = new FormData();
  formData.append("username", username);
  formData.append("password", password);
  formData.append("email", email);
  formData.append("role", "customer");

  const res = await fetch("http://localhost:8000/register", {
    method: "POST",
    body: formData,
  });
  if (!res.ok) {
    throw new Error("Registration failed");
  }
}

export async function createUserByAdmin(username, password, role) {
  const token = localStorage.getItem("access_token");

  const formData = new FormData();
  formData.append("username", username);
  formData.append("password", password);
  formData.append("role", role);

  const res = await fetch("http://localhost:8000/create-user", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      // DO NOT SET Content-Type manually for FormData
    },
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Failed to create user");
  }

  return res.json();
}

