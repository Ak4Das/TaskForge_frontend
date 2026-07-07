import styles from "../style/page_modules/EditProfile.module.css"
import React, { useState, useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import {
  User,
  Lock,
  ShieldAlert,
  CheckCircle2,
  ArrowLeft,
  Save,
  KeyRound,
} from "lucide-react"
import { fetchMe, updateUserProfile } from "../../services/requestToServer"
import { useFormik } from "formik"
import { editProfileSchema } from "../schemas/EditProfile.schema"
import context from "../contexts/createContexts"

export default function EditProfile() {
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const [error, setIsError] = useState("")
  const [success, setSuccess] = useState("")

  const { user } = useContext(context)

  const initialValues = {
    name: user.name || "",
    newPassword: "",
    confirmPassword: "",
    currentPassword: "",
  }

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: editProfileSchema,
    enableReinitialize: true,
    onSubmit: async (values, action) => {
      try {
        setSubmitting(true)
        const body = {
          name: values.name,
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
        }

        const response = await updateUserProfile({ body, setIsError })

        if (response && Object.keys(response).length) {
          setSuccess("Account profile successfully updated.")
          setTimeout(() => window.location.reload(), 1200)
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

  if (Object.keys(user).length === 0) {
    return
  }

  return (
    <div className={styles.container}>
      <button className={styles.backButton} onClick={() => navigate("/")}>
        <ArrowLeft size={16} /> Back to Dashboard
      </button>

      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Profile Settings</h1>
          <p className={styles.subtitle}>
            Manage your workspace persona name and protect your authentication
            password.
          </p>
        </div>

        {error && (
          <div className={styles.alertError}>
            <ShieldAlert className={styles.icon} size={16} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className={styles.alertSuccess}>
            <CheckCircle2 className={styles.icon} size={16} />
            <span>{success}</span>
          </div>
        )}

        <form className={styles.form} onSubmit={handleSubmit}>
          <div>
            <label className={styles.label}>Registered Email (Immutable)</label>
            <input
              className={styles.inputDisabled}
              type="text"
              disabled
              value={user.email}
            />
          </div>

          <div>
            <label className={styles.label}>Public Display Name</label>
            <div className={styles.inputWrapper}>
              <User className={styles.inputIcon} size={16} />
              <input
                className={styles.inputField}
                type="text"
                required
                value={values.name}
                name="name"
                placeholder="Your full name"
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </div>
            {errors.name && touched.name ? (
              <p className={`text-danger my-0 ${styles.errorText}`}>
                {errors.name}
              </p>
            ) : null}
          </div>

          <div className={styles.securitySection}>
            <h3 className={styles.securityTitle}>
              <KeyRound className={styles.securityTitleIcon} size={16} /> Update
              Security Access Password
            </h3>
            <p className={styles.securitySubtitle}>
              Leave fields completely empty if you do not desire to change your
              security password.
            </p>
          </div>

          <div>
            <label className={styles.label}>New Passphrase</label>
            <div className={styles.inputWrapper}>
              <Lock className={styles.inputIcon} size={16} />
              <input
                className={styles.inputField}
                type="password"
                value={values.newPassword}
                name="newPassword"
                placeholder="Leave blank to preserve current password"
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </div>
            {errors.newPassword && touched.newPassword ? (
              <p className={`text-danger my-0 ${styles.errorText}`}>
                {errors.newPassword}
              </p>
            ) : null}
          </div>

          <div>
            <label className={styles.label}>Verify New Passphrase</label>
            <div className={styles.inputWrapper}>
              <Lock className={styles.inputIcon} size={16} />
              <input
                className={styles.inputField}
                type="password"
                value={values.confirmPassword}
                name="confirmPassword"
                placeholder="Confirm your selection"
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </div>
            {errors.confirmPassword && touched.confirmPassword ? (
              <p className={`text-danger my-0 ${styles.errorText}`}>
                {errors.confirmPassword}
              </p>
            ) : null}
          </div>

          {values.newPassword && (
            <div className={styles.verificationContainer}>
              <label className={styles.verificationLabel}>
                Current Account Password Verification
              </label>
              <input
                className={styles.verificationInput}
                type="password"
                required
                value={values.currentPassword}
                name="currentPassword"
                placeholder="Type your current access password"
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.currentPassword && touched.currentPassword ? (
                <p className={`text-danger my-0 ${styles.errorText}`}>
                  {errors.currentPassword}
                </p>
              ) : null}
            </div>
          )}

          <button
            className={styles.submitButton}
            type="submit"
            disabled={submitting}
          >
            <Save size={16} />
            {submitting ? "Syncing updates..." : "Commit Settings"}
          </button>
        </form>
      </div>
    </div>
  )
}
