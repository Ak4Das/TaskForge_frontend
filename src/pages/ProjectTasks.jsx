import React, { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import axios from "axios"
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  AlertTriangle,
  HelpCircle,
  Layers,
} from "lucide-react"

export default function ProjectTasks() {
  const { projectId } = useParams() // Extract the current project id safely from the URL string route
  const [project, setProject] = useState(null)
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchProjectAndTasks = async () => {
      const config = {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
      try {
        setLoading(true)

        // Fetch the target project metadata array to establish user layout context
        const projectRes = await axios.get("http://localhost:3000/api/projects", config)
        const currentProject = projectRes.data.find((p) => p._id === projectId)
        setProject(currentProject)

        // Fetch only the tasks belonging to this project via our filter API endpoint
        const tasksRes = await axios.get(
          `http://localhost:3000/api/tasks?project=${projectId}`,
          config,
        )
        setTasks(tasksRes.data)
      } catch (err) {
        console.error("Error fetching project tasks workspace:", err)
        setError("Failed to pull project assignment records. Please retry.")
      } finally {
        setLoading(false)
      }
    }

    fetchProjectAndTasks()
  }, [projectId])

  // Helper method to assign proper color badges to statuses
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

  if (loading) {
    return (
      <div
        style={{
          padding: "32px",
          textAlign: "center",
          color: "#6B7280",
          fontFamily: "sans-serif",
        }}
      >
        Loading task workspace ecosystem...
      </div>
    )
  }

  if (error || !project) {
    return (
      <div style={{ padding: "32px", fontFamily: "sans-serif" }}>
        <div
          style={{
            backgroundColor: "#FEF2F2",
            border: "1px solid #FCA5A5",
            color: "#991B1B",
            padding: "14px",
            borderRadius: "8px",
            marginBottom: "16px",
          }}
        >
          {error ||
            "The requested project scope profile could not be localized."}
        </div>
        <Link
          to="/projects"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            color: "#4F46E5",
            textDecoration: "none",
            fontWeight: "500",
          }}
        >
          <ArrowLeft size={16} /> Return to Projects Registry
        </Link>
      </div>
    )
  }

  return (
    <div
      style={{
        padding: "32px",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* Back to Project Management Screen Link */}
      <Link
        to="/projects"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          color: "#4F46E5",
          textDecoration: "none",
          fontSize: "14px",
          fontWeight: "600",
          marginBottom: "20px",
        }}
      >
        <ArrowLeft size={16} /> Back to Projects Track
      </Link>

      {/* Head Context Summary Panel Container */}
      <div
        style={{
          backgroundColor: "#ffffff",
          border: "1px solid #E5E7EB",
          borderRadius: "14px",
          padding: "24px",
          marginBottom: "32px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "8px",
          }}
        >
          <Layers style={{ color: "#4F46E5" }} size={24} />
          <h1
            style={{
              fontSize: "24px",
              fontWeight: "700",
              color: "#111827",
              margin: 0,
            }}
          >
            {project.name}
          </h1>
        </div>
        <p
          style={{
            color: "#4B5563",
            margin: 0,
            fontSize: "15px",
            lineHeight: "1.5",
          }}
        >
          {project.description ||
            "No extended manifest description has been supplied for this initiative tracking hub."}
        </p>
      </div>

      {/* Structured Isolation Table View Grid */}
      <div
        style={{
          backgroundColor: "#ffffff",
          border: "1px solid #E5E7EB",
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
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
            Project Scope Tasks ({tasks.length})
          </h2>
        </div>

        {tasks.length === 0 ? (
          <div
            style={{
              padding: "48px",
              textAlign: "center",
              color: "#6B7280",
              fontSize: "14px",
            }}
          >
            No task records have been instantiated under this project tracking
            channel yet.
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
                  <th style={{ padding: "12px 20px" }}>Action Item Title</th>
                  <th style={{ padding: "12px 20px" }}>Assigned Team</th>
                  <th style={{ padding: "12px 20px" }}>Workflow State</th>
                  <th style={{ padding: "12px 20px" }}>Effort Estimate</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr
                    key={task._id}
                    style={{ borderBottom: "1px solid #E5E7EB" }}
                  >
                    <td style={{ padding: "16px 20px" }}>
                      <span
                        style={{
                          fontWeight: "600",
                          color: "#111827",
                          fontSize: "14px",
                        }}
                      >
                        {task.name}
                      </span>
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
      </div>
    </div>
  )
}
