import styles from "../style/component_modules/Sidebar.module.css"
import React, { useContext } from "react"
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
import context from "../contexts/createContexts"

export default function Sidebar() {
  const navigate = useNavigate()

  const storedUserObj = Object.values(useContext(context))[0]

  const userMetadata = Object.keys(storedUserObj).length
    ? storedUserObj
    : { name: "Team Member" }

  const executeLogoutSequence = () => {
    localStorage.removeItem("token")

    navigate("/login")
  }

  const resolveNavLinkClass = ({ isActive }) =>
    `${styles.navLink} ${isActive ? styles.navLinkActive : ""}`

  return (
    <div className={styles.sidebar}>
      <div className={styles.headerArea}>
        <h2 className={styles.brandTitle}>Workasana</h2>
        <span className={styles.brandSubtitle}>Workspace Management</span>
      </div>

      <nav className={styles.navigationHub}>
        <NavLink className={resolveNavLinkClass} to="/">
          <LayoutDashboard size={18} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink className={resolveNavLinkClass} to="/projects">
          <ClipboardMinus size={18} />
          <span>Projects</span>
        </NavLink>

        <NavLink className={resolveNavLinkClass} to="/teams">
          <Users size={18} />
          <span>Teams Management</span>
        </NavLink>

        <NavLink className={resolveNavLinkClass} to="/reports">
          <BarChart3 size={18} />
          <span>Analytics Reports</span>
        </NavLink>

        <NavLink className={resolveNavLinkClass} to="/edit/profile">
          <Settings size={18} />
          <span>Settings</span>
        </NavLink>
      </nav>

      <div className={styles.footerArea}>
        <div className={styles.userProfileMeta}>
          <span className={styles.userName}>{userMetadata.name}</span>
          <span className={styles.userEmail}>
            {userMetadata.email || "online"}
          </span>
        </div>

        <button className={styles.logoutButton} onClick={executeLogoutSequence}>
          <LogOut size={14} />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  )
}
