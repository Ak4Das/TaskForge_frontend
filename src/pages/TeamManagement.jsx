import React, { useState, useEffect } from "react"
import axios from "axios"
import {
  Users,
  PlusCircle,
  ShieldAlert,
  CheckCircle2,
  UserPlus,
} from "lucide-react"
import {
  createTeam,
  fetchTeams,
  fetchUsers,
} from "../../services/requestToServer"
import { Link, useNavigate } from "react-router-dom"

export default function TeamManagement() {
  const [teams, setTeams] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setIsError] = useState("")
  const [successMsg, setSuccessMsg] = useState("")
  const [newTeamName, setNewTeamName] = useState("")
  const [newTeamDesc, setNewTeamDesc] = useState("")
  const [selectedMembers, setSelectedMembers] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (error === "Invalid Token.") {
      navigate("/login")
    }
  }, [error])

  const teamManagementContextData = async () => {
    try {
      setLoading(true)

      await Promise.all([
        fetchTeams({ setFunction: setTeams, setIsError }),
        fetchUsers({ setFunction: setUsers, setIsError }),
      ])
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
    teamManagementContextData()
  }, [])

  const handleMemberCheckboxToggle = (userId) => {
    if (selectedMembers.includes(userId)) {
      setSelectedMembers(selectedMembers.filter((id) => id !== userId))
    } else {
      setSelectedMembers([...selectedMembers, userId])
    }
  }

  const handleCreateTeamSubmit = async (e) => {
    e.preventDefault()

    setSubmitting(true)

    try {
      await createTeam({
        body: {
          name: newTeamName,
          description: newTeamDesc,
          members: selectedMembers,
        },
        setIsError,
      })

      setSuccessMsg(`${newTeamName} team created successfully.`)

      setNewTeamName("")
      setNewTeamDesc("")
      setSelectedMembers([])

      await teamManagementContextData()
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
        padding: "32px",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ marginBottom: "32px" }}>
        <h1
          style={{
            fontSize: "28px",
            fontWeight: "700",
            color: "#111827",
            margin: "0 0 6px 0",
          }}
        >
          Teams Management
        </h1>
        <p style={{ color: "#4B5563", margin: 0 }}>
          View teams, assigned members and establish new team.
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
            padding: "14px 16px",
            borderRadius: "8px",
            marginBottom: "24px",
            fontSize: "14px",
          }}
        >
          <ShieldAlert size={18} />
          <span>{error}</span>
        </div>
      )}
      {successMsg && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            backgroundColor: "#ECFDF5",
            border: "1px solid #A7F3D0",
            color: "#065F46",
            padding: "14px 16px",
            borderRadius: "8px",
            marginBottom: "24px",
            fontSize: "14px",
          }}
        >
          <CheckCircle2 size={18} />
          <span>{successMsg}</span>
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.2fr 1fr",
          gap: "32px",
          alignItems: "start",
        }}
      >
        <section
          style={{
            backgroundColor: "#ffffff",
            border: "1px solid #E5E7EB",
            borderRadius: "14px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "18px 24px",
              borderBottom: "1px solid #E5E7EB",
              backgroundColor: "#F9FAFB",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <Users size={18} style={{ color: "#4F46E5" }} />
            <h2
              style={{
                fontSize: "16px",
                fontWeight: "600",
                color: "#111827",
                margin: 0,
              }}
            >
              Active Departmental Scopes ({teams.length})
            </h2>
          </div>

          {loading ? (
            <div
              style={{ padding: "40px", textAlign: "center", color: "#6B7280" }}
            >
              Loading teams registry...
            </div>
          ) : teams.length === 0 ? (
            <div
              style={{
                padding: "40px",
                textAlign: "center",
                color: "#6B7280",
                fontSize: "14px",
              }}
            >
              No team registered in database records.
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                divideY: "1px solid #F3F4F6",
              }}
            >
              {teams.map((team) => (
                <div
                  key={team._id}
                  style={{
                    padding: "20px 24px",
                    borderBottom: "1px solid #F3F4F6",
                    transition: "background-color 0.15s",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "start",
                      marginBottom: "6px",
                    }}
                  >
                    <Link
                      to={`/teams/${team._id}`}
                      style={{ textDecoration: "none" }}
                    >
                      <h3
                        style={{
                          fontSize: "16px",
                          fontWeight: "600",
                          color: "#111827",
                          margin: 0,
                          color: "#0000ee",
                        }}
                      >
                        {team.name}
                      </h3>
                    </Link>
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: "600",
                        color: "#4F46E5",
                        backgroundColor: "#EEF2F6",
                        padding: "2px 8px",
                        borderRadius: "12px",
                      }}
                    >
                      {team.members?.length || 0}{" "}
                      {team.members?.length === 1 ? "Member" : "Members"}
                    </span>
                  </div>
                  <p
                    style={{
                      fontSize: "14px",
                      color: "#4B5563",
                      margin: "0 0 12px 0",
                      lineHeight: "1.4",
                    }}
                  >
                    {team.description}
                  </p>

                  {team.members && team.members.length > 0 && (
                    <div
                      style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}
                    >
                      {team.members.map((member, i) => {
                        const nameString =
                          typeof member === "object"
                            ? member.name
                            : users.find((u) => u._id === member)?.name ||
                              "Account Linked"
                        return (
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
                            {nameString}
                          </span>
                        )
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        <section
          style={{
            backgroundColor: "#ffffff",
            border: "1px solid #E5E7EB",
            borderRadius: "14px",
            padding: "24px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "20px",
              borderBottom: "1px solid #F3F4F6",
              paddingBottom: "12px",
            }}
          >
            <PlusCircle size={18} style={{ color: "#059669" }} />
            <h2
              style={{
                fontSize: "16px",
                fontWeight: "600",
                color: "#111827",
                margin: 0,
              }}
            >
              Establish New Team
            </h2>
          </div>

          <form
            onSubmit={handleCreateTeamSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
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
                Team Name
              </label>
              <input
                type="text"
                required
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
                placeholder="e.g., Quality Assurance"
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
                value={newTeamDesc}
                onChange={(e) => setNewTeamDesc(e.target.value)}
                placeholder="Outline responsibility metrics handled by this unit group..."
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "10px 12px",
                  border: "1px solid #D1D5DB",
                  borderRadius: "8px",
                  fontSize: "14px",
                  resize: "vertical",
                  fontFamily: "inherit",
                }}
              />
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
                Assign Initial Team Members ({selectedMembers.length} selected)
              </label>
              <div
                style={{
                  border: "1px solid #D1D5DB",
                  borderRadius: "8px",
                  maxHeight: "180px",
                  overflowY: "auto",
                  padding: "8px 12px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  backgroundColor: "#F9FAFB",
                }}
              >
                {users.length === 0 ? (
                  <span
                    style={{
                      fontSize: "13px",
                      color: "#9CA3AF",
                      fontStyle: "italic",
                    }}
                  >
                    No registered users available.
                  </span>
                ) : (
                  users.map((u) => (
                    <label
                      key={u._id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        fontSize: "13px",
                        color: "#374151",
                        cursor: "pointer",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={selectedMembers.includes(u._id)}
                        onChange={() => handleMemberCheckboxToggle(u._id)}
                        style={{
                          width: "15px",
                          height: "15px",
                          accentColor: "#4F46E5",
                          cursor: "pointer",
                        }}
                      />
                      <span>
                        {u.name}{" "}
                        <span style={{ color: "#9CA3AF", fontSize: "11px" }}>
                          ({u.email})
                        </span>
                      </span>
                    </label>
                  ))
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting || !newTeamName.trim()}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                border: "none",
                backgroundColor: "#4F46E5",
                color: "#ffffff",
                padding: "12px",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "background-color 0.15s",
                marginTop: "8px",
              }}
              onMouseEnter={(e) =>
                !submitting && (e.target.style.backgroundColor = "#4338CA")
              }
              onMouseLeave={(e) =>
                !submitting && (e.target.style.backgroundColor = "#4F46E5")
              }
            >
              <UserPlus size={16} />
              {submitting
                ? "Registering team unit..."
                : "Create Team Structure"}
            </button>
          </form>
        </section>
      </div>
    </div>
  )
}
