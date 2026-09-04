import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
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
import EditProject from "./pages/EditProject"
import CompressSidebar from "./components/CompressSidebar"
import { useContext, useEffect, useState } from "react"
import ContextProvider from "./contexts/contextProvider"
import context from "./contexts/createContexts"

const ProtectedLayout = ({ children }) => {
  const [isCollapse, setCollapse] = useState(window.innerWidth < 992)
  const navigate = useNavigate()

  const { user } = useContext(context)

  useEffect(() => {
    if (user === null) {
      navigate("/login")
    }
  }, [user])

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

  if (!user) {
    return
  }

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "#F3F4F6",
      }}
    >
      {!isCollapse ? (
        <Sidebar setCollapse={setCollapse} />
      ) : (
        <CompressSidebar setCollapse={setCollapse} />
      )}
      <main style={{ flex: 1, overflowY: "auto" }}>{children}</main>
    </div>
  )
}

const NormalLayout = ({ children }) => {
  // Controls toggle btw sidebar and compressSidebar
  const [isCollapse, setCollapse] = useState(window.innerWidth < 992)

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
      {!isCollapse ? (
        <Sidebar setCollapse={setCollapse} />
      ) : (
        <CompressSidebar setCollapse={setCollapse} />
      )}
      <main style={{ flex: 1, overflowY: "auto" }}>{children}</main>
    </div>
  )
}

export default function App() {
  return (
    <Router>
      <ContextProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/"
            element={
              <NormalLayout>
                <Dashboard />
              </NormalLayout>
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
            path="/editProject/:projectId"
            element={
              <ProtectedLayout>
                <EditProject />
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
      </ContextProvider>
      <ToastContainer />
    </Router>
  )
}
