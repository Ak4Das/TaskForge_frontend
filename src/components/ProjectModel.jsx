import styles from "../style/component_modules/ProjectModel.module.css"
import React, { useEffect, useState } from "react"
import axios from "axios"
import { X, FolderPlus, AlertCircle } from "lucide-react"
import { createProject } from "../../services/requestToServer"
import { useFormik } from "formik"
import { projectSchema } from "../schemas/Project.schema"

export default function ProjectModal({ setProjectModalVisibilityState }) {
  const [submitting, setSubmitting] = useState(false)
  const [error, setIsError] = useState("")

  const initialValues = {
    name: "",
    description: "",
  }

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: projectSchema,
    enableReinitialize: true,
    onSubmit: async (values, action) => {
      try {
        setSubmitting(true)
        const body = {
          name: values.name.trim(),
          description: values.description.trim(),
          status: "To Do",
        }
        const response = await createProject({
          body,
          setIsError,
        })
        if (response && Object.keys(response).length) {
          setProjectModalVisibilityState(false)
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

  return (
    <div className={styles.overlay}>
      <div className={styles.modalCard}>
        <div className={styles.header}>
          <div className={styles.titleBlock}>
            <FolderPlus size={20} style={{ color: "#4F46E5" }} />
            <h2 className={styles.title}>Initiate New Project</h2>
          </div>
          <button
            className={styles.closeButton}
            onClick={() => setProjectModalVisibilityState(false)}
          >
            <X size={18} />
          </button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          {error && (
            <div className={styles.errorAlert}>
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Project Name</label>
            <input
              className={styles.inputField}
              type="text"
              required
              value={values.name}
              name="name"
              placeholder="e.g., Workspace management for track projects..."
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.name && touched.name ? (
              <p
                className={`text-danger my-0 ${styles.errorText}`}
                className={`text-danger my-0`}
              >
                {errors.name}
              </p>
            ) : null}
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Project Description</label>
            <textarea
              className={styles.textareaField}
              rows="4"
              value={values.description}
              name="description"
              placeholder="Write project description here..."
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.description && touched.description ? (
              <p
                className={`text-danger my-0 ${styles.errorText}`}
                className={`text-danger my-0`}
              >
                {errors.description}
              </p>
            ) : null}
          </div>

          <div className={styles.actionsContainer}>
            <button
              className={styles.cancelButton}
              type="button"
              onClick={() => setProjectModalVisibilityState(false)}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              className={styles.submitButton}
              type="submit"
              disabled={submitting}
            >
              {submitting ? "Registering initiative..." : "Instantiate Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
