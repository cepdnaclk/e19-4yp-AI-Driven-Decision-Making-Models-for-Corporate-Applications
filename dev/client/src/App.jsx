import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import CreateUserForm from "./components/CreateUserForm";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import CreateAgentForm from "./pages/CreateAgentForm";
import EditAgentForm from "./pages/EditAgentForm";
import Chat from "./pages/Chat";
import ViewProfile from "./pages/ViewProfile";
import EditProfile from "./pages/EditProfile";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./hooks/useAuth";

function AppWrapper() {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  // Hide Navbar on login/register routes
  const hideNavbarOn = ["/login", "/"];
  const hideNavbar = hideNavbarOn.includes(location.pathname) || !isAuthenticated;

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<RegisterForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/home" element={<ProtectedRoute element={Home} />} />
        <Route
          path="/create-user"
          element={
            <ProtectedRoute element={CreateUserForm} roles={["admin"]} />
          }
        />
        <Route
          path="/dashboard"
          element={<ProtectedRoute element={Dashboard} />}
        />
        <Route
          path="/create-agent"
          element={
            <ProtectedRoute element={CreateAgentForm} roles={["admin"]} />
          }
        />
        <Route
          path="/update/:agentId"
          element={<ProtectedRoute element={EditAgentForm} roles={["admin"]} />}
        />
        <Route
          path="/chat/:agentId"
          element={
            <ProtectedRoute
              element={Chat}
              roles={["admin", "employee", "customer"]}
            />
          }
        />
        <Route
          path="/profile"
          element={<ProtectedRoute element={ViewProfile} />}
        />
        <Route
          path="/edit-profile"
          element={<ProtectedRoute element={EditProfile} />}
        />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppWrapper />
    </BrowserRouter>
  );
}

export default App;
