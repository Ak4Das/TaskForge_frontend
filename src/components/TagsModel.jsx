import styles from "../style/component_modules/TagsModel.module.css"
import React, { useState } from "react"
import axios from "axios"
import { X, Tag, AlertCircle, CheckCircle2, CircleCheckBig } from "lucide-react"
import { createTags } from "../../services/requestToServer"

export default function TagsModel({ setTagsModalVisibilityState, fetchData }) {
  const [tagName, setTagName] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setIsError] = useState("")

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    const cleanName = tagName.trim()
    const laterPart = cleanName.slice(1)
    const finalName = cleanName[0].toUpperCase() + laterPart

    setSubmitting(true)

    try {
      const response = await createTags({
        body: {
          name: finalName,
        },
        setIsError,
      })

      if (response) {
        setSuccess("Tag Created Successfully")
      }

      setTimeout(() => {
        setTagsModalVisibilityState(false)
        fetchData()
      }, 1000)
    } catch (error) {
      if (import.meta.env.VITE_MODE === "DEVELOPMENT") {
        console.error(error)
      }
      setIsError(error.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modalCard}>
        <div className={styles.header}>
          <div className={styles.titleBlock}>
            <Tag className={styles.titleIcon} size={18} />
            <h2 className={styles.titleText}>Create Workspace Tag</h2>
          </div>
          <button
            className={styles.closeButton}
            onClick={() => setTagsModalVisibilityState(false)}
          >
            <X size={18} />
          </button>
        </div>

        <form className={styles.form} onSubmit={handleFormSubmit}>
          {success && (
            <div className={styles.successAlert}>
              <CircleCheckBig size={16} style={{ flexShrink: 0 }} />
              <span>{success}</span>
            </div>
          )}

          {error && (
            <div className={styles.errorAlert}>
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className={styles.label}>Tag Label Identifier</label>
            <input
              className={styles.inputField}
              type="text"
              required
              disabled={submitting}
              value={tagName}
              onChange={(e) => setTagName(e.target.value)}
              placeholder="e.g., Bug, Decision, Urgent etc."
            />
          </div>

          <div className={styles.actionsContainer}>
            <button
              className={styles.cancelButton}
              type="button"
              onClick={() => setTagsModalVisibilityState(false)}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              className={styles.submitButton}
              type="submit"
              disabled={submitting}
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
