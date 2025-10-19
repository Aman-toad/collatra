import { Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Workspaces from "./pages/Workspace";
import NotFound from "./pages/NotFound";
import WorkspaceView from "./pages/WorkspaceView";
import PrivateRoute from "./routes/PrivateRoute";
import Docs from "./pages/Docs";
import DocEditor from './pages/DocEditor'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/workspaces"
        element={
          <PrivateRoute>
            <Workspaces />
          </PrivateRoute>
        }
      />
      <Route path="/workspaces/:id" element={<WorkspaceView />} />

      <Route path="/docs"
        element={
          <PrivateRoute>
            <Docs />
          </PrivateRoute>
        }
      />
      <Route path="/docs/:id" element={<DocEditor />} />


      {/* for fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
