import React, { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import {
  ArrowLeft,
  Save,
  Users,
  ShieldAlert,
  CheckCircle2,
  Search,
} from "lucide-react"
import {
  fetchTeams,
  fetchUsers,
  updateTeam,
} from "../../services/requestToServer"

export default function EditTeam() {
  const { teamId } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setIsError] = useState("")
  const [success, setSuccess] = useState("")
  const [usersList, setUsersList] = useState([])
  const [searchMemberQuery, setSearchMemberQuery] = useState("")
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [selectedMembers, setSelectedMembers] = useState([])

  useEffect(() => {
    const fetchTeamAndOrganizationUsers = async () => {
      try {
        setLoading(true)

        const [usersRes, teamsRes] = await Promise.all([
          fetchUsers({ setIsError }),
          fetchTeams({ setIsError }),
        ])

        setUsersList(usersRes.data.respondedData)

        const teamMatch = teamsRes.data.respondedData.find(
          (team) => team._id === teamId,
        )
        if (!teamMatch) {
          setIsError(
            "The requested team configuration profile could not be localized.",
          )
          setLoading(false)
          return
        }

        setName(teamMatch.name || "")
        setDescription(teamMatch.description || "")

        if (teamMatch.members) {
          setSelectedMembers(
            teamMatch.members.map((m) => (typeof m === "object" ? m._id : m)),
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

    fetchTeamAndOrganizationUsers()
  }, [teamId])

  const handleMemberCheckboxToggle = (userId) => {
    if (selectedMembers.includes(userId)) {
      setSelectedMembers(selectedMembers.filter((id) => id !== userId))
    } else {
      setSelectedMembers([...selectedMembers, userId])
    }
  }

  const filteredUsers = usersList.filter(
    (user) =>
      user.name.toLowerCase().includes(searchMemberQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchMemberQuery.toLowerCase()),
  )

  const handleEditTeamSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim()) return

    setSubmitting(true)

    try {
      const payload = {
        name: name.trim(),
        description: description.trim(),
        members: selectedMembers,
      }

      await updateTeam({ teamId, body: payload, setIsError })

      setSuccess(
        `Structural parameters for "${name}" have been successfully saved.`,
      )

      setTimeout(() => navigate("/teams"), 1200)
    } catch (error) {
      if (import.meta.env.VITE_MODE === "DEVELOPMENT") {
        console.error(error)
      }
      setIsError(error.message)
    } finally {
      setSubmitting(false)
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
        Loading team parameters and staff directory files...
      </div>
    )
  }

  return (
    <div
      style={{
        padding: "32px",
        maxWidth: "600px",
        margin: "0 auto",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* Return Action Row */}
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
        <ArrowLeft size={16} /> Discard Modifications & Go Back
      </button>

      {/* Main Form Box Container */}
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
            Edit Team Properties
          </h1>
          <p style={{ fontSize: "14px", color: "#4B5563", margin: 0 }}>
            Update operational scopes, adjust departmental labels, and alter
            personnel assignments.
          </p>
        </div>

        {/* Action Status Banners */}
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
            <ShieldAlert size={16} style={{ flexShrink: 0 }} />
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
            <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
            <span>{success}</span>
          </div>
        )}

        <form
          onSubmit={handleEditTeamSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "18px" }}
        >
          {/* Team Name Input Field */}
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
              Team Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Quality Engineering"
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "10px 12px",
                border: "1px solid #D1D5DB",
                borderRadius: "8px",
                fontSize: "14px",
                color: "#111827",
              }}
            />
          </div>

          {/* Team Scope Description Textarea */}
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
              Functional Scope Description
            </label>
            <textarea
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Outline task scopes managed by this structural group unit..."
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "10px 12px",
                border: "1px solid #D1D5DB",
                borderRadius: "8px",
                fontSize: "14px",
                color: "#111827",
                resize: "vertical",
                fontFamily: "inherit",
                lineHeight: "1.4",
              }}
            />
          </div>

          {/* Team Member Rosters Checklist Block */}
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
                marginBottom: "8px",
              }}
            >
              <label
                style={{
                  fontSize: "13px",
                  fontWeight: "500",
                  color: "#374151",
                }}
              >
                Assigned Team Members ({selectedMembers.length} active)
              </label>
              <div style={{ position: "relative", width: "200px" }}>
                <Search
                  size={12}
                  style={{
                    position: "absolute",
                    left: "8px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#9CA3AF",
                  }}
                />
                <input
                  type="text"
                  placeholder="Search personnel..."
                  value={searchMemberQuery}
                  onChange={(e) => setSearchMemberQuery(e.target.value)}
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    padding: "4px 6px 4px 26px",
                    border: "1px solid #D1D5DB",
                    borderRadius: "6px",
                    fontSize: "12px",
                  }}
                />
              </div>
            </div>

            {/* Selection Checklist Box */}
            <div
              style={{
                border: "1px solid #D1D5DB",
                borderRadius: "8px",
                maxHeight: "180px",
                overflowY: "auto",
                padding: "10px 12px",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                backgroundColor: "#F9FAFB",
              }}
            >
              {filteredUsers.length === 0 ? (
                <span
                  style={{
                    fontSize: "13px",
                    color: "#9CA3AF",
                    fontStyle: "italic",
                  }}
                >
                  No matching personnel instances localized.
                </span>
              ) : (
                filteredUsers.map((user) => (
                  <label
                    key={user._id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      fontSize: "13px",
                      color: "#374151",
                      cursor: "pointer",
                      userSelect: "none",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedMembers.includes(user._id)}
                      onChange={() => handleMemberCheckboxToggle(user._id)}
                      style={{
                        width: "15px",
                        height: "15px",
                        accentColor: "#4F46E5",
                        cursor: "pointer",
                      }}
                    />
                    <span>
                      {user.name}{" "}
                      <span style={{ color: "#9CA3AF", fontSize: "11px" }}>
                        ({user.email})
                      </span>
                    </span>
                  </label>
                ))
              )}
            </div>
          </div>

          {/* Action Row Buttons */}
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
              onClick={() => navigate("/teams")}
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
              disabled={submitting || !name.trim()}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                border: "none",
                backgroundColor: "#4F46E5",
                color: "#ffffff",
                padding: "10px 20px",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "background-color 0.15s",
              }}
            >
              <Save size={16} />
              {submitting ? "Saving modifications..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
