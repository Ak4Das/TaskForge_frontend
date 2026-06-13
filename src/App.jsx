import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom"
import "./App.css"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Dashboard from "./pages/Dashboard"
import ProjectManagement from "./pages/ProjectManagement"
import ProjectTasks from "./pages/ProjectTasks"
import TaskDetail from "./pages/TaskDetail"
import TeamManagement from "./pages/TeamManagement"
import Reports from "./pages/Reports"
import Sidebar from "./components/Sidebar"
import { ToastContainer } from "react-toastify"
import TeamDetail from "./pages/TeamDetail"

const ProtectedLayout = ({ children }) => {
  const hasActiveToken = !!localStorage.getItem("token")
  if (!hasActiveToken) return <Navigate to="/login" replace />

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "#F3F4F6",
      }}
    >
      <Sidebar />
      <main style={{ flex: 1, overflowY: "auto" }}>{children}</main>
    </div>
  )
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/"
          element={
            <ProtectedLayout>
              <Dashboard />
            </ProtectedLayout>
          }
        />
        <Route
          path="/projects"
          element={
            <ProtectedLayout>
              <ProjectManagement />
            </ProtectedLayout>
          }
        />
        <Route
          path="/projects/:projectId"
          element={
            <ProtectedLayout>
              <ProjectTasks />
            </ProtectedLayout>
          }
        />
        <Route
          path="/tasks/:taskId"
          element={
            <ProtectedLayout>
              <TaskDetail />
            </ProtectedLayout>
          }
        />
        <Route
          path="/teams"
          element={
            <ProtectedLayout>
              <TeamManagement />
            </ProtectedLayout>
          }
        />
        <Route
          path="/reports"
          element={
            <ProtectedLayout>
              <Reports />
            </ProtectedLayout>
          }
        />
        <Route
          path="/teams/:teamId"
          element={
            <ProtectedLayout>
              <TeamDetail />
            </ProtectedLayout>
          }
        />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      <ToastContainer />
    </Router>
  )
}
