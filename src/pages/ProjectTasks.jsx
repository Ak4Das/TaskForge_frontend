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

  const getStatusClassName = (status) => {
    switch (status) {
      case "To Do":
        return "status-todo"
      case "In Progress":
        return "status-inprogress"
      case "Completed":
        return "status-completed"
      case "Blocked":
        return "status-blocked"
      default:
        return ""
    }
  }

  if (loading) {
    return <div className="loading-state">Loading tasks...</div>
  }

  if (error || !project) {
    return (
      <div className="error-wrapper">
        <div className="error-message">{error}</div>
        <Link className="back-link" to="/projects">
          <ArrowLeft size={16} /> Return to Projects Registry
        </Link>
      </div>
    )
  }

  return (
    <div className="project-tasks-container">
      <Link className="back-link" to="/projects">
        <ArrowLeft size={16} /> Back to Projects Track
      </Link>

      <div className="project-header-card">
        <div className="project-title-row">
          <Layers className="project-title-icon" size={24} />
          <h1 className="project-title">{project.name}</h1>
        </div>
        <p className="project-description">{project.description}</p>
      </div>
      <div className="controls-row">
        <div className="controls-group">
          <div className="control-label">
            <Filter size={16} />
            <span>Quick Filters:</span>
          </div>
          <select
            className="control-select"
            onChange={(e) => handleQuickFilterToggle(e.target.value)}
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
              className="control-select"
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
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
              className="control-select"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
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
      <div className="controls-row">
        <div className="controls-group">
          <div className="control-label">
            <ArrowUpDown size={16} />
            <span>Sort By:</span>
          </div>
          <select
            className="control-select"
            onChange={(e) => setPrioritySortOrder(e.target.value)}
          >
            <option value="">--- Priority ---</option>
            <option value="highToLow">High to Low</option>
            <option value="lowToHigh">Low to High</option>
            <option value="">Unsort</option>
          </select>
          {users.length !== 0 && (
            <select
              className="control-select"
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
            >
              <option value="">--- Due Date ---</option>
              <option value="highToLow">High to Low</option>
              <option value="lowToHigh">Low to High</option>
              <option value="">Unsort</option>
            </select>
          )}
        </div>
      </div>

      <div className="tasks-panel">
        <div className="panel-header">
          <h2 className="panel-title">Project Scope Tasks ({tasks.length})</h2>
          <button
            className="add-task-btn"
            onClick={() => setModalVisibilityState(true)}
          >
            <Plus size={18} /> Add New Task
          </button>
        </div>

        {tasks.length === 0 ? (
          <div className="empty-state">
            No task records have been initiated under this project.
          </div>
        ) : (
          <div className="table-container">
            <table className="tasks-table">
              <thead>
                <tr className="table-header-row">
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
                  <tr className="table-data-row" key={task._id}>
                    <td style={{ padding: "16px 20px" }}>
                      <Link
                        className="task-title-link"
                        to={`/tasks/${task._id}`}
                      >
                        {task.name}
                      </Link>
                      <div className="tag-list">
                        {task.tags?.map((tag, i) => (
                          <span className="task-tag" key={i}>
                            {tag.name}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td style={{ padding: "16px 20px" }} className="team-cell">
                      {task.team?.name || "Cross-Functional"}
                    </td>
                    <td style={{ padding: "16px 20px" }}>
                      <span
                        className={`status-badge ${getStatusClassName(task.status)}`}
                      >
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
                    <td style={{ padding: "16px 20px" }} className="team-cell">
                      {task.priority}
                    </td>
                    <td
                      style={{ padding: "16px 20px" }}
                      className="highlight-text"
                    >
                      {findDueDate(task.createdAt, task.timeToComplete)}
                    </td>
                    <td
                      style={{ padding: "16px 20px" }}
                      className="highlight-text"
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
