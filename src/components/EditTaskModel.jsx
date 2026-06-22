import React, { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import {
  ArrowLeft,
  Save,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from "lucide-react"
import {
  fetchAllProjects,
  fetchTags,
  fetchTasksById,
  fetchTeams,
  fetchUsers,
  updateTask,
} from "../../services/requestToServer"
import { useFormik } from "formik"
import { taskSchema } from "../schemas/EditTask.schema"

export default function EditTask() {
  const { taskId } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setIsError] = useState("")
  const [success, setSuccess] = useState("")
  const [projects, setProjects] = useState([])
  const [teams, setTeams] = useState([])
  const [usersList, setUsersList] = useState([])
  const [tagsList, setTagsList] = useState([])
  const [name, setName] = useState("")
  const [project, setProject] = useState("")
  const [team, setTeam] = useState("")
  const [owners, setOwners] = useState([])
  const [tags, setTags] = useState([])
  const [timeToComplete, setTimeToComplete] = useState(1)
  const [status, setStatus] = useState("To Do")
  const [priority, setPriority] = useState("Medium")
  const [newOwners, setNewOwners] = useState([])
  const [newTags, setNewTags] = useState([])

  const initialValues = {
    name: name,
    project: project,
    team: team,
    owners: owners,
    tags: tags,
    status: status,
    priority: priority,
    timeToComplete: timeToComplete,
  }

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: taskSchema,
    enableReinitialize: true,
    onSubmit: async (values, action) => {
      try {
        setSubmitting(true)

        const response = await updateTask({ taskId, body: values, setIsError })
        if (response && Object.keys(response).length) {
          setSuccess("Task configurations have been successfully preserved.")
          setTimeout(() => navigate(`/tasks/${taskId}`), 1200)
        }
      } catch (error) {
        if (import.meta.env.VITE_MODE === "DEVELOPMENT") {
          console.error(error)
        }
        setIsError(error.message)
      } finally {
        setSubmitting(false)
      }
    },
  })

  const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    formik

  useEffect(() => {
    const fetchFormContextAndTask = async () => {
      try {
        setLoading(true)

        const [projectsRes, teamsRes, usersRes, tagsRes, taskRes] =
          await Promise.all([
            fetchAllProjects({ setFunction: setProjects, setIsError }),
            fetchTeams({ setFunction: setTeams, setIsError }),
            fetchUsers({ setFunction: setUsersList, setIsError }),
            fetchTags({ setFunction: setTagsList, setIsError }),
            fetchTasksById({ taskId, setIsError }),
          ])

        const task = taskRes
        setName(task.name || "")
        setProject(task.project?._id || task.project || "")
        setTeam(task.team?._id || task.team || "")
        setTimeToComplete(task.timeToComplete || 1)
        setStatus(task.status || "To Do")
        setPriority(task.priority || "Medium")

        if (task.owners) {
          setOwners(
            task.owners.map((owner) =>
              typeof owner === "object" ? owner._id : owner,
            ),
          )
          setNewOwners(
            task.owners.map((owner) =>
              typeof owner === "object" ? owner._id : owner,
            ),
          )
        }
        if (task.tags) {
          setTags(
            task.tags.map((tag) => (typeof tag === "object" ? tag._id : tag)),
          )
          setNewTags(
            task.tags.map((tag) => (typeof tag === "object" ? tag._id : tag)),
          )
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

    fetchFormContextAndTask()
  }, [taskId])

  const handleMultiSelectToggle = (id, selectedArray, setArrayTarget) => {
    if (selectedArray.includes(id)) {
      formik.setValues({
        name: values.name,
        project: values.project,
        team: values.team,
        owners:
          selectedArray === newOwners
            ? selectedArray.filter((item) => item !== id)
            : values.owners,
        tags:
          selectedArray === newTags
            ? selectedArray.filter((item) => item !== id)
            : values.tags,
        status: values.status,
        priority: values.priority,
        timeToComplete: values.timeToComplete,
      })
      setArrayTarget(selectedArray.filter((item) => item !== id))
    } else {
      formik.setValues({
        name: values.name,
        project: values.project,
        team: values.team,
        owners:
          selectedArray === newOwners ? [...selectedArray, id] : values.owners,
        tags: selectedArray === newTags ? [...selectedArray, id] : values.tags,
        status: values.status,
        priority: values.priority,
        timeToComplete: values.timeToComplete,
      })
      setArrayTarget([...selectedArray, id])
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
        Loading task profile and workspace records...
      </div>
    )
  }

  return (
    <div
      style={{
        padding: "32px",
        maxWidth: "640px",
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
        <ArrowLeft size={16} /> Discard & Return
      </button>

      <div
        style={{
          backgroundColor: "#ffffff",
          border: "1px solid #E5E7EB",
          borderRadius: "16px",
          padding: "32px",
          boxShadow: "0 4px 6px -1px rgba(0,0,0,0.02)",
        }}
      >
        <div
          style={{
            marginBottom: "24px",
            borderBottom: "1px solid #F3F4F6",
            paddingBottom: "16px",
          }}
        >
          <h1
            style={{
              fontSize: "22px",
              fontWeight: "700",
              color: "#111827",
              margin: "0 0 6px 0",
            }}
          >
            Modify Task Configuration
          </h1>
          <p style={{ fontSize: "14px", color: "#4B5563", margin: 0 }}>
            Update properties, handover to other teams, and update execution
            metrics.
          </p>
        </div>

        {error && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              backgroundColor: "#FEF2F2",
              border: "1px solid #FCA5A5",
              color: "#991B1B",
              padding: "12px",
              borderRadius: "8px",
              marginBottom: "20px",
              fontSize: "13px",
            }}
          >
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              backgroundColor: "#ECFDF5",
              border: "1px solid #A7F3D0",
              color: "#065F46",
              padding: "12px",
              borderRadius: "8px",
              marginBottom: "20px",
              fontSize: "13px",
            }}
          >
            <CheckCircle2 size={16} />
            <span>{success}</span>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "18px" }}
        >
          <div>
            <label
              style={{
                display: "block",
                fontSize: "13px",
                fontWeight: "500",
                color: "#374151",
                marginBottom: "6px",
              }}
            >
              Action Item Title
            </label>
            <input
              type="text"
              required
              value={values.name}
              name="name"
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "10px 12px",
                border: "1px solid #D1D5DB",
                borderRadius: "8px",
                fontSize: "14px",
              }}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
            }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: "500",
                  color: "#374151",
                  marginBottom: "6px",
                }}
              >
                Project Hub
              </label>
              <select
                value={values.project}
                name="project"
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "10px",
                  border: "1px solid #D1D5DB",
                  borderRadius: "8px",
                  fontSize: "14px",
                  backgroundColor: "#fff",
                }}
                onChange={handleChange}
                onBlur={handleBlur}
              >
                <option value="">Select Target Project...</option>
                {projects.map((project) => (
                  <option key={project._id} value={project._id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: "500",
                  color: "#374151",
                  marginBottom: "6px",
                }}
              >
                Department Team
              </label>
              <select
                value={values.team}
                name="team"
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "10px",
                  border: "1px solid #D1D5DB",
                  borderRadius: "8px",
                  fontSize: "14px",
                  backgroundColor: "#fff",
                }}
                onChange={handleChange}
                onBlur={handleBlur}
              >
                <option value="">Cross-Functional Unit...</option>
                {teams.map((team) => (
                  <option key={team._id} value={team._id}>
                    {team.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label
              style={{
                display: "block",
                fontSize: "13px",
                fontWeight: "500",
                color: "#374151",
                marginBottom: "6px",
              }}
            >
              Responsible Owners ({owners.length} bound)
            </label>
            <div
              style={{
                border: "1px solid #D1D5DB",
                borderRadius: "8px",
                maxHeight: "120px",
                overflowY: "auto",
                padding: "8px 12px",
                backgroundColor: "#F9FAFB",
                display: "flex",
                flexDirection: "column",
                gap: "6px",
              }}
            >
              {usersList.map((user) => (
                <label
                  key={user._id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "13px",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={newOwners.includes(user._id)}
                    onChange={() =>
                      handleMultiSelectToggle(user._id, newOwners, setNewOwners)
                    }
                  />
                  <span>
                    {user.name}
                    <span style={{ color: "#9CA3AF" }}>({user.email})</span>
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label
              style={{
                display: "block",
                fontSize: "13px",
                fontWeight: "500",
                color: "#374151",
                marginBottom: "6px",
              }}
            >
              Taxonomy Tags ({tags.length} selected)
            </label>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "8px",
                border: "1px solid #D1D5DB",
                borderRadius: "8px",
                padding: "10px",
                backgroundColor: "#F9FAFB",
              }}
            >
              {tagsList.map((tag) => {
                const tagId = tag._id
                const isChecked = newTags.includes(tagId)
                return (
                  <button
                    type="button"
                    key={tagId}
                    onClick={() =>
                      handleMultiSelectToggle(tagId, newTags, setNewTags)
                    }
                    style={{
                      border: "1px solid #D1D5DB",
                      background: isChecked ? "#EEF2F6" : "#ffffff",
                      color: isChecked ? "#1E40AF" : "#4B5563",
                      padding: "4px 10px",
                      borderRadius: "6px",
                      fontSize: "12px",
                      fontWeight: isChecked ? "600" : "400",
                      cursor: "pointer",
                    }}
                  >
                    {tag.name}
                  </button>
                )
              })}
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "16px",
            }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: "500",
                  color: "#374151",
                  marginBottom: "6px",
                }}
              >
                Workflow Status
              </label>
              <select
                value={values.status}
                name="status"
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "10px",
                  border: "1px solid #D1D5DB",
                  borderRadius: "8px",
                  fontSize: "13px",
                  backgroundColor: "#fff",
                }}
                onChange={handleChange}
                onBlur={handleBlur}
              >
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Blocked">Blocked</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: "500",
                  color: "#374151",
                  marginBottom: "6px",
                }}
              >
                Priority Grade
              </label>
              <select
                value={values.priority}
                name="priority"
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "10px",
                  border: "1px solid #D1D5DB",
                  borderRadius: "8px",
                  fontSize: "13px",
                  backgroundColor: "#fff",
                }}
                onChange={handleChange}
                onBlur={handleBlur}
              >
                <option value="Low">Low</option>
                <option value="High">High</option>
              </select>
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: "500",
                  color: "#374151",
                  marginBottom: "6px",
                }}
              >
                Time Allocation (Days)
              </label>
              <input
                type="number"
                min="1"
                value={values.timeToComplete}
                name="timeToComplete"
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "9px 10px",
                  border: "1px solid #D1D5DB",
                  borderRadius: "8px",
                  fontSize: "13px",
                }}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "12px",
              marginTop: "12px",
              paddingTop: "16px",
              borderTop: "1px solid #F3F4F6",
            }}
          >
            <button
              type="button"
              onClick={() => navigate(-1)}
              disabled={submitting}
              style={{
                backgroundColor: "#ffffff",
                border: "1px solid #D1D5DB",
                color: "#374151",
                padding: "10px 16px",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                backgroundColor: "#4F46E5",
                border: "none",
                color: "#ffffff",
                padding: "10px 20px",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              <Save size={16} />
              {submitting ? "Preserving changes..." : "Save Updates"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
