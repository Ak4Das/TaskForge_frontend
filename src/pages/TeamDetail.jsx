import React, { useState, useEffect } from "react"
import { useParams, Link, useSearchParams } from "react-router-dom"
import axios from "axios"
import {
  ArrowLeft,
  Users,
  Search,
  ArrowUpDown,
  Shield,
  CheckCircle2,
  AlertCircle,
  Plus,
} from "lucide-react"
import { fetchTasks, fetchTeamsById } from "../../services/requestToServer"
import UserModel from "../components/UserModel"

export default function TeamDetail() {
  const { teamId } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const [team, setTeam] = useState(null)
  const [membersData, setMembersData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setIsError] = useState("")
  const [searchName, setSearchName] = useState("")
  const [searchEmail, setSearchEmail] = useState("")
  const [filterRole, setFilterRole] = useState("All")

  const [sortColumn, setSortColumn] = useState("closedTasks")
  const [sortDirection, setSortDirection] = useState("desc")

  const isMemberModalOpen = searchParams.get("newMemberModal") === "true"

  useEffect(() => {
    const fetchTeamPerformanceMetrics = async () => {
      const config = {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
      try {
        setLoading(true)

        const currentTeam = await fetchTeamsById({
          teamId,
          setFunction: setTeam,
          setIsError,
        })

        if (!currentTeam) {
          setIsError("The requested team is not found.")
          setLoading(false)
          return
        }

        const globalTasks = await fetchTasks({
          taskEndpoint: "http://localhost:3000/api/tasks",
          setIsError,
        })

        const compiledMembers = currentTeam.members.map((member) => {
          const userId = member._id
          const userName = member.name
          const userEmail = member.email
          const role = member.role

          const userAssignments = globalTasks.filter((task) =>
            task.owners?.some((owner) => owner._id === userId),
          )

          const totalTasks = userAssignments.length
          const closedTasks = userAssignments.filter(
            (task) => task.status === "Completed",
          ).length
          const pendingTasks = totalTasks - closedTasks

          const completionRate =
            totalTasks > 0 ? Math.round((closedTasks / totalTasks) * 100) : 0

          return {
            id: userId,
            name: userName,
            email: userEmail,
            totalTasks,
            closedTasks,
            pendingTasks,
            completionRate,
            role,
          }
        })

        setMembersData(compiledMembers)
      } catch (error) {
        if (import.meta.env.VITE_MODE === "DEVELOPMENT") {
          console.error(error)
        }
        setIsError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchTeamPerformanceMetrics()
  }, [teamId])

  // Change project modal open/close states directly with the browser URL parameters
  const setMemberModalVisibilityState = (isOpen) => {
    // Create copy of existing searchParams
    const updatedParams = new URLSearchParams(searchParams)
    if (isOpen) {
      updatedParams.set("newMemberModal", "true")
    } else {
      updatedParams.delete("newMemberModal")
    }
    setSearchParams(updatedParams)
  }

  const requestSort = (column) => {
    let direction = "asc"
    if (sortColumn === column && sortDirection === "asc") {
      direction = "desc"
    }
    setSortColumn(column)
    setSortDirection(direction)
  }

  const filteredMembers = membersData.filter((member) => {
    const matchesName = member.name
      .toLowerCase()
      .includes(searchName.toLowerCase())
    const matchesEmail = member.email
      .toLowerCase()
      .includes(searchEmail.toLowerCase())
    const matchesRole = filterRole === "All" || member.role === filterRole
    return matchesName && matchesEmail && matchesRole
  })

  const sortedMembers = [...filteredMembers].sort((a, b) => {
    let valueA = a[sortColumn]
    let valueB = b[sortColumn]

    if (typeof valueA === "string") {
      valueA = valueA.toLowerCase()
      valueB = valueB.toLowerCase()
    }

    if (valueA < valueB) return sortDirection === "asc" ? -1 : 1
    if (valueA > valueB) return sortDirection === "asc" ? 1 : -1
    return 0
  })

  const renderSortIndicator = (columnKey) => {
    if (sortColumn !== columnKey) {
      return (
        <ArrowUpDown
          size={14}
          style={{ color: "#9CA3AF", marginLeft: "4px" }}
        />
      )
    }
    return sortDirection === "asc" ? " ↑" : " ↓"
  }

  if (loading) {
    return (
      <div
        style={{
          padding: "32px",
          textAlign: "center",
          color: "#6B7280",
          fontFamily: "sans-serif",
        }}
      >
        Loading team...
      </div>
    )
  }

  if (error || !team) {
    return (
      <div style={{ padding: "32px", fontFamily: "sans-serif" }}>
        <div
          style={{
            backgroundColor: "#FEF2F2",
            border: "1px solid #FCA5A5",
            color: "#991B1B",
            padding: "14px",
            borderRadius: "8px",
            marginBottom: "16px",
          }}
        >
          {error}
        </div>
        <Link
          to="/teams"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            color: "#4F46E5",
            textDecoration: "none",
          }}
        >
          <ArrowLeft size={16} /> Return to Directory
        </Link>
      </div>
    )
  }

  return (
    <div
      style={{
        padding: "32px",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <Link
        to="/teams"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          color: "#4F46E5",
          textDecoration: "none",
          fontSize: "14px",
          fontWeight: "600",
          marginBottom: "24px",
        }}
      >
        <ArrowLeft size={16} /> Back to Teams Management
      </Link>

      <button
        onClick={() => setMemberModalVisibilityState(true)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          backgroundColor: "#4F46E5",
          color: "#ffffff",
          border: "none",
          padding: "12px 20px",
          borderRadius: "8px",
          fontSize: "14px",
          fontWeight: "600",
          cursor: "pointer",
          transition: "background-color 0.2s",
          marginLeft: "auto",
          marginBottom: "25px",
        }}
      >
        <Plus size={18} /> Add New Member
      </button>

      <div
        style={{
          backgroundColor: "#ffffff",
          border: "1px solid #E5E7EB",
          borderRadius: "14px",
          padding: "24px",
          marginBottom: "32px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "8px",
          }}
        >
          <Users style={{ color: "#4F46E5" }} size={24} />
          <h1
            style={{
              fontSize: "24px",
              fontWeight: "700",
              color: "#111827",
              margin: 0,
            }}
          >
            {team.name}
          </h1>
        </div>
        <p style={{ color: "#4B5563", margin: 0, fontSize: "15px" }}>
          {team.description}
        </p>
      </div>

      <div
        style={{
          backgroundColor: "#ffffff",
          border: "1px solid #E5E7EB",
          borderRadius: "12px",
          padding: "20px",
          marginBottom: "24px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "16px",
          boxShadow: "0 1px 2px rgba(0,0,0,0.02)",
        }}
      >
        <div>
          <label
            style={{
              display: "block",
              fontSize: "12px",
              fontWeight: "600",
              color: "#4B5563",
              textTransform: "uppercase",
              marginBottom: "6px",
            }}
          >
            Filter by Members Name
          </label>
          <div
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Search
              size={14}
              style={{ position: "absolute", left: "10px", color: "#9CA3AF" }}
            />
            <input
              type="text"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              placeholder="Type name..."
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "8px 8px 8px 32px",
                border: "1px solid #D1D5DB",
                borderRadius: "6px",
                fontSize: "13px",
              }}
            />
          </div>
        </div>

        <div>
          <label
            style={{
              display: "block",
              fontSize: "12px",
              fontWeight: "600",
              color: "#4B5563",
              textTransform: "uppercase",
              marginBottom: "6px",
            }}
          >
            Filter by Email Address
          </label>
          <div
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Search
              size={14}
              style={{ position: "absolute", left: "10px", color: "#9CA3AF" }}
            />
            <input
              type="text"
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              placeholder="Type email address..."
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "8px 8px 8px 32px",
                border: "1px solid #D1D5DB",
                borderRadius: "6px",
                fontSize: "13px",
              }}
            />
          </div>
        </div>

        <div>
          <label
            style={{
              display: "block",
              fontSize: "12px",
              fontWeight: "600",
              color: "#4B5563",
              textTransform: "uppercase",
              marginBottom: "6px",
            }}
          >
            Filter By Members Role
          </label>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "8px",
              border: "1px solid #D1D5DB",
              borderRadius: "6px",
              fontSize: "13px",
              backgroundColor: "#ffffff",
              height: "35px",
            }}
          >
            <option value="All">--- Select Member Role ---</option>
            <option value="All">All Roles</option>
            <option value="Team Lead">Team Lead</option>
            <option value="Team Contributor">Team Contributor</option>
          </select>
        </div>
      </div>

      <div
        style={{
          backgroundColor: "#ffffff",
          border: "1px solid #E5E7EB",
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
        }}
      >
        {sortedMembers.length === 0 ? (
          <div
            style={{
              padding: "48px",
              textAlign: "center",
              color: "#6B7280",
              fontSize: "14px",
            }}
          >
            No registered team members satisfied the specified filter
            parameters.
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                textAlign: "left",
              }}
            >
              <thead>
                <tr
                  style={{
                    borderBottom: "1px solid #E5E7EB",
                    backgroundColor: "#F9FAFB",
                    color: "#374151",
                    fontSize: "12px",
                    fontWeight: "600",
                    textTransform: "uppercase",
                    userSelect: "none",
                  }}
                >
                  <th
                    onClick={() => requestSort("name")}
                    style={{
                      padding: "14px 20px",
                      cursor: "pointer",
                      hover: { background: "#F3F4F6" },
                    }}
                  >
                    <span
                      style={{ display: "inline-flex", alignItems: "center" }}
                    >
                      Member Name {renderSortIndicator("name")}
                    </span>
                  </th>
                  <th
                    onClick={() => requestSort("email")}
                    style={{ padding: "14px 20px", cursor: "pointer" }}
                  >
                    <span
                      style={{ display: "inline-flex", alignItems: "center" }}
                    >
                      Email Address {renderSortIndicator("email")}
                    </span>
                  </th>
                  <th
                    onClick={() => requestSort("role")}
                    style={{ padding: "14px 20px", cursor: "pointer" }}
                  >
                    <span
                      style={{ display: "inline-flex", alignItems: "center" }}
                    >
                      System Role {renderSortIndicator("role")}
                    </span>
                  </th>
                  <th
                    onClick={() => requestSort("totalTasks")}
                    style={{
                      padding: "14px 20px",
                      cursor: "pointer",
                      textAlign: "center",
                    }}
                  >
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      Total Tasks {renderSortIndicator("totalTasks")}
                    </span>
                  </th>
                  <th
                    onClick={() => requestSort("closedTasks")}
                    style={{
                      padding: "14px 20px",
                      cursor: "pointer",
                      textAlign: "center",
                    }}
                  >
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      Closed Tasks {renderSortIndicator("closedTasks")}
                    </span>
                  </th>
                  <th
                    onClick={() => requestSort("completionRate")}
                    style={{
                      padding: "14px 20px",
                      cursor: "pointer",
                      textAlign: "center",
                    }}
                  >
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      Efficiency {renderSortIndicator("completionRate")}
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedMembers.map((member) => (
                  <tr
                    key={member.id}
                    style={{
                      borderBottom: "1px solid #E5E7EB",
                      transition: "background-color 0.15s",
                    }}
                  >
                    <td
                      style={{
                        padding: "16px 20px",
                        fontWeight: "600",
                        color: "#111827",
                        fontSize: "14px",
                      }}
                    >
                      {member.name}
                    </td>
                    <td
                      style={{
                        padding: "16px 20px",
                        color: "#4B5563",
                        fontSize: "14px",
                      }}
                    >
                      {member.email}
                    </td>
                    <td style={{ padding: "16px 20px", fontSize: "13px" }}>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                          padding: "3px 8px",
                          borderRadius: "4px",
                          fontWeight: "500",
                          backgroundColor:
                            member.role === "Team Lead" ? "#F59E0B" : "#E5E7EB",
                          color:
                            member.role === "Team Lead" ? "#ffffff" : "#374151",
                        }}
                      >
                        {member.role === "Team Lead" && <Shield size={12} />}
                        {member.role}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: "16px 20px",
                        textAlign: "center",
                        color: "#111827",
                        fontSize: "14px",
                        fontWeight: "500",
                      }}
                    >
                      {member.totalTasks} tasks
                    </td>
                    <td style={{ padding: "16px 20px", textAlign: "center" }}>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                          color: "#059669",
                          fontWeight: "600",
                          fontSize: "14px",
                        }}
                      >
                        <CheckCircle2 size={13} />
                        {member.closedTasks}
                      </span>
                    </td>
                    <td style={{ padding: "16px 20px", textAlign: "center" }}>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "13px",
                            fontWeight: "700",
                            color:
                              member.completionRate > 70
                                ? "#059669"
                                : member.completionRate > 40
                                  ? "#F59E0B"
                                  : "#EF4444",
                          }}
                        >
                          {member.completionRate}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {isMemberModalOpen && (
        <UserModel setModalVisibilityState={setMemberModalVisibilityState} />
      )}
    </div>
  )
}
