import { Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Workspaces from "./pages/Workspace";
import NotFound from "./pages/NotFound";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

function PrivateRouter({ children }) {
  const { user } = useContext(AuthContext);
  return user ? children : <Navigate to='/login' />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/workspaces"
        element={
          <PrivateRouter>
            <Workspaces />
          </PrivateRouter>
        }
      />

      {/* for fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
