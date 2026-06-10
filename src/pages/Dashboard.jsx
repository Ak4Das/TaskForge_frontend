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

export default function Dashboard() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [tasks, setTasks] = useState([])
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setIsError] = useState("")
  const navigate = useNavigate()
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")))

  useEffect(() => {
    async function fetchData() {
      const token = localStorage.getItem("token")
      if (token && !user) {
        const user = await fetchMe({ setFunction: setUser, setIsError })
        localStorage.setItem("user", JSON.stringify(user))
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
  const isModalOpen = searchParams.get("newTaskModal") === "true"

  useEffect(() => {
    const fetchDashboardContent = async () => {
      try {
        setLoading(true)
        const projectsResponse = await fetchAllProjects({
          setFunction: setProjects,
          setIsError,
        })

        if (user) {
          const taskEndpoint = currentStatusFilter
            ? `http://localhost:3000/api/tasks?owner=${user.id}&status=${encodeURIComponent(currentStatusFilter)}`
            : `http://localhost:3000/api/tasks?owner=${user.id}`

          const tasksResponse = await fetchTasks({
            taskEndpoint,
            setFunction: setTasks,
            setIsError,
          })
        }
      } catch (error) {
        console.error("Error compiling dashboard backend data matrix:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardContent()
  }, [currentStatusFilter])

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
    <div
      style={{
        padding: "24px",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "32px",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "28px",
              fontWeight: "700",
              color: "#111827",
              margin: "0 0 4px 0",
            }}
          >
            Workasana Dashboard
          </h1>
          <p style={{ color: "#4B5563", margin: 0 }}>
            Track projects, organize workloads, and keep your team aligned.
          </p>
        </div>

        <button
          onClick={() => setModalVisibilityState(true)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            backgroundColor: "#4F46E5",
            color: "#ffffff",
            border: "none",
            padding: "12px 20px",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: "600",
            cursor: "pointer",
            transition: "background-color 0.2s",
          }}
        >
          <Plus size={18} /> Add New Task
        </button>
      </div>

      <section style={{ marginBottom: "40px" }}>
        <h2
          style={{
            fontSize: "18px",
            fontWeight: "600",
            color: "#374151",
            marginBottom: "16px",
          }}
        >
          Ongoing Projects
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "20px",
          }}
        >
          {projects.map((project) => (
            <Link
              key={project._id}
              to={`/projects/${project._id}`}
              style={{
                textDecoration: "none",
                color: "inherit",
                display: "block",
                backgroundColor: "#ffffff",
                border: "1px solid #E5E7EB",
                borderRadius: "12px",
                padding: "20px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                transition: "transform 0.15s, box-shadow 0.15s",
              }}
            >
              <h3
                style={{
                  fontSize: "16px",
                  fontWeight: "600",
                  color: "#111827",
                  margin: "0 0 8px 0",
                }}
              >
                {project.name}
              </h3>
              <p
                style={{
                  fontSize: "14px",
                  color: "#6B7280",
                  margin: 0,
                  lineBreak: "anywhere",
                  display: "-webkit-box",
                  WebkitLineBreak: "3",
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {project.description ||
                  "No overview available for this project workspace."}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Quick Filters Panel Section */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid #E5E7EB",
          paddingBottom: "16px",
          marginBottom: "24px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              color: "#4B5563",
              fontSize: "14px",
              fontWeight: "500",
            }}
          >
            <Filter size={16} />
            <span>Quick Filters:</span>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            {["To Do", "In Progress", "Completed", "Blocked"].map((status) => (
              <button
                key={status}
                onClick={() => handleQuickFilterToggle(status)}
                style={{
                  padding: "6px 14px",
                  borderRadius: "20px",
                  border: "1px solid",
                  borderColor:
                    currentStatusFilter === status ? "#4F46E5" : "#D1D5DB",
                  backgroundColor:
                    currentStatusFilter === status ? "#EEF2F6" : "#ffffff",
                  color: currentStatusFilter === status ? "#4F46E5" : "#374151",
                  fontSize: "13px",
                  fontWeight: "500",
                  cursor: "pointer",
                }}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {currentStatusFilter && (
          <button
            onClick={() => {
              const updatedParams = new URLSearchParams(searchParams)
              updatedParams.delete("status")
              setSearchParams(updatedParams)
            }}
            style={{
              background: "none",
              border: "none",
              color: "#4F46E5",
              fontSize: "13px",
              fontWeight: "500",
              cursor: "pointer",
            }}
          >
            Clear Filters
          </button>
        )}
      </div>

      <section
        style={{
          backgroundColor: "#ffffff",
          border: "1px solid #E5E7EB",
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        }}
      >
        <div
          style={{
            padding: "16px 20px",
            borderBottom: "1px solid #E5E7EB",
            backgroundColor: "#F9FAFB",
          }}
        >
          <h2
            style={{
              fontSize: "16px",
              fontWeight: "600",
              color: "#111827",
              margin: 0,
            }}
          >
            My Tasks
          </h2>
        </div>

        {loading ? (
          <div
            style={{ padding: "40px", textAlign: "center", color: "#6B7280" }}
          >
            Loading action items registry...
          </div>
        ) : tasks.length === 0 ? (
          <div
            style={{ padding: "40px", textAlign: "center", color: "#6B7280" }}
          >
            No active assignments found matching current filter parameters.
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                textAlign: "left",
              }}
            >
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
                        style={{
                          fontWeight: "500",
                          color: "#4F46E5",
                          textDecoration: "none",
                        }}
                      >
                        {task.name}
                      </Link>
                      <div
                        style={{
                          display: "flex",
                          gap: "4px",
                          marginTop: "6px",
                        }}
                      >
                        {task.tags?.map((tag, i) => (
                          <span
                            key={i}
                            style={{
                              fontSize: "11px",
                              background: "#F3F4F6",
                              color: "#4B5563",
                              padding: "2px 6px",
                              borderRadius: "4px",
                            }}
                          >
                            {tag}
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

      {isModalOpen && (
        <TaskModal setModalVisibilityState={setModalVisibilityState} />
      )}
    </div>
  )
}
