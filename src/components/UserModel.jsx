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
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(17, 24, 39, 0.6)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        fontFamily: "-apple-system, sans-serif",
      }}
    >
      <div
        style={{
          backgroundColor: "#ffffff",
          border: "1px solid #E5E7EB",
          borderRadius: "16px",
          padding: "32px",
          boxShadow:
            "0 4px 6px -1px rgba(0,0,0,0.02), 0 2px 4px -1px rgba(0,0,0,0.01)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            padding: "20px 24px",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "28px" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                backgroundColor: "#EEF2F6",
                color: "#4F46E5",
                marginBottom: "12px",
              }}
            >
              <UserPlus size={24} />
            </div>
            <h1
              style={{
                fontSize: "22px",
                fontWeight: "700",
                color: "#111827",
                margin: "0 0 6px 0",
              }}
            >
              New Team Member Profile
            </h1>
            <p style={{ fontSize: "14px", color: "#4B5563", margin: 0 }}>
              Register a team member directly into the team workspace index.
            </p>
          </div>
          <button
            onClick={() => setModalVisibilityState(false)}
            style={{
              background: "none",
              border: "none",
              color: "#9CA3AF",
              cursor: "pointer",
              padding: "4px",
              borderRadius: "6px",
              position: "relative",
              right: "-25px",
              top: "-25px",
            }}
          >
            <X size={20} />
          </button>
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
              padding: "12px 14px",
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
          style={{ display: "flex", flexDirection: "column", gap: "18px" }}
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
            <div style={{ position: "relative" }}>
              <User
                size={16}
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#9CA3AF",
                }}
              />
              <input
                type="text"
                required
                value={values.name}
                name="name"
                placeholder="e.g., Sarah Jenkins"
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "10px 12px 10px 38px",
                  border: "1px solid #D1D5DB",
                  borderRadius: "8px",
                  fontSize: "14px",
                  color: "#111827",
                }}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </div>
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
              Enter Email Address
            </label>
            <div style={{ position: "relative" }}>
              <Mail
                size={16}
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#9CA3AF",
                }}
              />
              <input
                type="email"
                required
                value={values.email}
                name="email"
                placeholder="sarah.jenkins@example.com"
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "10px 12px 10px 38px",
                  border: "1px solid #D1D5DB",
                  borderRadius: "8px",
                  fontSize: "14px",
                  color: "#111827",
                }}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </div>
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
              Enter Your Password
            </label>
            <div style={{ position: "relative" }}>
              <Lock
                size={16}
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#9CA3AF",
                }}
              />
              <input
                type="password"
                required
                value={values.password}
                name="password"
                placeholder="Minimum 6 characters"
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "10px 12px 10px 38px",
                  border: "1px solid #D1D5DB",
                  borderRadius: "8px",
                  fontSize: "14px",
                  color: "#111827",
                }}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
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
              marginTop: "6px",
              boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
            }}
          >
            {loading ? "Registering credentials..." : "Register Profile Node"}
          </button>
        </form>
      </div>
    </div>
  )
}
