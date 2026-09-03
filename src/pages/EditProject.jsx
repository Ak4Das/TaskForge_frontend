import React, { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import { ArrowLeft, Save, AlertCircle, CheckCircle2 } from "lucide-react"
import styles from "../style/page_modules/EditProject.module.css"
import { fetchTheProject, updateProject } from "../../services/requestToServer"

export default function EditProject() {
  const { projectId } = useParams()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // Form Fields State
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [status, setStatus] = useState("To Do")

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true)
        setError("")

        const project = await fetchTheProject({
          setIsError: setError,
          id: projectId,
        })

        setName(project.name || "")
        setDescription(project.description || "")
        setStatus(project.status || "To Do")
      } catch (err) {
        console.error("Error fetching project details:", err)
        setError("Failed to load project details.")
      } finally {
        setLoading(false)
      }
    }

    fetchProject()
  }, [projectId])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim()) return

    setSubmitting(true)
    setError("")
    setSuccess("")

    try {
      const payload = {
        name: name.trim(),
        description: description.trim(),
        status,
      }

      const response = await updateProject({
        projectId,
        payload,
        setIsError: setError,
      })

      if (response) {
        setSuccess(`Project "${name}" updated successfully.`)
      }

      setTimeout(() => navigate("/projects"), 1200)
    } catch (err) {
      console.error("Error updating project:", err)
      setError(err.response?.data?.error || "Failed to update project.")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className={styles.loadingText}>Loading project configuration...</div>
    )
  }

  return (
    <div className={styles.container}>
      <button onClick={() => navigate(-1)} className={styles.backButton}>
        <ArrowLeft size={16} /> Discard Modifications & Go Back
      </button>

      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Edit Project Settings</h1>
          <p className={styles.subtitle}>
            Modify key project metadata, lifecycle status, and scope
            descriptions.
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

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Project Title</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Mobile Application V2"
              className={styles.input}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Project Scope & Description</label>
            <textarea
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detail the overarching objectives and deliverables..."
              className={styles.textarea}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Lifecycle Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className={styles.select}
            >
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Blocked">Blocked</option>
            </select>
          </div>

          <div className={styles.actionRow}>
            <button
              type="button"
              onClick={() => navigate("/projects")}
              disabled={submitting}
              className={styles.cancelBtn}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !name.trim()}
              className={styles.submitBtn}
            >
              <Save size={16} />
              {submitting ? "Saving Changes..." : "Save Updates"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
