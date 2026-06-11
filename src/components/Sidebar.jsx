import React from "react"
import { NavLink, useNavigate } from "react-router-dom"
import {
  LayoutDashboard,
  Users,
  BarChart3,
  FolderKanban,
  LogOut,
  ClipboardMinus,
  Settings,
} from "lucide-react"

export default function Sidebar() {
  const navigate = useNavigate()

  const storedUserObj = localStorage.getItem("user")
  const userMetadata = storedUserObj
    ? JSON.parse(storedUserObj)
    : { name: "Team Member" }

  const executeLogoutSequence = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")

    navigate("/login")
  }

  return (
    <div
      style={{
        width: "260px",
        height: "100vh",
        backgroundColor: "#1F2937",
        color: "#F9FAFB",
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
        position: "sticky",
        top: 0,
      }}
    >
      {/* Brand Context Header Area */}
      <div style={{ padding: "24px", borderBottom: "1px solid #374151" }}>
        <h2
          style={{
            fontSize: "20px",
            fontWeight: "700",
            color: "#ffffff",
            margin: 0,
            letterSpacing: "0.05em",
          }}
        >
          Workasana
        </h2>
        <span
          style={{
            fontSize: "11px",
            color: "#9CA3AF",
            textTransform: "uppercase",
            tracking: "0.1em",
          }}
        >
          Workspace Management
        </span>
      </div>

      {/* Navigation Router Paths Interceptor Hub */}
      <nav
        style={{
          flex: 1,
          padding: "20px 12px",
          display: "flex",
          flexDirection: "column",
          gap: "6px",
        }}
      >
        <NavLink
          key="Dashboard"
          to="/"
          style={({ isActive }) => ({
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "12px 16px",
            borderRadius: "8px",
            color: isActive ? "#ffffff" : "#9CA3AF",
            backgroundColor: isActive ? "#374151" : "transparent",
            textDecoration: "none",
            fontSize: "14px",
            fontWeight: "500",
            transition: "all 0.15s ease",
          })}
        >
          <LayoutDashboard size={18} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          key="Projects"
          to="/projects"
          style={({ isActive }) => ({
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "12px 16px",
            borderRadius: "8px",
            color: isActive ? "#ffffff" : "#9CA3AF",
            backgroundColor: isActive ? "#374151" : "transparent",
            textDecoration: "none",
            fontSize: "14px",
            fontWeight: "500",
            transition: "all 0.15s ease",
          })}
        >
          <ClipboardMinus size={18} />
          <span>Projects</span>
        </NavLink>

        <NavLink
          key="Teams Management"
          to="/teams"
          style={({ isActive }) => ({
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "12px 16px",
            borderRadius: "8px",
            color: isActive ? "#ffffff" : "#9CA3AF",
            backgroundColor: isActive ? "#374151" : "transparent",
            textDecoration: "none",
            fontSize: "14px",
            fontWeight: "500",
            transition: "all 0.15s ease",
          })}
        >
          <Users size={18} />
          <span>Teams Management</span>
        </NavLink>

        <NavLink
          key="Analytics Reports"
          to="/reports"
          style={({ isActive }) => ({
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "12px 16px",
            borderRadius: "8px",
            color: isActive ? "#ffffff" : "#9CA3AF",
            backgroundColor: isActive ? "#374151" : "transparent",
            textDecoration: "none",
            fontSize: "14px",
            fontWeight: "500",
            transition: "all 0.15s ease",
          })}
        >
          <BarChart3 size={18} />
          <span>Analytics Reports</span>
        </NavLink>

        <NavLink
          key="Settings"
          to="/settings"
          style={({ isActive }) => ({
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "12px 16px",
            borderRadius: "8px",
            color: isActive ? "#ffffff" : "#9CA3AF",
            backgroundColor: isActive ? "#374151" : "transparent",
            textDecoration: "none",
            fontSize: "14px",
            fontWeight: "500",
            transition: "all 0.15s ease",
          })}
        >
          <Settings size={18} />
          <span>Settings</span>
        </NavLink>
      </nav>

      <div
        style={{
          padding: "16px",
          borderTop: "1px solid #374151",
          backgroundColor: "#111827",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span
            style={{ fontSize: "14px", fontWeight: "600", color: "#ffffff" }}
          >
            {userMetadata.name}
          </span>
          <span
            style={{
              fontSize: "11px",
              color: "#9CA3AF",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {userMetadata.email || "online"}
          </span>
        </div>

        <button
          onClick={executeLogoutSequence}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            width: "100%",
            backgroundColor: "transparent",
            border: "1px solid #4B5563",
            color: "#F9FAFB",
            padding: "8px 12px",
            borderRadius: "6px",
            fontSize: "13px",
            fontWeight: "500",
            cursor: "pointer",
            transition: "background-color 0.15s",
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#991B1B")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "transparent")}
        >
          <LogOut size={14} />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  )
}
