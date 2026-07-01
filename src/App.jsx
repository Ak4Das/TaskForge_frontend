import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom"
import "./App.css"
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap.bundle.min.js"
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
import EditTask from "./pages/EditTaskModel"
import EditProfile from "./pages/EditProfile"
import EditTeam from "./pages/EditTeam"
import CompressSidebar from "./components/CompressSidebar"
import { useEffect, useState } from "react"

const ProtectedLayout = ({ children }) => {
  const [isCollapse, setCollapse] = useState(window.innerWidth < 992)

  const hasActiveToken = !!localStorage.getItem("token")

  if (!hasActiveToken) {
    return <Navigate to="/login" replace />
  }

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 992) {
        setCollapse(true)
      } else {
        setCollapse(false)
      }
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "#F3F4F6",
      }}
    >
      {!isCollapse ? <Sidebar /> : <CompressSidebar />}
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
        <Route
          path="/tasks/edit/:taskId"
          element={
            <ProtectedLayout>
              <EditTask />
            </ProtectedLayout>
          }
        />
        <Route
          path="/edit/profile"
          element={
            <ProtectedLayout>
              <EditProfile />
            </ProtectedLayout>
          }
        />
        <Route
          path="/teams/edit/:teamId"
          element={
            <ProtectedLayout>
              <EditTeam />
            </ProtectedLayout>
          }
        />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      <ToastContainer />
    </Router>
  )
}
