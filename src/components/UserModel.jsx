import styles from "../style/component_modules/UserModel.module.css"
import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import {
  UserPlus,
  ShieldAlert,
  CheckCircle2,
  ArrowLeft,
  Mail,
  User,
  Lock,
  X,
} from "lucide-react"
import { signUp } from "../../services/requestToServer"
import { useFormik } from "formik"
import { userSchema } from "../schemas/User.schema"

export default function UserModel({ setModalVisibilityState }) {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setIsError] = useState("")
  const [success, setSuccess] = useState("")

  const initialValues = {
    name: "",
    email: "",
    password: "",
  }

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: userSchema,
    enableReinitialize: true,
    onSubmit: async (values, action) => {
      try {
        setLoading(true)
        const response = await signUp({
          body: values,
          setIsError,
        })
        if (response && Object.keys(response).length) {
          setSuccess(
            `Account profile for "${values.name}" has been successfully created.`,
          )

          action.resetForm()

          setTimeout(() => {
            setModalVisibilityState(false)
          }, 1200)
        }
      } catch (error) {
        if (import.meta.env.VITE_MODE === "DEVELOPMENT") {
          console.error(error)
        }
        setIsError(error.message)
      } finally {
        setLoading(false)
      }
    },
  })

  const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    formik

  return (
    <div className={styles.overlay}>
      <div className={styles.modalCard}>
        <div className={styles.headerContainer}>
          <div className={styles.headerContent}>
            <div className={styles.iconWrapper}>
              <UserPlus size={24} />
            </div>
            <h1 className={styles.title}>New Team Member Profile</h1>
            <p className={styles.subtitle}>
              Register a team member directly into the team workspace index.
            </p>
          </div>
          <button
            className={styles.closeButton}
            onClick={() => setModalVisibilityState(false)}
          >
            <X size={20} />
          </button>
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
            <label className={styles.label}>Full Professional Name</label>
            <div className={styles.inputWrapper}>
              <User className={styles.inputIcon} size={16} />
              <input
                className={styles.inputField}
                type="text"
                required
                value={values.name}
                name="name"
                placeholder="e.g., Sarah Jenkins"
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

          <div>
            <label className={styles.label}>Enter Email Address</label>
            <div className={styles.inputWrapper}>
              <Mail className={styles.inputIcon} size={16} />
              <input
                className={styles.inputField}
                type="email"
                required
                value={values.email}
                name="email"
                placeholder="sarah.jenkins@example.com"
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </div>
            {errors.email && touched.email ? (
              <p className={`text-danger my-0 ${styles.errorText}`}>
                {errors.email}
              </p>
            ) : null}
          </div>

          <div>
            <label className={styles.label}>Enter Your Password</label>
            <div className={styles.inputWrapper}>
              <Lock className={styles.inputIcon} size={16} />
              <input
                className={styles.inputField}
                type="password"
                required
                value={values.password}
                name="password"
                placeholder="Minimum 6 characters"
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </div>
            {errors.password && touched.password ? (
              <p className={`text-danger my-0 ${styles.errorText}`}>
                {errors.password}
              </p>
            ) : null}
          </div>

          <button
            className={styles.submitButton}
            type="submit"
            disabled={loading}
          >
            {loading ? "Registering credentials..." : "Register Profile Node"}
          </button>
        </form>
      </div>
    </div>
  )
}
