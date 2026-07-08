import styles from "../style/component_modules/CompressSidebar.module.css"
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

export default function CompressSidebar({ setCollapse }) {
  const navigate = useNavigate()

  const executeLogoutSequence = () => {
    localStorage.removeItem("token")

    navigate("/login")
  }

  const getNavLinkClass = ({ isActive }) =>
    `${styles.navLink} ${isActive ? styles.navLinkActive : ""}`

  return (
    <div
      className={styles.sidebarContainer}
      onMouseEnter={() => {
        setTimeout(() => {
          setCollapse(false)
        }, 300)
      }}
    >
      <div className={styles.logoWrapper}>
        <img className={styles.brandLogo} src={taskForgeLogo} alt="" />
      </div>

      <nav className={styles.navigationMenu}>
        <NavLink className={getNavLinkClass} to="/">
          <LayoutDashboard size={18} />
        </NavLink>

        <NavLink className={getNavLinkClass} to="/projects">
          <ClipboardMinus size={18} />
        </NavLink>

        <NavLink className={getNavLinkClass} to="/teams">
          <Users size={18} />
        </NavLink>

        <NavLink className={getNavLinkClass} to="/reports">
          <BarChart3 size={18} />
        </NavLink>

        <NavLink className={getNavLinkClass} to="/edit/profile">
          <Settings size={18} />
        </NavLink>
      </nav>

      <div className={styles.sidebarFooter}>
        <button className={styles.logoutBtn} onClick={executeLogoutSequence}>
          <LogOut size={14} />
        </button>
      </div>
    </div>
  )
}
