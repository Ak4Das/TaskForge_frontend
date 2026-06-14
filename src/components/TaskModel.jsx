import React, { useState, useEffect } from "react"
import axios from "axios"
import { X } from "lucide-react"
import {
  createTask,
  fetchAllProjects,
  fetchTags,
  fetchTeams,
  fetchUsers,
} from "../../services/requestToServer"
import { useSearchParams } from "react-router-dom"
import TagsModel from "./TagsModel"

export default function TaskModal({ setModalVisibilityState, fetchData }) {
  const [formData, setFormData] = useState({
    name: "",
    project: "",
    team: "",
    owners: [],
    tags: "",
    timeToComplete: 1,
    status: "To Do",
  })
  const [projects, setProjects] = useState([])
  const [teams, setTeams] = useState([])
  const [users, setUsers] = useState([])
  const [tags, setTags] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [error, setIsError] = useState("")
  const [searchParams, setSearchParams] = useSearchParams()

  const isTagsModalOpen = searchParams.get("newTagsModal") === "true"

  const fetchFormContextDependencies = async () => {
    try {
      await Promise.all([
        fetchAllProjects({ setFunction: setProjects, setIsError }),
        fetchTeams({ setFunction: setTeams, setIsError }),
        fetchUsers({ setFunction: setUsers, setIsError }),
        fetchTags({ setFunction: setTags, setIsError }),
      ])
    } catch (error) {
      if (import.meta.env.VITE_MODE === "DEVELOPMENT") {
        console.error(error)
      }
      setIsError(error.message)
    }
  }

  useEffect(() => {
    fetchFormContextDependencies()
  }, [])

  // Change Tags modal open/close states directly with the browser URL parameters
  const setTagsModalVisibilityState = (isOpen) => {
    const updatedParams = new URLSearchParams(searchParams)
    if (isOpen) {
      updatedParams.set("newTagsModal", "true")
    } else {
      updatedParams.delete("newTagsModal")
    }
    setSearchParams(updatedParams)
  }

  const handleFormSubmission = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await createTask({
        body: formData,
        setIsError,
      })

      setModalVisibilityState(false)
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
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(17, 24, 39, 0.6)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        fontFamily: "-apple-system, sans-serif",
      }}
    >
      <div
        style={{
          backgroundColor: "#ffffff",
          width: "100%",
          maxWidth: "520px",
          borderRadius: "16px",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "20px 24px",
            borderBottom: "1px solid #E5E7EB",
          }}
        >
          <h3
            style={{
              fontSize: "18px",
              fontWeight: "600",
              color: "#111827",
              margin: 0,
            }}
          >
            Create New Task
          </h3>
          <button
            onClick={() => setModalVisibilityState(false)}
            style={{
              background: "none",
              border: "none",
              color: "#9CA3AF",
              cursor: "pointer",
              padding: "4px",
              borderRadius: "6px",
            }}
          >
            <X size={20} />
          </button>
        </div>

        <form
          onSubmit={handleFormSubmission}
          style={{
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <div>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "500",
                color: "#374151",
                marginBottom: "6px",
              }}
            >
              Task Title Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g., Fix auth failure edge cases"
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "10px 12px",
                border: "1px solid #D1D5DB",
                borderRadius: "8px",
                fontSize: "14px",
              }}
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
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#374151",
                  marginBottom: "6px",
                }}
              >
                Projects List
              </label>
              <select
                required
                onChange={(e) =>
                  setFormData({ ...formData, project: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  border: "1px solid #D1D5DB",
                  borderRadius: "8px",
                  fontSize: "14px",
                  backgroundColor: "#ffffff",
                }}
              >
                <option value="">-- Choose Project --</option>
                {projects.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#374151",
                  marginBottom: "6px",
                }}
              >
                Teams List
              </label>
              <select
                required
                onChange={(e) =>
                  setFormData({ ...formData, team: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  border: "1px solid #D1D5DB",
                  borderRadius: "8px",
                  fontSize: "14px",
                  backgroundColor: "#ffffff",
                }}
              >
                <option value="">-- Choose Team --</option>
                {teams.map((t) => (
                  <option key={t._id} value={t._id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "500",
                color: "#374151",
                marginBottom: "4px",
              }}
            >
              Task Owners Assigned (Hold Cmd/Ctrl to choose multiple)
            </label>
            <select
              multiple
              required
              onChange={(e) => {
                // Convert array like object to actual array
                const selectedOptions = Array.from(e.target.selectedOptions)

                const checkedOptionsArray = selectedOptions.map(
                  (opt) => opt.value,
                )

                setFormData({ ...formData, owners: checkedOptionsArray })
              }}
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "1px solid #D1D5DB",
                borderRadius: "8px",
                fontSize: "14px",
                minHeight: "80px",
                backgroundColor: "#ffffff",
              }}
            >
              {users.map((user) => (
                <option
                  key={user._id}
                  value={user._id}
                  style={{ marginBottom: "5px" }}
                >
                  {user.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#374151",
                  marginBottom: "6px",
                }}
              >
                Tags (Hold Cmd/Ctrl to choose multiple)
              </label>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => setTagsModalVisibilityState(true)}
                type="button"
              >
                Add New Tag
              </button>
            </div>
            <select
              multiple
              required
              onChange={(e) => {
                // Convert array like object to actual array
                const selectedOptions = Array.from(e.target.selectedOptions)

                const checkedOptionsArray = selectedOptions.map(
                  (opt) => opt.value,
                )
                setFormData({ ...formData, tags: checkedOptionsArray })
              }}
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "1px solid #D1D5DB",
                borderRadius: "8px",
                fontSize: "14px",
                minHeight: "80px",
                backgroundColor: "#ffffff",
              }}
            >
              {tags.map((tag) => (
                <option
                  key={tag._id}
                  value={tag._id}
                  style={{ marginBottom: "5px" }}
                >
                  {tag.name}
                </option>
              ))}
            </select>
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
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#374151",
                  marginBottom: "6px",
                }}
              >
                Estimated Effort (Days)
              </label>
              <input
                type="number"
                min="1"
                required
                value={formData.timeToComplete}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    timeToComplete: Number(e.target.value),
                  })
                }
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "10px 12px",
                  border: "1px solid #D1D5DB",
                  borderRadius: "8px",
                  fontSize: "14px",
                }}
              />
            </div>
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#374151",
                  marginBottom: "6px",
                }}
              >
                Initial Core Status
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  border: "1px solid #D1D5DB",
                  borderRadius: "8px",
                  fontSize: "14px",
                  backgroundColor: "#ffffff",
                }}
              >
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Blocked">Blocked</option>
              </select>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "12px",
              marginTop: "12px",
              borderTop: "1px solid #E5E7EB",
              paddingTop: "16px",
            }}
          >
            <button
              type="button"
              onClick={() => setModalVisibilityState(false)}
              style={{
                border: "1px solid #D1D5DB",
                background: "#ffffff",
                color: "#374151",
                padding: "10px 18px",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "500",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              style={{
                border: "none",
                background: "#4F46E5",
                color: "#ffffff",
                padding: "10px 20px",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              {submitting ? "Creating..." : "Create Assignment"}
            </button>
          </div>
        </form>
      </div>
      {isTagsModalOpen && (
        <TagsModel
          setTagsModalVisibilityState={setTagsModalVisibilityState}
          fetchData={fetchFormContextDependencies}
        />
      )}
    </div>
  )
}
