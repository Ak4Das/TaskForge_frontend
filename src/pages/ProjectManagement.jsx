import React, { useState, useEffect } from "react"
import axios from "axios"
import { FolderKanban, Search, Calendar, ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"
import { fetchAllProjects } from "../../services/requestToServer"

export default function ProjectManagement() {
  const [projects, setProjects] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setIsError] = useState("")

  useEffect(() => {
    const fetchProjectsRegistry = async () => {
      try {
        setLoading(true)
        // Request projects with valid session authentication context tokens
        const response = await fetchAllProjects(setIsError)

        // Explicitly sort project data by 'createdAt' field in descending order (Latest First)
        const sortedLatestFirst = response.sort((a, b) => {
          return new Date(b.createdAt) - new Date(a.createdAt)
        })

        setProjects(sortedLatestFirst)
      } catch (err) {
        console.error("Error compiling projects listing matrix:", err)
        setIsError(
          "Could not retrieve active projects. Please check your network connection.",
        )
      } finally {
        setLoading(false)
      }
    }

    fetchProjectsRegistry()
  }, [])

  // Filter project cards context dynamically based on the input text
  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Helper utility to form clean local date string readouts
  const formatCreationDate = (dateString) => {
    if (!dateString) return "Recent"
    const dateObj = new Date(dateString)
    return dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div
      style={{
        padding: "32px",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* Top Section Headers */}
      <div style={{ marginBottom: "32px" }}>
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

      {/* Dynamic Filter Search Form Bar Layout */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          backgroundColor: "#ffffff",
          border: "1px solid #D1D5DB",
          borderRadius: "10px",
          padding: "10px 16px",
          maxWidth: "480px",
          marginBottom: "32px",
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

      {/* Error Banner States fallback */}
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

      {/* Grid Dynamic Collection Render Pass */}
      {loading ? (
        <div
          style={{
            textAlign: "center",
            padding: "60px 0",
            color: "#6B7280",
            fontSize: "15px",
          }}
        >
          Loading active project scopes...
        </div>
      ) : filteredProjects.length === 0 ? (
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
          {filteredProjects.map((project) => (
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
                {/* Meta Header */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    color: "#6B7280",
                    fontSize: "12px",
                    fontWeight: "500",
                    marginBottom: "12px",
                  }}
                >
                  <Calendar size={13} />
                  <span>Created: {formatCreationDate(project.createdAt)}</span>
                </div>

                {/* Project Title */}
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

                {/* Description Body text */}
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
                  {project.description ||
                    "No detailed overview description has been recorded for this scope initiative."}
                </p>
              </div>

              {/* Interaction Link Footer */}
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
    </div>
  )
}
