import styles from "../style/page_modules/TeamManagement.module.css"
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
import { useFormik } from "formik"
import { editTeamSchema } from "../schemas/EditTeam.schema"

export default function TeamManagement() {
  const [teams, setTeams] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setIsError] = useState("")
  const [successMsg, setSuccessMsg] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  const initialValues = {
    name: "",
    description: "",
    members: [],
  }

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: editTeamSchema,
    enableReinitialize: true,
    onSubmit: async (values, action) => {
      try {
        setSubmitting(true)

        const response = await createTeam({
          body: values,
          setIsError,
        })

        if (response && Object.keys(response).length) {
          setSuccessMsg(`Team "${values.name}" created successfully.`)
          setTimeout(() => navigate("/teams"), 600)
        }
        await teamManagementContextData()
        action.resetForm()
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
    setFieldTouched,
    handleSubmit,
  } = formik

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

  return (
    <div className={`${styles.team_container}`}>
      <div className={`${styles.team_header}`}>
        <h1 className={`${styles.main_title}`}>Teams Management</h1>
        <p className={`${styles.sub_title}`}>
          View teams, assigned members and establish new team.
        </p>
      </div>

      {error && (
        <div className={`${styles.alert_message} ${styles.alert_error}`}>
          <ShieldAlert size={18} />
          <span>{error}</span>
        </div>
      )}
      {successMsg && (
        <div className={`${styles.alert_message} ${styles.alert_success}`}>
          <CheckCircle2 size={18} />
          <span>{successMsg}</span>
        </div>
      )}

      <div className={`${styles.workspace_grid}`}>
        <section className={`${styles.teams_card} ${styles.list_section}`}>
          <div className={`${styles.card_header}`}>
            <Users className={`${styles.brand_icon}`} size={18} />
            <h2 className={`${styles.section_title}`}>
              Active Departmental Scopes ({teams.length})
            </h2>
          </div>

          {loading ? (
            <div className={`${styles.loading_state}`}>
              Loading teams registry...
            </div>
          ) : teams.length === 0 ? (
            <div className={`${styles.empty_state}`}>
              No team registered in database records.
            </div>
          ) : (
            <div className={`${styles.teams_list_wrapper}`}>
              {teams.map((team) => (
                <div className={`${styles.team_row_item}`} key={team._id}>
                  <div className={`${styles.team_row_top}`}>
                    <Link
                      className={`${styles.team_link}`}
                      to={`/teams/${team._id}`}
                    >
                      <h3 className={`${styles.team_name_title}`}>
                        {team.name}
                      </h3>
                    </Link>
                    <span className={`${styles.members_counter_badge}`}>
                      {team.members?.length || 0}
                      {` `}
                      {team.members?.length === 1 ? "Member" : "Members"}
                    </span>
                  </div>
                  <p className={`${styles.team_description_text}`}>
                    {team.description}
                  </p>

                  {team.members && team.members.length > 0 && (
                    <div className={`${styles.member_tags_flexbox}`}>
                      {team.members.map((member, i) => {
                        const nameString =
                          typeof member === "object"
                            ? member.name
                            : users.find((u) => u._id === member)?.name ||
                              "Account Linked"
                        return (
                          <span className={`${styles.member_tag}`} key={i}>
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
          className={`${styles.create_teams_card} ${styles.form_section}`}
        >
          <div
            className={`${styles.create_teams_card_header} ${styles.border_bottom}`}
          >
            <PlusCircle
              className={`${styles.success_icon}`}
              size={18}
              style={{ color: "#059669" }}
            />
            <h2 className={`${styles.section_title}`}>Establish New Team</h2>
          </div>

          <form className={`${styles.creation_form}`} onSubmit={handleSubmit}>
            <div className={`${styles.form_group}`}>
              <label className={`${styles.form_label}`}>Team Name</label>
              <input
                className={`${styles.form_input}`}
                type="text"
                required
                value={values.name}
                name="name"
                placeholder="e.g., Quality Assurance"
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.name && touched.name ? (
                <p className={`text-danger my-0 ${styles.errorText}`}>
                  {errors.name}
                </p>
              ) : null}
            </div>

            <div className={`${styles.form_group}`}>
              <label className={`${styles.form_label}`}>
                Functional Scope Description
              </label>
              <textarea
                className={`${styles.form_textarea}`}
                rows="3"
                value={values.description}
                name="description"
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Outline responsibility metrics handled by this unit group..."
              />
              {errors.description && touched.description ? (
                <p className={`text-danger my-0 ${styles.errorText}`}>
                  {errors.description}
                </p>
              ) : null}
            </div>

            <div className={`${styles.form_group}`}>
              <label className={`${styles.form_label}`}>
                Assign Initial Team Members ({values.members.length} selected)
              </label>
              <div className={`${styles.checkbox_scrollbox}`}>
                {users.length === 0 ? (
                  <span className={`${styles.no_users_text}`}>
                    No registered users available.
                  </span>
                ) : (
                  users.map((u) => (
                    <label
                      className={`${styles.checkbox_label_item}`}
                      key={u._id}
                    >
                      <input
                        className={`${styles.custom_checkbox}`}
                        type="checkbox"
                        checked={values.members.includes(u._id)}
                        onChange={() => {
                          if (values.members.includes(u._id)) {
                            setFieldValue(
                              "members",
                              values.members.filter((id) => id !== u._id),
                            )
                          } else {
                            setFieldValue("members", [...values.members, u._id])
                          }
                        }}
                        onBlur={() => setFieldTouched("members", true)}
                      />
                      <span className={`${styles.user_info_text}`}>
                        {u.name}
                        {` `}
                        <span className={`${styles.user_email_subtext}`}>
                          ({u.email})
                        </span>
                      </span>
                    </label>
                  ))
                )}
              </div>
              {errors.members && touched.members ? (
                <p className={`text-danger my-0 ${styles.errorText}`}>
                  {errors.members}
                </p>
              ) : null}
            </div>

            <button
              className={`${styles.btn_submit_team}`}
              type="submit"
              disabled={submitting}
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
