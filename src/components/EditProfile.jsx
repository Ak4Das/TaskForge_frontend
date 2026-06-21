import React, { useState, useEffect } from "react"
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

export default function EditProfile() {
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setIsError] = useState("")
  const [success, setSuccess] = useState("")

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  useEffect(() => {
    const fetchCurrentProfile = async () => {
      try {
        setLoading(true)

        const response = await fetchMe({ setIsError })

        setName(response.name || "")
        setEmail(response.email || "")
      } catch (error) {
        if (import.meta.env.VITE_MODE === "DEVELOPMENT") {
          console.error(error)
        }
        setIsError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchCurrentProfile()
  }, [])

  const handleProfileUpdateSubmit = async (e) => {
    e.preventDefault()

    if (newPassword) {
      if (newPassword.length < 6) {
        setIsError("Your new password must contain a minimum of 6 characters.")
        return
      }
      if (newPassword !== confirmPassword) {
        setIsError("The new password confirmation fields do not match.")
        return
      }
      if (!currentPassword) {
        setIsError(
          "You must input your current password to authorize security updates.",
        )
        return
      }
    }

    setSubmitting(true)

    try {
      const body = { name }
      if (newPassword) {
        body.currentPassword = currentPassword
        body.newPassword = newPassword
      }

      await updateUserProfile({ body, setIsError })

      setSuccess("Account profile successfully updated.")

      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (error) {
      if (import.meta.env.VITE_MODE === "DEVELOPMENT") {
        console.error(error)
      }
      setIsError(error.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div
        style={{
          padding: "40px",
          textAlign: "center",
          color: "#6B7280",
          fontFamily: "sans-serif",
        }}
      >
        Loading user's profile data...
      </div>
    )
  }

  return (
    <div
      style={{
        padding: "32px",
        maxWidth: "540px",
        margin: "0 auto",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <button
        onClick={() => navigate(-1)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          color: "#4F46E5",
          backgroundColor: "transparent",
          border: "none",
          fontSize: "14px",
          fontWeight: "600",
          marginBottom: "24px",
          cursor: "pointer",
        }}
      >
        <ArrowLeft size={16} /> Back to Dashboard
      </button>

      <div
        style={{
          backgroundColor: "#ffffff",
          border: "1px solid #E5E7EB",
          borderRadius: "16px",
          padding: "32px",
          boxShadow: "0 4px 6px -1px rgba(0,0,0,0.02)",
        }}
      >
        <div
          style={{
            marginBottom: "24px",
            borderBottom: "1px solid #F3F4F6",
            paddingBottom: "16px",
          }}
        >
          <h1
            style={{
              fontSize: "22px",
              fontWeight: "700",
              color: "#111827",
              margin: "0 0 6px 0",
            }}
          >
            Profile Settings
          </h1>
          <p style={{ fontSize: "14px", color: "#4B5563", margin: 0 }}>
            Manage your workspace persona name and protect your authentication
            password.
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
              padding: "12px",
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
              padding: "12px",
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
          onSubmit={handleProfileUpdateSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "20px" }}
        >
          {/* Email Identity (Read Only) */}
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
              Registered Email (Immutable)
            </label>
            <input
              type="text"
              disabled
              value={email}
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "10px 12px",
                border: "1px solid #E5E7EB",
                borderRadius: "8px",
                fontSize: "14px",
                backgroundColor: "#F3F4F6",
                color: "#6B7280",
                cursor: "not-allowed",
              }}
            />
          </div>

          {/* Profile Name Field */}
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
              Public Display Name
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
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "10px 12px 10px 38px",
                  border: "1px solid #D1D5DB",
                  borderRadius: "8px",
                  fontSize: "14px",
                  color: "#111827",
                }}
              />
            </div>
          </div>

          {/* Security Divider Break Option */}
          <div
            style={{
              borderTop: "1px solid #F3F4F6",
              paddingTop: "16px",
              marginTop: "8px",
            }}
          >
            <h3
              style={{
                fontSize: "14px",
                fontWeight: "600",
                color: "#111827",
                margin: "0 0 4px 0",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <KeyRound size={16} style={{ color: "#4F46E5" }} /> Update
              Security Access Password
            </h3>
            <p
              style={{
                fontSize: "12px",
                color: "#6B7280",
                margin: "0 0 16px 0",
              }}
            >
              Leave fields completely empty if you do not desire to change your
              security password.
            </p>
          </div>

          {/* New Password input */}
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
              New Passphrase
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
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Leave blank to preserve current password"
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "10px 12px 10px 38px",
                  border: "1px solid #D1D5DB",
                  borderRadius: "8px",
                  fontSize: "14px",
                }}
              />
            </div>
          </div>

          {/* Confirm New Password */}
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
              Verify New Passphrase
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
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your selection"
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "10px 12px 10px 38px",
                  border: "1px solid #D1D5DB",
                  borderRadius: "8px",
                  fontSize: "14px",
                }}
              />
            </div>
          </div>

          {/* Verification Anchor Requirement */}
          {newPassword && (
            <div
              style={{
                backgroundColor: "#FFFBEB",
                border: "1px solid #FDE68A",
                borderRadius: "8px",
                padding: "14px",
                animation: "fadeIn 0.2s",
              }}
            >
              <label
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "#92400E",
                  marginBottom: "6px",
                }}
              >
                Current Account Password Verification
              </label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Type your current access password"
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "10px 12px",
                  border: "1px solid #F59E0B",
                  borderRadius: "8px",
                  fontSize: "14px",
                }}
              />
            </div>
          )}

          {/* Submit Triggers */}
          <button
            type="submit"
            disabled={submitting}
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
              marginTop: "10px",
            }}
            onMouseEnter={(e) =>
              !submitting && (e.target.style.backgroundColor = "#4338CA")
            }
            onMouseLeave={(e) =>
              !submitting && (e.target.style.backgroundColor = "#4F46E5")
            }
          >
            <Save size={16} />
            {submitting ? "Syncing updates..." : "Commit Settings"}
          </button>
        </form>
      </div>
    </div>
  )
}
