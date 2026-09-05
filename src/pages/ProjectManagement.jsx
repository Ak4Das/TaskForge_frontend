import styles from "../style/page_modules/ProjectManagement.module.css"
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
  SquarePen,
} from "lucide-react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { fetchAllProjects } from "../../services/requestToServer"
import ProjectModal from "../components/ProjectModel.jsx"

export default function ProjectManagement() {
  const [projects, setProjects] = useState([])
  // Search projects by name
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setIsError] = useState("")
  // Choose project status from dropdown
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
        return "badge_todo"
      case "In Progress":
        return "badge_progress"
      case "Completed":
        return "badge_completed"
      case "Blocked":
        return "badge_blocked"
      default:
        return ""
    }
  }

  return (
    <div className={`${styles.workspace_container}`}>
      <div className={`${styles.workspace_header}`}>
        <div className={`${styles.header_text}`}>
          <h1 className={`${styles.main_title}`}>Projects Workspace</h1>
          <p className={`${styles.sub_title}`}>
            Review, search, and manage ongoing project initiatives across your
            company teams.
          </p>
        </div>
        <button
          className={`${styles.btn_add_project}`}
          onClick={() => setProjectModalVisibilityState(true)}
        >
          <Plus size={18} /> Add New Project
        </button>
      </div>

      <div className={`${styles.workspace_filters}`}>
        <div className={`${styles.search_bar_wrapper}`}>
          <Search size={18} className={`${styles.search_icon}`} />
          <input
            className={`${styles.search_input}`}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects by name..."
          />
          {searchQuery && (
            <button
              className={`${styles.btn_clear}`}
              onClick={() => setSearchQuery("")}
            >
              Clear
            </button>
          )}
        </div>
        <select
          className={`${styles.status_dropdown}`}
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

      {error && <div className={`${styles.error_banner}`}>{error}</div>}

      {loading ? (
        <div className={`${styles.loading_state}`}>Loading projects...</div>
      ) : finalProjects.length === 0 ? (
        <div className={`${styles.empty_state}`}>
          <FolderKanban className={`${styles.empty_icon}`} size={40} />
          <h3 className={`${styles.empty_title}`}>No Projects Found</h3>
          <p className={`${styles.empty_subtitle}`}>
            {searchQuery
              ? `No matching items found for "${searchQuery}"`
              : "Your project ecosystem is empty."}
          </p>
        </div>
      ) : (
        <div className={`${styles.projects_grid}`}>
          {finalProjects.map((project) => (
            <div className={`${styles.project_card}`} key={project._id}>
              <div>
                <div className={`${styles.card_top_meta}`}>
                  <div className={`${styles.creation_date}`}>
                    <Calendar size={13} />
                    <span style={{ marginTop: "2px" }}>
                      Created: {formatCreationDate(project.createdAt)}
                    </span>
                  </div>
                  <span
                    className={`${styles.status_badge} ${styles[`${getStatusClass(project.status)}`]}`}
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

                <h2 className={`${styles.project_name}`}>{project.name}</h2>

                <p className={`${styles.project_description}`}>
                  {project.description}
                </p>
              </div>

              <div className={`${styles.card_footer}`}>
                <Link
                  to={`/editProject/${project._id}`}
                  className="btn btn-primary btn-sm d-flex align-items-center gap-1"
                >
                  <SquarePen size={18} /> Edit Project
                </Link>
                <Link
                  className={`${styles.view_tasks_link}`}
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
