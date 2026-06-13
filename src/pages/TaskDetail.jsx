import React, { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import axios from "axios"
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  AlertTriangle,
  HelpCircle,
  Folder,
  Users,
  User,
  Tag,
  CalendarDays,
  Clock3,
} from "lucide-react"
import { fetchTasksById, updateTask } from "../../services/requestToServer"

export default function TaskDetail() {
  const { taskId } = useParams()
  const navigate = useNavigate()
  const [task, setTask] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setIsError] = useState("")
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    if (error === "Invalid Token.") {
      navigate("/login")
    }
  }, [error])

  useEffect(() => {
    const fetchIndividualTaskData = async () => {
      try {
        setLoading(true)

        await fetchTasksById({
          taskId,
          setFunction: setTask,
          setIsError,
        })
      } catch (error) {
        if (import.meta.env.VITE_MODE === "DEVELOPMENT") {
          console.error(error)
        }
        setIsError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchIndividualTaskData()
  }, [taskId])

  const handleMarkAsComplete = async () => {
    try {
      setUpdating(true)

      await updateTask({
        taskId,
        body: {
          status: "Completed",
        },
        setFunction: setTask,
        setIsError,
      })
    } catch (error) {
      if (import.meta.env.VITE_MODE === "DEVELOPMENT") {
        console.error(error)
      }
      setIsError(error.message)
    } finally {
      setUpdating(false)
    }
  }

  function findRemainingDays(createdAt, allocatedTime) {
    const createdAtDay = new Date(createdAt)
    const today = new Date()
    const passedDay = (today - createdAtDay) / (1000 * 60 * 60 * 24)
    const remainingDays = allocatedTime - Math.floor(passedDay)
    return `${remainingDays} ${remainingDays === 1 ? "day" : "days"}`
  }

  function findDueDate(createdAt, allocatedTime) {
    const createdAtDay = new Date(createdAt)
    createdAtDay.setDate(createdAtDay.getDate() + allocatedTime)
    const dueDate = new Date(createdAtDay)
    return dueDate.toLocaleDateString()
  }

  // Status styling configurations lookup map block
  const getStatusBadgeStyle = (status) => {
    const base = {
      padding: "6px 14px",
      borderRadius: "20px",
      fontSize: "13px",
      fontWeight: "600",
      display: "inline-flex",
      alignItems: "center",
      gap: "6px",
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
          padding: "40px",
          textAlign: "center",
          color: "#6B7280",
          fontFamily: "sans-serif",
        }}
      >
        Loading task...
      </div>
    )
  }

  if (error || !task) {
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
            "The targeted assignment file could not be localized within active records."}
        </div>
        <Link
          to="/dashboard"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            color: "#4F46E5",
            textDecoration: "none",
            fontWeight: "500",
          }}
        >
          <ArrowLeft size={16} /> Return to Dashboard View
        </Link>
      </div>
    )
  }

  return (
    <div
      style={{
        padding: "32px",
        maxWidth: "800px",
        margin: "0 auto",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <button
        onClick={() => navigate(-1)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          color: "#4F46E5",
          backgroundColor: "transparent",
          border: "none",
          fontSize: "14px",
          fontWeight: "600",
          marginBottom: "24px",
          cursor: "pointer",
        }}
      >
        <ArrowLeft size={16} /> Return to Previous Workspace
      </button>

      <div
        style={{
          backgroundColor: "#ffffff",
          border: "1px solid #E5E7EB",
          borderRadius: "16px",
          boxShadow:
            "0 4px 6px -1px rgba(0,0,0,0.02), 0 2px 4px -1px rgba(0,0,0,0.01)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "28px 32px",
            borderBottom: "1px solid #F3F4F6",
            backgroundColor: "#F9FAFB",
          }}
        >
          <div style={{ marginBottom: "12px" }}>
            <span style={getStatusBadgeStyle(task.status)}>
              {task.status === "Completed" && <CheckCircle2 size={14} />}
              {task.status === "In Progress" && <Clock size={14} />}
              {task.status === "Blocked" && <AlertTriangle size={14} />}
              {task.status === "To Do" && <HelpCircle size={14} />}
              {task.status}
            </span>
          </div>
          <h1
            style={{
              fontSize: "24px",
              fontWeight: "700",
              color: "#111827",
              margin: 0,
              lineHeight: "1.3",
            }}
          >
            {task.name}
          </h1>
        </div>

        <div
          style={{
            padding: "32px",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "200px 1fr",
              alignItems: "center",
              borderBottom: "1px solid #F3F4F6",
              paddingBottom: "14px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: "#6B7280",
                fontSize: "14px",
                fontWeight: "500",
              }}
            >
              <Folder size={16} />
              <span>Project Context:</span>
            </div>
            <div
              style={{ fontSize: "15px", fontWeight: "600", color: "#111827" }}
            >
              {task.project?.name}
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "200px 1fr",
              alignItems: "center",
              borderBottom: "1px solid #F3F4F6",
              paddingBottom: "14px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: "#6B7280",
                fontSize: "14px",
                fontWeight: "500",
              }}
            >
              <Users size={16} />
              <span>Assigned Team:</span>
            </div>
            <div style={{ fontSize: "14px", color: "#374151" }}>
              {task.team?.name}
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "200px 1fr",
              alignItems: "start",
              borderBottom: "1px solid #F3F4F6",
              paddingBottom: "14px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: "#6B7280",
                fontSize: "14px",
                fontWeight: "500",
                marginTop: "2px",
              }}
            >
              <User size={16} />
              <span>Responsible Owners:</span>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {task.owners && task.owners.length > 0 ? (
                task.owners.map((owner) => (
                  <span
                    key={owner._id}
                    style={{
                      fontSize: "13px",
                      background: "#EEF2F6",
                      color: "#1E40AF",
                      padding: "4px 10px",
                      borderRadius: "6px",
                      fontWeight: "500",
                    }}
                  >
                    {owner.name} ({owner.email})
                  </span>
                ))
              ) : (
                <span
                  style={{
                    fontSize: "14px",
                    color: "#9CA3AF",
                    fontStyle: "italic",
                  }}
                >
                  No profile node targets bound.
                </span>
              )}
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "200px 1fr",
              alignItems: "center",
              borderBottom: "1px solid #F3F4F6",
              paddingBottom: "14px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: "#6B7280",
                fontSize: "14px",
                fontWeight: "500",
              }}
            >
              <CalendarDays size={16} />
              <span>Due Date:</span>
            </div>
            <div
              style={{ fontSize: "14px", fontWeight: "600", color: "#111827" }}
            >
              {findDueDate(task.createdAt, task.timeToComplete)}
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "200px 1fr",
              alignItems: "center",
              borderBottom: "1px solid #F3F4F6",
              paddingBottom: "14px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: "#6B7280",
                fontSize: "14px",
                fontWeight: "500",
              }}
            >
              <Clock3 size={16} />
              <span>Time Remaining:</span>
            </div>
            <div
              style={{ fontSize: "14px", fontWeight: "600", color: "#111827" }}
            >
              {findRemainingDays(task.createdAt, task.timeToComplete)}
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "200px 1fr",
              alignItems: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: "#6B7280",
                fontSize: "14px",
                fontWeight: "500",
              }}
            >
              <Tag size={16} />
              <span>Categorical Tags:</span>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {task.tags && task.tags.length > 0 ? (
                task.tags.map((tag, i) => (
                  <span
                    key={i}
                    style={{
                      fontSize: "12px",
                      background: "#F3F4F6",
                      color: "#4B5563",
                      padding: "4px 10px",
                      borderRadius: "6px",
                      border: "1px solid #E5E7EB",
                      fontWeight: "500",
                    }}
                  >
                    {tag.name}
                  </span>
                ))
              ) : (
                <span
                  style={{
                    fontSize: "14px",
                    color: "#9CA3AF",
                    fontStyle: "italic",
                  }}
                >
                  No catalog markers attached.
                </span>
              )}
            </div>
          </div>
        </div>

        {task.status !== "Completed" && (
          <div
            style={{
              padding: "24px 32px",
              borderTop: "1px solid #F3F4F6",
              backgroundColor: "#F9FAFB",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <button
              onClick={handleMarkAsComplete}
              disabled={updating}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                border: "none",
                backgroundColor: "#059669",
                color: "#ffffff",
                padding: "12px 24px",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "background-color 0.15s",
                boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
              }}
            >
              <CheckCircle2 size={16} />
              {updating ? "Updating state..." : "Mark as Complete"}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
