import styles from "../style/page_modules/EditTeam.module.css"
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
import { useFormik } from "formik"
import { editTeamSchema } from "../schemas/EditTeam.schema"

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

  const initialValues = {
    name: name,
    description: description,
    members: selectedMembers,
  }

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: editTeamSchema,
    enableReinitialize: true,
    onSubmit: async (values, action) => {
      try {
        setSubmitting(true)

        const response = await updateTeam({ teamId, body: values, setIsError })

        if (response && Object.keys(response).length) {
          setSuccess(`Team "${name}" have been successfully saved.`)
          setTimeout(() => navigate("/teams"), 600)
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
    const fetchTeamAndOrganizationUsers = async () => {
      try {
        setLoading(true)

        const [usersRes, teamsRes] = await Promise.all([
          fetchUsers({ setIsError }),
          fetchTeams({ setIsError }),
        ])

        setUsersList(usersRes)

        const teamMatch = teamsRes.find((team) => team._id === teamId)
        if (!teamMatch) {
          setIsError("Team not registered.")
          setLoading(false)
          return
        }

        setName(teamMatch.name || "")
        setDescription(teamMatch.description || "")
        setSelectedMembers(teamMatch.members || [])
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

  const filteredUsers = usersList.filter(
    (user) =>
      user.name.toLowerCase().includes(searchMemberQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchMemberQuery.toLowerCase()),
  )

  if (loading) {
    return (
      <div className={styles.loadingState}>
        Loading team parameters and staff directory files...
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <button className={styles.backButton} onClick={() => navigate(-1)}>
        <ArrowLeft size={16} /> Discard Modifications & Go Back
      </button>

      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Edit Team Properties</h1>
          <p className={styles.description}>
            Update team name, change functional scope description, and assign or
            remove team members.
          </p>
        </div>

        {error && (
          <div className={styles.errorAlert}>
            <ShieldAlert size={16} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className={styles.successAlert}>
            <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
            <span>{success}</span>
          </div>
        )}

        <form className={styles.form} onSubmit={handleSubmit}>
          <div>
            <label className={styles.label}>Team Name</label>
            <input
              className={styles.inputField}
              type="text"
              required
              value={values.name}
              name="name"
              placeholder="e.g., Quality Engineering"
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.name && touched.name ? (
              <p className={`text-danger my-0 ${styles.errorText}`}>
                {errors.name}
              </p>
            ) : null}
          </div>

          <div>
            <label className={styles.label}>Functional Scope Description</label>
            <textarea
              className={styles.textareaField}
              value={values.description}
              rows="3"
              name="description"
              placeholder="Outline task scopes managed by this structural group unit..."
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.description && touched.description ? (
              <p className={`text-danger my-0 ${styles.errorText}`}>
                {errors.description}
              </p>
            ) : null}
          </div>

          <div>
            <div className={styles.membersHeader}>
              <label className={styles.label}>
                Assigned Team Members ({values.members.length} active)
              </label>
              <div className={styles.searchContainer}>
                <Search className={styles.searchIcon} size={12} />
                <input
                  className={styles.searchInput}
                  type="text"
                  placeholder="Search member by name..."
                  value={searchMemberQuery}
                  onChange={(e) => setSearchMemberQuery(e.target.value)}
                />
              </div>
            </div>

            <div className={styles.membersList}>
              {filteredUsers.length === 0 ? (
                <span className={styles.noMembers}>
                  No matching personnel instances localized.
                </span>
              ) : (
                filteredUsers.map((user) => (
                  <label className={styles.memberLabel} key={user._id}>
                    <input
                      className={styles.checkboxInput}
                      type="checkbox"
                      checked={values.members.includes(user._id)}
                      onChange={() => {
                        if (values.members.includes(user._id)) {
                          setFieldValue(
                            "members",
                            values.members.filter((id) => id !== user._id),
                          )
                        } else {
                          setFieldValue("members", [
                            ...values.members,
                            user._id,
                          ])
                        }
                      }}
                    />
                    <span>
                      {user.name}{" "}
                      <span className={styles.emailText}>({user.email})</span>
                    </span>
                  </label>
                ))
              )}
            </div>
            {errors.members ? (
              <p className={`text-danger my-0 ${styles.errorText}`}>
                {errors.members}
              </p>
            ) : null}
          </div>

          <div className={styles.actionsContainer}>
            <button
              className={styles.cancelButton}
              type="button"
              onClick={() => navigate("/teams")}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              className={styles.saveButton}
              type="submit"
              disabled={submitting}
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
