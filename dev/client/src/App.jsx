import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import CreateUserForm from "./components/CreateUserForm";
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import CreateAgentForm from './pages/CreateAgentForm';
import EditAgentForm from './pages/EditAgentForm';
import Chat from './pages/Chat';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RegisterForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/home" element={<ProtectedRoute element={Home} />} />
        <Route path="/create-user" element={<ProtectedRoute element={CreateUserForm} roles={["admin"]} />} />
        <Route path="/dashboard" element={<ProtectedRoute element={Dashboard} />} />
        <Route path="/create-agent" element={<ProtectedRoute element={CreateAgentForm} roles={["admin"]} />} />
        <Route path="/update/:agentId" element={<ProtectedRoute element={EditAgentForm} roles={["admin"]} />} />
        <Route path="/chat/:agentId" element={<ProtectedRoute element={Chat} roles={["admin", "employee", "customer"]} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
