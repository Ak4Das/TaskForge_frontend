import React, { useState, useEffect } from "react"
import { useParams, Link, useSearchParams, useNavigate } from "react-router-dom"
import axios from "axios"
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  AlertTriangle,
  HelpCircle,
  Layers,
  Plus,
  Filter,
  ArrowUpDown,
} from "lucide-react"
import {
  fetchAllProjects,
  fetchTags,
  fetchTasks,
  fetchUsers,
} from "../../services/requestToServer"
import TaskModal from "../components/TaskModel"

export default function ProjectTasks() {
  const { projectId } = useParams()
  const [project, setProject] = useState(null)
  const [tasks, setTasks] = useState([])
  const [users, setUsers] = useState([])
  const [tags, setTags] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setIsError] = useState("")
  const [searchParams, setSearchParams] = useSearchParams()
  const [owner, setOwner] = useState("")
  const [tag, setTag] = useState("")
  const [prioritySortOrder, setPrioritySortOrder] = useState("")
  const [dateSortOrder, setDateSortOrder] = useState("")
  const navigate = useNavigate()

  const currentStatusFilter = searchParams.get("status") || ""
  const isTaskModalOpen = searchParams.get("newTaskModal") === "true"

  useEffect(() => {
    if (error === "Invalid Token.") {
      navigate("/login")
    }
  }, [error])

  useEffect(() => {
    setLoading(true)
  }, [])

  const fetchProjectAndTasks = async () => {
    try {
      const projectRes = await fetchAllProjects({ setIsError })
      const currentProject = projectRes
        ? projectRes.find((project) => project._id === projectId)
        : {}
      setProject(currentProject)

      const taskEndpoint = currentStatusFilter
        ? owner
          ? tag
            ? prioritySortOrder
              ? `http://localhost:3000/api/tasks?project=${projectId}&status=${encodeURIComponent(currentStatusFilter)}&owner=${owner}&tags=${tag}&priorityOrder=${prioritySortOrder}`
              : `http://localhost:3000/api/tasks?project=${projectId}&status=${encodeURIComponent(currentStatusFilter)}&owner=${owner}&tags=${tag}`
            : prioritySortOrder
              ? `http://localhost:3000/api/tasks?project=${projectId}&status=${encodeURIComponent(currentStatusFilter)}&owner=${owner}&priorityOrder=${prioritySortOrder}`
              : `http://localhost:3000/api/tasks?project=${projectId}&status=${encodeURIComponent(currentStatusFilter)}&owner=${owner}`
          : tag
            ? prioritySortOrder
              ? `http://localhost:3000/api/tasks?project=${projectId}&status=${encodeURIComponent(currentStatusFilter)}&tags=${tag}&priorityOrder=${prioritySortOrder}`
              : `http://localhost:3000/api/tasks?project=${projectId}&status=${encodeURIComponent(currentStatusFilter)}&tags=${tag}`
            : prioritySortOrder
              ? `http://localhost:3000/api/tasks?project=${projectId}&status=${encodeURIComponent(currentStatusFilter)}&priorityOrder=${prioritySortOrder}`
              : `http://localhost:3000/api/tasks?project=${projectId}&status=${encodeURIComponent(currentStatusFilter)}`
        : owner
          ? tag
            ? prioritySortOrder
              ? `http://localhost:3000/api/tasks?project=${projectId}&owner=${owner}&tags=${tag}&priorityOrder=${prioritySortOrder}`
              : `http://localhost:3000/api/tasks?project=${projectId}&owner=${owner}&tags=${tag}`
            : prioritySortOrder
              ? `http://localhost:3000/api/tasks?project=${projectId}&owner=${owner}&priorityOrder=${prioritySortOrder}`
              : `http://localhost:3000/api/tasks?project=${projectId}&owner=${owner}`
          : tag
            ? prioritySortOrder
              ? `http://localhost:3000/api/tasks?project=${projectId}&tags=${tag}&priorityOrder=${prioritySortOrder}`
              : `http://localhost:3000/api/tasks?project=${projectId}&tags=${tag}`
            : prioritySortOrder
              ? `http://localhost:3000/api/tasks?project=${projectId}&priorityOrder=${prioritySortOrder}`
              : `http://localhost:3000/api/tasks?project=${projectId}`

      await fetchTasks({
        taskEndpoint,
        setFunction: setTasks,
        setIsError,
      })
      await fetchUsers({ setFunction: setUsers, setIsError })
      await fetchTags({ setFunction: setTags, setIsError })
    } catch (error) {
      if (import.meta.env.VITE_MODE === "DEVELOPMENT") {
        console.error(error)
      }
      setIsError(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProjectAndTasks()
  }, [currentStatusFilter, owner, tag, prioritySortOrder])

  // Update URL queries when a user selects a filter
  const handleQuickFilterToggle = (statusValue) => {
    // Create copy of existing searchParams
    const updatedParams = new URLSearchParams(searchParams)
    if (currentStatusFilter === statusValue || statusValue === "") {
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

  const finalTasks = tasks.map((task) => {
    const dueDate = findDueDate(task.createdAt, task.timeToComplete)
    return { ...task, dueDate }
  })

  function sortDueDateByAscOrder() {
    for (let i = 0; i < finalTasks.length; i++) {
      for (let j = i + 1; j < finalTasks.length; j++) {
        if (finalTasks[i].dueDate > finalTasks[j].dueDate) {
          const hold = finalTasks[i]
          finalTasks[i] = finalTasks[j]
          finalTasks[j] = hold
        }
      }
    }
    setTasks(finalTasks)
  }

  function sortDueDateByDescOrder() {
    for (let i = 0; i < finalTasks.length; i++) {
      for (let j = i + 1; j < finalTasks.length; j++) {
        if (finalTasks[i].dueDate < finalTasks[j].dueDate) {
          const hold = finalTasks[i]
          finalTasks[i] = finalTasks[j]
          finalTasks[j] = hold
        }
      }
    }
    setTasks(finalTasks)
  }

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
        Loading tasks...
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
          {error}
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
          {project.description}
        </p>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "10px",
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
          <select
            onChange={(e) => handleQuickFilterToggle(e.target.value)}
            style={{
              padding: "7px 10px",
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
          {users.length !== 0 && (
            <select
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
              style={{
                padding: "7px 10px",
                border: "1px solid #D1D5DB",
                borderRadius: "8px",
                fontSize: "14px",
                backgroundColor: "#ffffff",
              }}
            >
              <option value="">--- Choose Owner ---</option>
              <option value="">All</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name}
                </option>
              ))}
            </select>
          )}
          {tags.length !== 0 && (
            <select
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              style={{
                padding: "7px 10px",
                border: "1px solid #D1D5DB",
                borderRadius: "8px",
                fontSize: "14px",
                backgroundColor: "#ffffff",
              }}
            >
              <option value="">--- Choose Tags ---</option>
              <option value="">All</option>
              {tags.map((tag) => (
                <option key={tag._id} value={tag._id}>
                  {tag.name}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "10px",
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
            <ArrowUpDown size={16} />
            <span>Sort By:</span>
          </div>
          <select
            onChange={(e) => setPrioritySortOrder(e.target.value)}
            style={{
              padding: "7px 10px",
              border: "1px solid #D1D5DB",
              borderRadius: "8px",
              fontSize: "14px",
              backgroundColor: "#ffffff",
            }}
          >
            <option value="">--- Priority ---</option>
            <option value="highToLow">High to Low</option>
            <option value="lowToHigh">Low to High</option>
            <option value="">Unsort</option>
          </select>
          {users.length !== 0 && (
            <select
              onChange={(e) => {
                if (e.target.value === "highToLow") {
                  sortDueDateByDescOrder()
                } else if (e.target.value === "lowToHigh") {
                  sortDueDateByAscOrder()
                } else {
                  const taskEndpoint = `http://localhost:3000/api/tasks?project=${projectId}`
                  fetchTasks({
                    taskEndpoint,
                    setFunction: setTasks,
                    setIsError,
                  })
                }
              }}
              style={{
                padding: "7px 10px",
                border: "1px solid #D1D5DB",
                borderRadius: "8px",
                fontSize: "14px",
                backgroundColor: "#ffffff",
              }}
            >
              <option value="">--- Due Date ---</option>
              <option value="highToLow">High to Low</option>
              <option value="lowToHigh">Low to High</option>
              <option value="">Unsort</option>
            </select>
          )}
        </div>
      </div>

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
            padding: "10px 20px",
            borderBottom: "1px solid #E5E7EB",
            backgroundColor: "#F9FAFB",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
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

        {tasks.length === 0 ? (
          <div
            style={{
              padding: "48px",
              textAlign: "center",
              color: "#6B7280",
              fontSize: "14px",
            }}
          >
            No task records have been initiated under this project.
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
                  <th style={{ padding: "12px 20px" }}>Priority</th>
                  <th style={{ padding: "12px 20px" }}>Due Date</th>
                  <th style={{ padding: "12px 20px" }}>Remaining Days</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr
                    key={task._id}
                    style={{ borderBottom: "1px solid #E5E7EB" }}
                  >
                    <td style={{ padding: "16px 20px" }}>
                      <Link
                        to={`/tasks/${task._id}`}
                        style={{
                          fontWeight: "600",
                          textDecoration: "none",
                          color: "#0000ee",
                          fontSize: "14px",
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
                    <td style={{ padding: "16px 20px" }}>{task.priority}</td>
                    <td
                      style={{
                        padding: "16px 20px",
                        color: "#111827",
                        fontSize: "14px",
                        fontWeight: "500",
                      }}
                    >
                      {findDueDate(task.createdAt, task.timeToComplete)}
                    </td>
                    <td
                      style={{
                        padding: "16px 20px",
                        color: "#111827",
                        fontSize: "14px",
                        fontWeight: "500",
                      }}
                    >
                      {findRemainingDays(task.createdAt, task.timeToComplete)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isTaskModalOpen && (
        <TaskModal
          setModalVisibilityState={setModalVisibilityState}
          fetchData={fetchProjectAndTasks}
        />
      )}
    </div>
  )
}
