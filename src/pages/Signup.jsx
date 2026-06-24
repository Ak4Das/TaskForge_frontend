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
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#F9FAFB",
        fontFamily: "-apple-system, sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          padding: "32px",
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          border: "1px solid #E5E7EB",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <h2
            style={{
              fontSize: "24px",
              fontWeight: "700",
              color: "#111827",
              margin: "0 0 6px 0",
            }}
          >
            Join Workasana
          </h2>
          <p style={{ fontSize: "14px", color: "#4B5563", margin: 0 }}>
            Create your profile to start tracking metrics
          </p>
        </div>

        {error && (
          <div
            style={{
              backgroundColor: "#FEF2F2",
              border: "1px solid #FCA5A5",
              color: "#991B1B",
              padding: "10px 12px",
              borderRadius: "6px",
              fontSize: "13px",
              marginBottom: "16px",
            }}
          >
            {error}
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
              padding: "12px 14px",
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
          onSubmit={handleSubmit}
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
              Full Professional Name
            </label>
            <input
              type="text"
              required
              value={values.name}
              name="name"
              placeholder="e.g., Alex Rivera"
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "10px 12px",
                border: "1px solid #D1D5DB",
                borderRadius: "8px",
                fontSize: "14px",
              }}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.name && touched.name ? (
              <p
                className={`text-danger my-0`}
                style={{ fontSize: "12px", lineHeight: "15px" }}
              >
                {errors.name}
              </p>
            ) : null}
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
              Work Email Address
            </label>
            <input
              type="email"
              required
              value={values.email}
              name="email"
              placeholder="alex.rivera@workasana.com"
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "10px 12px",
                border: "1px solid #D1D5DB",
                borderRadius: "8px",
                fontSize: "14px",
              }}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.email && touched.email ? (
              <p
                className={`text-danger my-0`}
                style={{ fontSize: "12px", lineHeight: "15px" }}
              >
                {errors.email}
              </p>
            ) : null}
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
              Secure Passphrase
            </label>
            <input
              type="password"
              required
              value={values.password}
              name="password"
              placeholder="Min 6 characters"
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "10px 12px",
                border: "1px solid #D1D5DB",
                borderRadius: "8px",
                fontSize: "14px",
              }}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.password && touched.password ? (
              <p
                className={`text-danger my-0`}
                style={{ fontSize: "12px", lineHeight: "15px" }}
              >
                {errors.password}
              </p>
            ) : null}
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              border: "none",
              backgroundColor: "#4F46E5",
              color: "#ffffff",
              padding: "12px",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
              marginTop: "4px",
            }}
          >
            {loading ? "Creating account file..." : "Register Profile"}
          </button>
        </form>

        <div
          style={{
            textAlign: "center",
            marginTop: "20px",
            fontSize: "13px",
            color: "#4B5563",
          }}
        >
          Already signed up?{" "}
          <Link
            to="/login"
            style={{
              color: "#4F46E5",
              fontWeight: "500",
              textDecoration: "none",
            }}
          >
            Log in here
          </Link>
        </div>
      </div>
    </div>
  )
}
