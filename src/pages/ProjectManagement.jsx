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
        padding: "32px",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "32px",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "28px",
              fontWeight: "700",
              color: "#111827",
              margin: "0 0 6px 0",
            }}
          >
            Projects Workspace
          </h1>
          <p style={{ color: "#4B5563", margin: 0 }}>
            Review, search, and manage ongoing project initiatives across your
            company teams.
          </p>
        </div>
        <button
          onClick={() => setProjectModalVisibilityState(true)}
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
          <Plus size={18} /> Add New Project
        </button>
      </div>

      <div
        style={{
          display: "flex",
          gap: "25px",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "32px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "#ffffff",
            border: "1px solid #D1D5DB",
            borderRadius: "10px",
            padding: "10px 16px",
            minWidth: "400px",
            boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
          }}
        >
          <Search size={18} style={{ color: "#9CA3AF", marginRight: "10px" }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects by name..."
            style={{
              width: "100%",
              border: "none",
              outline: "none",
              fontSize: "14px",
              color: "#111827",
              backgroundColor: "transparent",
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              style={{
                background: "none",
                border: "none",
                color: "#6B7280",
                fontSize: "12px",
                cursor: "pointer",
                fontWeight: "500",
              }}
            >
              Clear
            </button>
          )}
        </div>
        <select
          value={projectStatus}
          onChange={(e) => setProjectStatus(e.target.value)}
          style={{
            padding: "10px 12px",
            border: "1px solid #D1D5DB",
            borderRadius: "8px",
            fontSize: "14px",
            backgroundColor: "#ffffff",
          }}
        >
          <option value="">--- Choose Status ---</option>
          <option value="">All</option>
          <option value="To Do">To Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
          <option value="Blocked">Blocked</option>
        </select>
      </div>

      {/* Error Banner */}
      {error && (
        <div
          style={{
            backgroundColor: "#FEF2F2",
            border: "1px solid #FCA5A5",
            color: "#991B1B",
            padding: "14px 16px",
            borderRadius: "8px",
            marginBottom: "24px",
            fontSize: "14px",
          }}
        >
          {error}
        </div>
      )}

      {loading ? (
        <div
          style={{
            textAlign: "center",
            padding: "60px 0",
            color: "#6B7280",
            fontSize: "15px",
          }}
        >
          Loading projects...
        </div>
      ) : finalProjects.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "60px 0",
            border: "2px dashed #E5E7EB",
            borderRadius: "12px",
            backgroundColor: "#ffffff",
          }}
        >
          <FolderKanban
            size={40}
            style={{ color: "#9CA3AF", marginBottom: "12px" }}
          />
          <h3
            style={{
              margin: "0 0 4px 0",
              fontSize: "16px",
              fontWeight: "600",
              color: "#374151",
            }}
          >
            No Projects Found
          </h3>
          <p style={{ margin: 0, color: "#6B7280", fontSize: "14px" }}>
            {searchQuery
              ? `No matching items found for "${searchQuery}"`
              : "Your project ecosystem is empty."}
          </p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: "24px",
          }}
        >
          {finalProjects.map((project) => (
            <div
              key={project._id}
              style={{
                backgroundColor: "#ffffff",
                border: "1px solid #E5E7EB",
                borderRadius: "14px",
                padding: "24px",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.02)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "between",
                position: "relative",
                transition: "box-shadow 0.2s",
              }}
            >
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "10px",
                    color: "#6B7280",
                    fontSize: "12px",
                    fontWeight: "500",
                    marginBottom: "12px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <Calendar size={13} />
                    <span style={{ marginTop: "2px" }}>
                      Created: {formatCreationDate(project.createdAt)}
                    </span>
                  </div>
                  <span style={getStatusBadgeStyle(project.status)}>
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

                <h2
                  style={{
                    fontSize: "18px",
                    fontWeight: "600",
                    color: "#111827",
                    margin: "0 0 10px 0",
                  }}
                >
                  {project.name}
                </h2>

                <p
                  style={{
                    fontSize: "14px",
                    color: "#4B5563",
                    lineHeight: "1.5",
                    margin: "0 0 24px 0",
                    display: "-webkit-box",
                    WebkitLineClamp: "3",
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {project.description}
                </p>
              </div>

              <div
                style={{
                  marginTop: "auto",
                  paddingTop: "16px",
                  borderTop: "1px solid #F3F4F6",
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <Link
                  to={`/projects/${project._id}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#4F46E5",
                    textDecoration: "none",
                    transition: "color 0.15s",
                  }}
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
