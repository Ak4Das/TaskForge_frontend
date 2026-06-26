import React, { useState, useEffect } from "react"
import axios from "axios"
import {
  FolderKanban,
  Search,
  Calendar,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Clock,
  Plus,
} from "lucide-react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { fetchAllProjects } from "../../services/requestToServer"
import ProjectModal from "../components/ProjectModel.jsx"

export default function ProjectManagement() {
  const [projects, setProjects] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setIsError] = useState("")
  const [projectStatus, setProjectStatus] = useState("")
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()

  const isProjectModalOpen = searchParams.get("newProjectModal") === "true"

  useEffect(() => {
    if (error === "Invalid Token.") {
      navigate("/login")
    }
  }, [error])

  useEffect(() => {
    const fetchProjectsRegistry = async () => {
      try {
        setLoading(true)

        const response = await fetchAllProjects({ setIsError })

        const sortedLatestFirst = response
          ? response.sort((a, b) => {
              return new Date(b.createdAt) - new Date(a.createdAt)
            })
          : []

        setProjects(sortedLatestFirst)
      } catch (error) {
        if (import.meta.env.VITE_MODE === "DEVELOPMENT") {
          console.error(error)
        }
        setIsError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchProjectsRegistry()
  }, [])

  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const finalProjects = projectStatus
    ? filteredProjects.filter((project) => project.status === projectStatus)
    : filteredProjects

  const formatCreationDate = (dateString) => {
    if (!dateString) return "Recent"
    const dateObj = new Date(dateString)
    return dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
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

  const getStatusClass = (status) => {
    switch (status) {
      case "To Do":
        return "badge-todo"
      case "In Progress":
        return "badge-progress"
      case "Completed":
        return "badge-completed"
      case "Blocked":
        return "badge-blocked"
      default:
        return ""
    }
  }

  return (
    <div className="workspace-container">
      <div className="workspace-header">
        <div className="header-text">
          <h1 className="main-title">Projects Workspace</h1>
          <p className="sub-title">
            Review, search, and manage ongoing project initiatives across your
            company teams.
          </p>
        </div>
        <button
          className="btn-add-project"
          onClick={() => setProjectModalVisibilityState(true)}
        >
          <Plus size={18} /> Add New Project
        </button>
      </div>

      <div className="workspace-filters">
        <div className="search-bar-wrapper">
          <Search size={18} className="search-icon" />
          <input
            className="search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects by name..."
          />
          {searchQuery && (
            <button className="btn-clear" onClick={() => setSearchQuery("")}>
              Clear
            </button>
          )}
        </div>
        <select
          className="status-dropdown"
          value={projectStatus}
          onChange={(e) => setProjectStatus(e.target.value)}
        >
          <option value="">--- Choose Status ---</option>
          <option value="">All</option>
          <option value="To Do">To Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
          <option value="Blocked">Blocked</option>
        </select>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {loading ? (
        <div className="loading-state">Loading projects...</div>
      ) : finalProjects.length === 0 ? (
        <div className="empty-state">
          <FolderKanban className="empty-icon" size={40} />
          <h3 className="empty-title">No Projects Found</h3>
          <p className="empty-subtitle">
            {searchQuery
              ? `No matching items found for "${searchQuery}"`
              : "Your project ecosystem is empty."}
          </p>
        </div>
      ) : (
        <div className="projects-grid">
          {finalProjects.map((project) => (
            <div className="project-card" key={project._id}>
              <div>
                <div className="card-top-meta">
                  <div className="creation-date">
                    <Calendar size={13} />
                    <span style={{ marginTop: "2px" }}>
                      Created: {formatCreationDate(project.createdAt)}
                    </span>
                  </div>
                  <span
                    className={`status-badge ${getStatusClass(project.status)}`}
                  >
                    {project.status === "Completed" && (
                      <CheckCircle2 size={12} />
                    )}
                    {project.status === "In Progress" && <Clock size={12} />}
                    {project.status === "Blocked" && (
                      <AlertTriangle size={12} />
                    )}
                    {project.status === "To Do" && <HelpCircle size={12} />}
                    {project.status}
                  </span>
                </div>

                <h2 className="project-name">{project.name}</h2>

                <p className="project-description">{project.description}</p>
              </div>

              <div className="card-footer">
                <Link
                  className="view-tasks-link"
                  to={`/projects/${project._id}`}
                >
                  <span>View Tasks</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {isProjectModalOpen && (
        <ProjectModal
          setProjectModalVisibilityState={setProjectModalVisibilityState}
        />
      )}
    </div>
  )
}
