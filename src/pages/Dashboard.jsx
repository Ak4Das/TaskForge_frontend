import React, { useState, useEffect } from "react"
import { useSearchParams, Link, useNavigate } from "react-router-dom"
import axios from "axios"
import {
  Plus,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  HelpCircle,
} from "lucide-react"
import TaskModal from "../components/TaskModel"
import {
  fetchAllProjects,
  fetchMe,
  fetchTasks,
} from "../../services/requestToServer.js"
import ProjectModal from "../components/ProjectModel.jsx"

export default function Dashboard() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [tasks, setTasks] = useState([])
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setIsError] = useState("")
  const navigate = useNavigate()
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")))
  const [projectStatus, setProjectStatus] = useState("")

  const filteredProjects = projectStatus
    ? projects.filter((project) => project.status === projectStatus)
    : projects

  useEffect(() => {
    async function fetchData() {
      const token = localStorage.getItem("token")
      if (token && !user) {
        const user = await fetchMe({ setFunction: setUser, setIsError })
        if (user) {
          localStorage.setItem("user", JSON.stringify(user))
        }
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    if (error === "Invalid Token.") {
      navigate("/login")
    }
  }, [error])

  const currentStatusFilter = searchParams.get("status") || ""
  const isTaskModalOpen = searchParams.get("newTaskModal") === "true"
  const isProjectModalOpen = searchParams.get("newProjectModal") === "true"

  useEffect(() => {
    const fetchDashboardContent = async () => {
      try {
        setLoading(true)
        await fetchAllProjects({
          setFunction: setProjects,
          setIsError,
        })

        if (user) {
          const taskEndpoint = currentStatusFilter
            ? `http://localhost:3000/api/tasks?owner=${user.id}&status=${encodeURIComponent(currentStatusFilter)}`
            : `http://localhost:3000/api/tasks?owner=${user.id}`

          await fetchTasks({
            taskEndpoint,
            setFunction: setTasks,
            setIsError,
          })
        }
      } catch (error) {
        if (import.meta.env.VITE_MODE === "DEVELOPMENT") {
          console.error(error)
        }
        setIsError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardContent()
  }, [user, currentStatusFilter])

  // Update URL queries when a user selects a filter
  const handleQuickFilterToggle = (statusValue) => {
    // Create copy of existing searchParams
    const updatedParams = new URLSearchParams(searchParams)
    if (currentStatusFilter === statusValue) {
      updatedParams.delete("status")
    } else {
      updatedParams.set("status", statusValue)
    }
    setSearchParams(updatedParams)
  }

  // Change task modal open/close states directly with the browser URL parameters
  const setModalVisibilityState = (isOpen) => {
    const updatedParams = new URLSearchParams(searchParams)
    if (isOpen) {
      updatedParams.set("newTaskModal", "true")
    } else {
      updatedParams.delete("newTaskModal")
    }
    setSearchParams(updatedParams)
  }

  // Change project modal open/close states directly with the browser URL parameters
  const setProjectModalVisibilityState = (isOpen) => {
    const updatedParams = new URLSearchParams(searchParams)
    if (isOpen) {
      updatedParams.set("newProjectModal", "true")
    } else {
      updatedParams.delete("newProjectModal")
    }
    setSearchParams(updatedParams)
  }

  const getStatusBadgeStyle = (status) => {
    const base = {
      padding: "4px 10px",
      borderRadius: "12px",
      fontSize: "12px",
      fontWeight: "600",
      display: "inline-flex",
      alignItems: "center",
      gap: "4px",
    }
    switch (status) {
      case "To Do":
        return { ...base, backgroundColor: "#E5E7EB", color: "#374151" }
      case "In Progress":
        return { ...base, backgroundColor: "#DBEAFE", color: "#1E40AF" }
      case "Completed":
        return { ...base, backgroundColor: "#D1FAE5", color: "#065F46" }
      case "Blocked":
        return { ...base, backgroundColor: "#FEE2E2", color: "#991B1B" }
      default:
        return base
    }
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="header-title-area">
          <h1>Workasana Dashboard</h1>
          <p>Track projects, organize workloads, and keep your team aligned.</p>
        </div>

        <button
          onClick={() => setModalVisibilityState(true)}
          className="btn-primary btn-primary-one"
        >
          <Plus size={18} /> Add New Task
        </button>
      </div>

      <section style={{ marginBottom: "40px" }}>
        <div className="section-header">
          <div className="section-header-left">
            <h2 className="section-title">Ongoing Projects</h2>
            <select
              // value={projectStatus}
              onChange={(e) => setProjectStatus(e.target.value)}
              className="dropdown"
            >
              <option value="">--- Choose Status ---</option>
              <option value="">All</option>
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Blocked">Blocked</option>
            </select>
          </div>
          <button
            className="btn-primary"
            onClick={() => setProjectModalVisibilityState(true)}
          >
            <Plus size={18} /> Add New Project
          </button>
        </div>
        <div className="projects-grid">
          {filteredProjects.map((project) => (
            <Link
              key={project._id}
              to={`/projects/${project._id}`}
              className="project-card"
            >
              <span style={getStatusBadgeStyle(project.status)}>
                {project.status === "Completed" && <CheckCircle2 size={12} />}
                {project.status === "In Progress" && <Clock size={12} />}
                {project.status === "Blocked" && <AlertTriangle size={12} />}
                {project.status === "To Do" && <HelpCircle size={12} />}
                {project.status}
              </span>
              <h3>{project.name}</h3>
              <p className="project-description">
                {project.description ||
                  "No overview available for this project workspace."}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <div className="filters-panel">
        <h2 className="section-title task-section-title-one">My Tasks</h2>
        <div className="filters-panel-left">
          <div className="filter-label">
            <Filter size={16} />
            <span>Quick Filters:</span>
          </div>
          <div className="filter-buttons-group">
            {["To Do", "In Progress", "Completed", "Blocked"].map((status) => (
              <button
                key={status}
                onClick={() => handleQuickFilterToggle(status)}
                className="filter-pill"
              >
                {status}
              </button>
            ))}
          </div>
          <select
            name="filters"
            className="dropdown task-filter-dropdown"
            onChange={(e) => handleQuickFilterToggle(e.target.value)}
          >
            <option value="">--Choose Status--</option>
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Blocked">Blocked</option>
          </select>
          <button
            onClick={() => setModalVisibilityState(true)}
            className="btn-primary btn-primary-two"
          >
            <Plus size={18} /> Add New Task
          </button>
        </div>

        {currentStatusFilter && (
          <button
            onClick={() => {
              const updatedParams = new URLSearchParams(searchParams)
              updatedParams.delete("status")
              setSearchParams(updatedParams)
            }}
            className="clear-filters-btn clear-filters-btn-one"
          >
            Clear Filters
          </button>
        )}
      </div>

      <section className="tasks-section">
        <div className="tasks-section-title">
          <h2 className="task-section-title-two">My Tasks</h2>
          {currentStatusFilter && (
            <button
              onClick={() => {
                const updatedParams = new URLSearchParams(searchParams)
                updatedParams.delete("status")
                setSearchParams(updatedParams)
              }}
              className="clear-filters-btn clear-filters-btn-two"
            >
              Clear Filters
            </button>
          )}
        </div>

        {loading ? (
          <div className="state-placeholder">Loading items registry...</div>
        ) : tasks.length === 0 ? (
          <div className="state-placeholder">
            No active tasks found matching current filter parameters.
          </div>
        ) : (
          <div className="responsive-table-wrapper">
            <table className="tasks-table">
              <thead>
                <tr
                  style={{
                    borderBottom: "1px solid #E5E7EB",
                    color: "#4B5563",
                    fontSize: "12px",
                    fontWeight: "600",
                    textTransform: "uppercase",
                    backgroundColor: "#F9FAFB",
                  }}
                >
                  <th style={{ padding: "12px 20px" }}>Task Description</th>
                  <th style={{ padding: "12px 20px" }}>Project Context</th>
                  <th style={{ padding: "12px 20px" }}>Assigned Team</th>
                  <th style={{ padding: "12px 20px" }}>Workflow State</th>
                  <th style={{ padding: "12px 20px" }}>Allocation Duration</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr
                    key={task._id}
                    style={{
                      borderBottom: "1px solid #E5E7EB",
                      transition: "backgroundColor 0.15s",
                    }}
                  >
                    <td style={{ padding: "16px 20px" }}>
                      <Link to={`/tasks/${task._id}`} className="task-link">
                        {task.name}
                      </Link>
                      <div className="tags-list">
                        {task.tags?.map((tag, i) => (
                          <span className="tag-badge" key={i}>
                            {tag.name}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td
                      style={{
                        padding: "16px 20px",
                        color: "#4B5563",
                        fontSize: "14px",
                      }}
                    >
                      {task.project?.name || "Unassigned"}
                    </td>
                    <td
                      style={{
                        padding: "16px 20px",
                        color: "#4B5563",
                        fontSize: "14px",
                      }}
                    >
                      {task.team?.name || "Cross-Functional"}
                    </td>
                    <td style={{ padding: "16px 20px" }}>
                      <span style={getStatusBadgeStyle(task.status)}>
                        {task.status === "Completed" && (
                          <CheckCircle2 size={12} />
                        )}
                        {task.status === "In Progress" && <Clock size={12} />}
                        {task.status === "Blocked" && (
                          <AlertTriangle size={12} />
                        )}
                        {task.status === "To Do" && <HelpCircle size={12} />}
                        {task.status}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: "16px 20px",
                        color: "#111827",
                        fontSize: "14px",
                        fontWeight: "500",
                      }}
                    >
                      {task.timeToComplete}{" "}
                      {task.timeToComplete === 1 ? "day" : "days"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {isTaskModalOpen && (
        <TaskModal setModalVisibilityState={setModalVisibilityState} />
      )}

      {isProjectModalOpen && (
        <ProjectModal
          setProjectModalVisibilityState={setProjectModalVisibilityState}
        />
      )}
    </div>
  )
}
