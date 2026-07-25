import styles from "../style/page_modules/Login.module.css"
import React, { useContext, useEffect, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import axios from "axios"
import { fetchMe, login } from "../../services/requestToServer"
import { toast } from "react-toastify"
import { useFormik } from "formik"
import { loginSchema } from "../schemas/Login.schema"
import context from "../contexts/createContexts"
import { Eye, EyeOff } from "lucide-react"

export default function Login() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setIsError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const { user, setUser } = useContext(context)

  const initialValues = {
    email: "",
    password: "",
  }

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: loginSchema,
    enableReinitialize: true,
    onSubmit: async (values, action) => {
      try {
        setLoading(true)

        const response = await login({ body: values, setIsError })

        if (response) {
          localStorage.setItem("token", response.token)

          setSuccess("Login Successful")

          setTimeout(async () => {
            await fetchMe({ setFunction: setUser })
            navigate("/")
          }, 2000)
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

  const { values, errors, touched, handleChange, handleBlur, handleSubmit } =
    formik

  useEffect(() => {
    if (error === "User not found.") {
      toast("User not found please signup to continue.")
      navigate("/signup")
    }
  }, [error])

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <div className={styles.cardHeader}>
          <h2 className={styles.brandTitle}>TaskForge</h2>
          <p className={styles.brandSubtitle}>
            Log in to your system profile workspace
          </p>
        </div>

        {success && <div className={styles.successAlertBanner}>{success}</div>}

        {error && <div className={styles.errorAlertBanner}>{error}</div>}

        <form className={styles.loginForm} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Registered Email Address</label>
            <input
              className={styles.formInput}
              type="email"
              required
              value={values.email}
              name="email"
              placeholder="name@company.com"
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.email && touched.email ? (
              <p className={`text-danger my-0 ${styles.errorMessage}`}>
                {errors.email}
              </p>
            ) : null}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Security Password</label>
            <div
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
              }}
            >
              <input
                className={styles.formInput}
                type={showPassword ? "text" : "password"}
                required
                value={values.password}
                name="password"
                placeholder="••••••••"
                onChange={handleChange}
                onBlur={handleBlur}
                style={{ paddingRight: "40px", width: "100%" }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className={`${styles.showHidePasswordBtn}`}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && touched.password ? (
              <p className={`text-danger my-0 ${styles.errorMessage}`}>
                {errors.password}
              </p>
            ) : null}
          </div>

          <button className={styles.submitBtn} type="submit" disabled={loading}>
            {loading ? "Validating account..." : "Sign In"}
          </button>
        </form>

        <div className={styles.cardFooter}>
          Don't have an account?{" "}
          <Link className={styles.signupLink} to="/signup">
            Sign up here
          </Link>
        </div>
      </div>
    </div>
  )
}
