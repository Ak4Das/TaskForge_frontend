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
    <div className="team_container">
      <div className="team_header">
        <h1 className="main_title">Teams Management</h1>
        <p className="sub_title">
          View teams, assigned members and establish new team.
        </p>
      </div>

      {error && (
        <div className="alert_message alert_error">
          <ShieldAlert size={18} />
          <span>{error}</span>
        </div>
      )}
      {successMsg && (
        <div className="alert_message alert_success">
          <CheckCircle2 size={18} />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="workspace_grid">
        <section className="teams_card list_section">
          <div className="card_header">
            <Users className="brand_icon" size={18} />
            <h2 className="section_title">
              Active Departmental Scopes ({teams.length})
            </h2>
          </div>

          {loading ? (
            <div className="loading_state">Loading teams registry...</div>
          ) : teams.length === 0 ? (
            <div className="empty_state">
              No team registered in database records.
            </div>
          ) : (
            <div className="teams_list_wrapper">
              {teams.map((team) => (
                <div className="team_row_item" key={team._id}>
                  <div className="team_row_top">
                    <Link className="team_link" to={`/teams/${team._id}`}>
                      <h3 className="team_name_title">{team.name}</h3>
                    </Link>
                    <span className="members_counter_badge">
                      {team.members?.length || 0}{" "}
                      {team.members?.length === 1 ? "Member" : "Members"}
                    </span>
                  </div>
                  <p className="team_description_text">{team.description}</p>

                  {team.members && team.members.length > 0 && (
                    <div className="member_tags_flexbox">
                      {team.members.map((member, i) => {
                        const nameString =
                          typeof member === "object"
                            ? member.name
                            : users.find((u) => u._id === member)?.name ||
                              "Account Linked"
                        return (
                          <span className="member_tag" key={i}>
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

        <section className="create_teams_card form_section">
          <div className="create_teams_card_header border_bottom">
            <PlusCircle
              className="success_icon"
              size={18}
              style={{ color: "#059669" }}
            />
            <h2 className="section_title">Establish New Team</h2>
          </div>

          <form className="creation_form" onSubmit={handleCreateTeamSubmit}>
            <div className="form_group">
              <label className="form_label">Team Name</label>
              <input
                className="form_input"
                type="text"
                required
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
                placeholder="e.g., Quality Assurance"
              />
            </div>

            <div className="form_group">
              <label className="form_label">Functional Scope Description</label>
              <textarea
                className="form_textarea"
                rows="3"
                value={newTeamDesc}
                onChange={(e) => setNewTeamDesc(e.target.value)}
                placeholder="Outline responsibility metrics handled by this unit group..."
              />
            </div>

            <div className="form_group">
              <label className="form_label">
                Assign Initial Team Members ({selectedMembers.length} selected)
              </label>
              <div className="checkbox_scrollbox">
                {users.length === 0 ? (
                  <span className="no_users_text">
                    No registered users available.
                  </span>
                ) : (
                  users.map((u) => (
                    <label className="checkbox_label_item" key={u._id}>
                      <input
                        className="custom_checkbox"
                        type="checkbox"
                        checked={selectedMembers.includes(u._id)}
                        onChange={() => handleMemberCheckboxToggle(u._id)}
                      />
                      <span className="user_info_text">
                        {u.name}{" "}
                        <span className="user_email_subtext">({u.email})</span>
                      </span>
                    </label>
                  ))
                )}
              </div>
            </div>

            <button
              className="btn_submit_team"
              type="submit"
              disabled={submitting || !newTeamName.trim()}
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
