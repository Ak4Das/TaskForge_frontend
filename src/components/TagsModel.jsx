import React, { useState } from "react"
import axios from "axios"
import { X, Tag, AlertCircle, CheckCircle2 } from "lucide-react"
import { createTags } from "../../services/requestToServer"

export default function TagsModel({ setTagsModalVisibilityState, fetchData }) {
  const [tagName, setTagName] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setIsError] = useState("")

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    const cleanName = tagName.trim()

    setSubmitting(true)

    try {
      const config = {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }

      await createTags({
        body: {
          name: cleanName,
        },
        setIsError,
      })

      setTagsModalVisibilityState(false)
      fetchData()
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
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(15, 23, 42, 0.5)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1100,
        padding: "16px",
      }}
    >
      <div
        style={{
          backgroundColor: "#ffffff",
          width: "100%",
          maxWidth: "400px",
          borderRadius: "14px",
          boxShadow:
            "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "18px 24px",
            borderBottom: "1px solid #E5E7EB",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "#F9FAFB",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: "#111827",
            }}
          >
            <Tag size={18} style={{ color: "#4F46E5" }} />
            <h2 style={{ fontSize: "16px", fontWeight: "700", margin: 0 }}>
              Create Workspace Tag
            </h2>
          </div>
          <button
            onClick={() => setTagsModalVisibilityState(false)}
            style={{
              background: "none",
              border: "none",
              color: "#9CA3AF",
              cursor: "pointer",
              padding: "4px",
              borderRadius: "6px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background-color 0.15s",
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#E5E7EB")}
            onMouseLeave={(e) =>
              (e.target.style.backgroundColor = "transparent")
            }
          >
            <X size={18} />
          </button>
        </div>

        <form
          onSubmit={handleFormSubmit}
          style={{
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          {error && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                backgroundColor: "#FEF2F2",
                border: "1px solid #FCA5A5",
                color: "#991B1B",
                padding: "10px 12px",
                borderRadius: "6px",
                fontSize: "13px",
              }}
            >
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

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
              Tag Label Identifier
            </label>
            <input
              type="text"
              required
              disabled={submitting}
              value={tagName}
              onChange={(e) => setTagName(e.target.value)}
              placeholder="e.g., Bug, Decision, Urgent etc."
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "10px 12px",
                border: "1px solid #D1D5DB",
                borderRadius: "8px",
                fontSize: "14px",
                color: "#111827",
                outline: "none",
              }}
            />
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "12px",
              marginTop: "8px",
              paddingTop: "16px",
              borderTop: "1px solid #F3F4F6",
            }}
          >
            <button
              type="button"
              onClick={() => setTagsModalVisibilityState(false)}
              disabled={submitting}
              style={{
                backgroundColor: "#ffffff",
                border: "1px solid #D1D5DB",
                color: "#374151",
                padding: "8px 14px",
                borderRadius: "8px",
                fontSize: "13px",
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
                backgroundColor: "#4F46E5",
                border: "none",
                color: "#ffffff",
                padding: "8px 16px",
                borderRadius: "8px",
                fontSize: "13px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "background-color 0.15s",
              }}
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
