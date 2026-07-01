import styles from "../style/page_modules/Signup.module.css"
import React, { useEffect, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import axios from "axios"
import { signUp } from "../../services/requestToServer"
import { toast } from "react-toastify"
import { useFormik } from "formik"
import { userSchema } from "../schemas/User.schema"
import { CheckCircle2 } from "lucide-react"

export default function Signup() {
  const [error, setIsError] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState("")
  const navigate = useNavigate()

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
          localStorage.setItem("token", response.token)
          localStorage.setItem("user", JSON.stringify(response.user))

          action.resetForm()

          setSuccess("Signup is Successful.")

          setTimeout(() => {
            navigate("/")
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

  useEffect(() => {
    if (error === "This email is already active.") {
      setTimeout(() => {
        navigate("/login")
      }, 1200)
    }
  }, [error])

  return (
    <div className={styles.signupContainer}>
      <div className={styles.signupCard}>
        <div className={styles.cardHeader}>
          <h2 className={styles.brandTitle}>Join Workasana</h2>
          <p className={styles.brandSubtitle}>
            Create your profile to start tracking metrics
          </p>
        </div>

        {error && <div className={styles.errorAlertBanner}>{error}</div>}

        {success && (
          <div className={styles.successAlertBanner}>
            <CheckCircle2 className={styles.successIcon} size={16} />
            <span>{success}</span>
          </div>
        )}

        <form className={styles.signupForm} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Full Professional Name</label>
            <input
              className={styles.formInput}
              type="text"
              required
              value={values.name}
              name="name"
              placeholder="e.g., Alex Rivera"
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.name && touched.name ? (
              <p className={styles.errorMessage} className={`text-danger my-0`}>
                {errors.name}
              </p>
            ) : null}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Work Email Address</label>
            <input
              className={styles.formInput}
              type="email"
              required
              value={values.email}
              name="email"
              placeholder="alex.rivera@workasana.com"
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.email && touched.email ? (
              <p className={styles.errorMessage} className={`text-danger my-0`}>
                {errors.email}
              </p>
            ) : null}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Secure Passphrase</label>
            <input
              className={styles.formInput}
              type="password"
              required
              value={values.password}
              name="password"
              placeholder="Min 6 characters"
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.password && touched.password ? (
              <p className={styles.errorMessage} className={`text-danger my-0`}>
                {errors.password}
              </p>
            ) : null}
          </div>

          <button className={styles.submitBtn} type="submit" disabled={loading}>
            {loading ? "Creating account file..." : "Register Profile"}
          </button>
        </form>

        <div className={styles.cardFooter}>
          Already signed up?{" "}
          <Link className={styles.loginLink} to="/login">
            Log in here
          </Link>
        </div>
      </div>
    </div>
  )
}
