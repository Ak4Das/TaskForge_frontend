import styles from "../style/page_modules/Dashboard.module.css"
import React, { useState, useEffect, useContext } from "react"
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
import context from "../contexts/createContexts.js"

export default function Dashboard() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [tasks, setTasks] = useState([])
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setIsError] = useState("")
  const navigate = useNavigate()
  const [projectStatus, setProjectStatus] = useState("")

  const user = Object.values(useContext(context))[0]

  const filteredProjects = projectStatus
    ? projects.filter((project) => project.status === projectStatus)
    : projects

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

        if (Object.keys(user).length) {
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
    <div className={`${styles.dashboard_container}`}>
      <div className={`${styles.dashboard_header}`}>
        <div className={`${styles.header_title_area}`}>
          <h1>Workasana Dashboard</h1>
          <p>Track projects, organize workloads, and keep your team aligned.</p>
        </div>

        <button
          onClick={() => setModalVisibilityState(true)}
          className={`${styles.btn_primary} ${styles.btn_primary_one}`}
        >
          <Plus size={18} /> Add New Task
        </button>
      </div>

      <section style={{ marginBottom: "40px" }}>
        <div className={`${styles.section_header}`}>
          <div className={`${styles.section_header_left}`}>
            <h2 className={`${styles.section_title}`}>Ongoing Projects</h2>
            <select
              // value={projectStatus}
              onChange={(e) => setProjectStatus(e.target.value)}
              className={`${styles.dropdown}`}
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
            className={`${styles.btn_primary}`}
            onClick={() => setProjectModalVisibilityState(true)}
          >
            <Plus size={18} /> Add New Project
          </button>
        </div>
        <div className={`${styles.projects_grid}`}>
          {filteredProjects.map((project) => (
            <Link
              key={project._id}
              to={`/projects/${project._id}`}
              className={`${styles.project_card}`}
            >
              <span style={getStatusBadgeStyle(project.status)}>
                {project.status === "Completed" && <CheckCircle2 size={12} />}
                {project.status === "In Progress" && <Clock size={12} />}
                {project.status === "Blocked" && <AlertTriangle size={12} />}
                {project.status === "To Do" && <HelpCircle size={12} />}
                {project.status}
              </span>
              <h3>{project.name}</h3>
              <p className={`${styles.project_description}`}>
                {project.description ||
                  "No overview available for this project workspace."}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <div className={`${styles.filters_panel}`}>
        <h2
          className={`${styles.section_title} ${styles.task_section_title_one}`}
        >
          My Tasks
        </h2>
        <div className={`${styles.filters_panel_left}`}>
          <div className={`${styles.filter_label}`}>
            <Filter size={16} />
            <span>Quick Filters:</span>
          </div>
          <div className={`${styles.filter_buttons_group}`}>
            {["To Do", "In Progress", "Completed", "Blocked"].map((status) => (
              <button
                key={status}
                onClick={() => handleQuickFilterToggle(status)}
                className={`${styles.filter_pill}`}
              >
                {status}
              </button>
            ))}
          </div>
          <select
            name="filters"
            className={`${styles.dropdown} ${styles.task_filter_dropdown}`}
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
            className={`${styles.btn_primary} ${styles.btn_primary_two}`}
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
            className={`${styles.clear_filters_btn} ${styles.clear_filters_btn_one}`}
          >
            Clear Filters
          </button>
        )}
      </div>

      <section className={`${styles.tasks_section}`}>
        <div className={`${styles.tasks_section_title}`}>
          <h2 className={`${styles.task_section_title_two}`}>My Tasks</h2>
          {currentStatusFilter && (
            <button
              onClick={() => {
                const updatedParams = new URLSearchParams(searchParams)
                updatedParams.delete("status")
                setSearchParams(updatedParams)
              }}
              className={`${styles.clear_filters_btn} ${styles.clear_filters_btn_two}`}
            >
              Clear Filters
            </button>
          )}
        </div>

        {loading ? (
          <div className={`${styles.state_placeholder}`}>
            Loading items registry...
          </div>
        ) : tasks.length === 0 ? (
          <div className={`${styles.state_placeholder}`}>
            No active tasks found matching current filter parameters.
          </div>
        ) : (
          <div className={`${styles.responsive_table_wrapper}`}>
            <table className={`${styles.tasks_table}`}>
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
                      <Link
                        to={`/tasks/${task._id}`}
                        className={`${styles.task_link}`}
                      >
                        {task.name}
                      </Link>
                      <div className={`${styles.tags_list}`}>
                        {task.tags?.map((tag, i) => (
                          <span className={`${styles.tag_badge}`} key={i}>
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
                      {task.timeToComplete}
                      {` `}
                      {task.timeToComplete === 1 ? "day" : "days"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div
              className={`${styles.tasks_cards}`}
              style={{ padding: "20px" }}
            >
              <div className="row">
                {tasks &&
                  tasks.map((task) => {
                    return (
                      <div className="col-12 col-lg-6" key={task._id}>
                        <div
                          className={`mb-3`}
                          style={{
                            overflow: "hidden",
                            cursor: "pointer",
                          }}
                        >
                          <div className={`card mb-3`}>
                            <div className="card-body d-flex gap-2 justify-content-between">
                              <div style={{ fontSize: "16px" }}>
                                <p>
                                  <Link
                                    to={`/tasks/${task._id}`}
                                    className={`${styles.task_link}`}
                                  >
                                    {task.name}
                                  </Link>
                                </p>
                                <p>
                                  <b>Project Context:</b>
                                  {` `}
                                  {task.project?.name || "Unassigned"}
                                </p>
                                <p>
                                  <b>Assigned Team:</b>
                                  {` `}
                                  {task.team?.name || "Cross-Functional"}
                                </p>
                                <p className="d-block d-sm-none">
                                  <b>Workflow State:</b>
                                  {` `}
                                  <span
                                    style={getStatusBadgeStyle(task.status)}
                                  >
                                    {task.status === "Completed" && (
                                      <CheckCircle2 size={12} />
                                    )}
                                    {task.status === "In Progress" && (
                                      <Clock size={12} />
                                    )}
                                    {task.status === "Blocked" && (
                                      <AlertTriangle size={12} />
                                    )}
                                    {task.status === "To Do" && (
                                      <HelpCircle size={12} />
                                    )}
                                    {task.status}
                                  </span>
                                </p>
                                <p>
                                  <b>Allocation Duration:</b>
                                  {` `}
                                  {task.timeToComplete}
                                  {` `}
                                  {task.timeToComplete === 1 ? "day" : "days"}
                                </p>
                                <p>
                                  <b>Tags:</b>
                                  {` `}
                                  {task.tags?.map((tag, i) => (
                                    <span
                                      className={`${styles.tag_badge} me-1`}
                                      key={i}
                                    >
                                      {tag.name}
                                    </span>
                                  ))}
                                </p>
                              </div>
                              <div
                                className={`${styles.task_status_badge}`}
                                style={{ minWidth: "100px" }}
                              >
                                <p className="d-flex justify-content-end">
                                  <span
                                    style={getStatusBadgeStyle(task.status)}
                                  >
                                    {task.status === "Completed" && (
                                      <CheckCircle2 size={12} />
                                    )}
                                    {task.status === "In Progress" && (
                                      <Clock size={12} />
                                    )}
                                    {task.status === "Blocked" && (
                                      <AlertTriangle size={12} />
                                    )}
                                    {task.status === "To Do" && (
                                      <HelpCircle size={12} />
                                    )}
                                    {task.status}
                                  </span>
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
              </div>
            </div>
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
