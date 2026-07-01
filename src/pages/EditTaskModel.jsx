import styles from "../style/page_modules/EditTaskModel.module.css"
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
  const [priority, setPriority] = useState("High")

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

  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    setFieldValue,
    handleSubmit,
  } = formik

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

        setName(task.name)
        setProject(task.project._id)
        setTeam(task.team._id)
        setTimeToComplete(task.timeToComplete)
        setStatus(task.status)
        setPriority(task.priority)

        setOwners(task.owners.map((owner) => owner._id))

        if (task.tags) {
          setTags(task.tags.map((tag) => tag._id))
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

  if (loading) {
    return (
      <div className={styles.loaderContainer}>
        Loading task profile and workspace records...
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <button className={styles.backButton} onClick={() => navigate(-1)}>
        <ArrowLeft size={16} /> Discard & Return
      </button>

      <div className={styles.formCard}>
        <div className={styles.formHeader}>
          <h1>Modify Task Configuration</h1>
          <p>
            Update properties, handover to other teams, and update execution
            metrics.
          </p>
        </div>

        {error && (
          <div className={styles.alertError}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className={styles.alertSuccess}>
            <CheckCircle2 size={16} />
            <span>{success}</span>
          </div>
        )}

        <form className={styles.taskForm} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>Action Item Title</label>
            <input
              className={styles.textInput}
              type="text"
              required
              value={values.name}
              name="name"
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.name && touched.name ? (
              <p
                className={`text-danger my-0`}
                style={{ fontSize: "12px", lineHeight: "15px" }}
              >
                {errors.name}
              </p>
            ) : null}
          </div>

          <div className={styles.gridLayoutTwo}>
            <div className={styles.formGroup}>
              <label>Project Hub</label>
              <select
                className={styles.selectInput}
                value={values.project}
                name="project"
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
              {errors.project && touched.project ? (
                <p
                  className={`text-danger my-0`}
                  style={{ fontSize: "12px", lineHeight: "15px" }}
                >
                  {errors.project}
                </p>
              ) : null}
            </div>

            <div className={styles.formGroup}>
              <label>Department Team</label>
              <select
                className={styles.selectInput}
                value={values.team}
                name="team"
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
              {errors.team && touched.team ? (
                <p
                  className={`text-danger my-0`}
                  style={{ fontSize: "12px", lineHeight: "15px" }}
                >
                  {errors.team}
                </p>
              ) : null}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Responsible Owners ({values.owners.length} bound)</label>
            <div className={styles.scrollContainer}>
              {usersList.map((user) => (
                <label className={styles.checkboxLabel} key={user._id}>
                  <input
                    type="checkbox"
                    checked={values.owners.includes(user._id)}
                    onChange={() => {
                      if (values.owners.includes(user._id)) {
                        setFieldValue(
                          "owners",
                          values.owners.filter((item) => item !== user._id),
                        )
                      } else {
                        setFieldValue("owners", [...values.owners, user._id])
                      }
                    }}
                  />
                  <span>
                    {" "}
                    {user.name} <span>({user.email})</span>
                  </span>
                </label>
              ))}
            </div>
            {errors.owners ? (
              <p
                className={`text-danger my-0`}
                style={{ fontSize: "12px", lineHeight: "15px" }}
              >
                {errors.owners}
              </p>
            ) : null}
          </div>

          <div className={styles.formGroup}>
            <label>Taxonomy Tags ({values.tags.length} selected)</label>
            <div className={styles.tagsContainer}>
              {tagsList.map((tag) => {
                const tagId = tag._id
                const isChecked = values.tags.includes(tagId)
                return (
                  <button
                    className={styles.tagButton}
                    type="button"
                    key={tagId}
                    onClick={() => {
                      if (values.tags.includes(tagId)) {
                        setFieldValue(
                          "tags",
                          values.tags.filter((item) => item !== tagId),
                        )
                      } else {
                        setFieldValue("tags", [...values.tags, tagId])
                      }
                    }}
                    style={{
                      background: isChecked ? "#EEF2F6" : "#ffffff",
                      color: isChecked ? "#1E40AF" : "#4B5563",
                      fontWeight: isChecked ? "600" : "400",
                    }}
                  >
                    {tag.name}
                  </button>
                )
              })}
            </div>
            {errors.tags ? (
              <p
                className={`text-danger my-0`}
                style={{ fontSize: "12px", lineHeight: "15px" }}
              >
                {errors.tags}
              </p>
            ) : null}
          </div>

          <div className={styles.gridLayoutThree}>
            <div className={styles.formGroup}>
              <label>Workflow Status</label>
              <select
                className={styles.selectInput}
                value={values.status}
                name="status"
                onChange={handleChange}
                onBlur={handleBlur}
              >
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Blocked">Blocked</option>
                <option value="Completed">Completed</option>
              </select>
              {errors.status && touched.status ? (
                <p
                  className={`text-danger my-0`}
                  style={{ fontSize: "12px", lineHeight: "15px" }}
                >
                  {errors.status}
                </p>
              ) : null}
            </div>

            <div className={styles.formGroup}>
              <label>Priority Grade</label>
              <select
                className={styles.selectInput}
                value={values.priority}
                name="priority"
                onChange={handleChange}
                onBlur={handleBlur}
              >
                <option value="Low">Low</option>
                <option value="High">High</option>
              </select>
              {errors.priority && touched.priority ? (
                <p
                  className={`text-danger my-0`}
                  style={{ fontSize: "12px", lineHeight: "15px" }}
                >
                  {errors.priority}
                </p>
              ) : null}
            </div>

            <div className={styles.formGroup}>
              <label>Time Allocation (Days)</label>
              <input
                className={styles.textInput}
                type="number"
                min="1"
                value={values.timeToComplete}
                name="timeToComplete"
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.timeToComplete && touched.timeToComplete ? (
                <p
                  className={`text-danger my-0`}
                  style={{ fontSize: "12px", lineHeight: "15px" }}
                >
                  {errors.timeToComplete}
                </p>
              ) : null}
            </div>
          </div>

          <div className={styles.actionRow}>
            <button
              className={styles.btnCancel}
              type="button"
              onClick={() => navigate(-1)}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              className={styles.btnSubmit}
              type="submit"
              disabled={submitting}
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
