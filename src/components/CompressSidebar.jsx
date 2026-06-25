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
import taskForgeLogo from "../assets/TaskForge_Logo2.png"

export default function CompressSidebar() {
  const navigate = useNavigate()

  const executeLogoutSequence = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")

    navigate("/login")
  }

  return (
    <div
      style={{
        width: "75px",
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
      <div
        style={{
          paddingBlock: "12px",
          borderBottom: "1px solid #374151",
          backgroundColor: "#111827",
        }}
      >
        <img
          style={{
            width: "50px",
            backgroundColor: "#1F2937",
            display: "block",
            marginInline: "auto",
          }}
          src={taskForgeLogo}
          alt=""
        />
      </div>

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
            padding: "12px 16px",
            color: isActive ? "#ffffff" : "#9CA3AF",
            backgroundColor: isActive ? "#374151" : "transparent",
            borderRadius:"5px",
            textDecoration: "none",
            fontSize: "14px",
            fontWeight: "500",
          })}
        >
          <LayoutDashboard size={18} />
        </NavLink>

        <NavLink
          key="Projects"
          to="/projects"
          style={({ isActive }) => ({
            display: "flex",
            alignItems: "center",
            padding: "12px 16px",
            color: isActive ? "#ffffff" : "#9CA3AF",
            backgroundColor: isActive ? "#374151" : "transparent",
            borderRadius:"5px",
            textDecoration: "none",
            fontSize: "14px",
            fontWeight: "500",
          })}
        >
          <ClipboardMinus size={18} />
        </NavLink>

        <NavLink
          key="Teams Management"
          to="/teams"
          style={({ isActive }) => ({
            display: "flex",
            alignItems: "center",
            padding: "12px 16px",
            color: isActive ? "#ffffff" : "#9CA3AF",
            backgroundColor: isActive ? "#374151" : "transparent",
            borderRadius:"5px",
            textDecoration: "none",
            fontSize: "14px",
            fontWeight: "500",
          })}
        >
          <Users size={18} />
        </NavLink>

        <NavLink
          key="Analytics Reports"
          to="/reports"
          style={({ isActive }) => ({
            display: "flex",
            alignItems: "center",
            padding: "12px 16px",
            color: isActive ? "#ffffff" : "#9CA3AF",
            backgroundColor: isActive ? "#374151" : "transparent",
            borderRadius:"5px",
            textDecoration: "none",
            fontSize: "14px",
            fontWeight: "500",
          })}
        >
          <BarChart3 size={18} />
        </NavLink>

        <NavLink
          key="Settings"
          to="/settings"
          style={({ isActive }) => ({
            display: "flex",
            alignItems: "center",
            padding: "12px 16px",
            color: isActive ? "#ffffff" : "#9CA3AF",
            backgroundColor: isActive ? "#374151" : "transparent",
            borderRadius:"5px",
            textDecoration: "none",
            fontSize: "14px",
            fontWeight: "500",
          })}
        >
          <Settings size={18} />
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
        <button
          onClick={executeLogoutSequence}
          style={{
            display: "flex",
            alignItems: "center",
            padding: "12px 12px",
            color: "rgb(220, 53, 69)",
            backgroundColor: "transparent",
            borderRadius:"5px",
            textDecoration: "none",
            fontSize: "14px",
            fontWeight: "500",
          }}
        >
          <LogOut size={14} />
        </button>
      </div>
    </div>
  )
}
