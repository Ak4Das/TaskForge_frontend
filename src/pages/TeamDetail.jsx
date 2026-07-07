import styles from "../style/page_modules/TeamDetail.module.css"
import React, { useState, useEffect } from "react"
import { useParams, Link, useSearchParams, useNavigate } from "react-router-dom"
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
  SquarePen,
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
  const navigate = useNavigate()

  const isMemberModalOpen = searchParams.get("newMemberModal") === "true"

  useEffect(() => {
    if (error === "Invalid Token.") {
      navigate("/login")
    }
  }, [error])

  useEffect(() => {
    const fetchTeamPerformanceMetrics = async () => {
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
          taskEndpoint: "https://workasana-backend-zeta.vercel.app/api/tasks",
          setIsError,
        })

        const compiledMembers = currentTeam.members.map((member) => {
          const userId = member._id
          const userName = member.name
          const userEmail = member.email
          const role = member.role

          const userAssignments =
            globalTasks &&
            globalTasks.filter((task) =>
              task.owners?.some((owner) => owner._id === userId),
            )

          const totalTasks = userAssignments ? userAssignments.length : 0
          const closedTasks = userAssignments
            ? userAssignments.filter((task) => task.status === "Completed")
                .length
            : 0
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
        <ArrowUpDown className={`${styles.sort_icon_placeholder}`} size={14} />
      )
    }
    return sortDirection === "asc" ? " ↑" : " ↓"
  }

  if (loading) {
    return (
      <div className={`${styles.team_detail_loading}`}>Loading team...</div>
    )
  }

  if (error || !team) {
    return (
      <div className={`${styles.team_detail_error_container}`}>
        <div className={`${styles.team_detail_error_banner}`}>{error}</div>
        <Link className={`${styles.team_detail_back_link}`} to="/teams">
          <ArrowLeft size={16} /> Return to Directory
        </Link>
      </div>
    )
  }

  return (
    <div className={`${styles.team_detail_container}`}>
      {` `}
      <div className={`${styles.team_detail_header_actions}`}>
        <Link
          className={`${styles.team_detail_back_link} ${styles.text_semibold}`}
          to="/teams"
        >
          <ArrowLeft size={16} /> Back to Teams Management
        </Link>

        <div className={`${styles.btn_wrapper}`}>
          <button
            className={`${styles.team_detail_add_btn}`}
            onClick={() => navigate(`/teams/edit/${teamId}`)}
          >
            <SquarePen size={18} /> Edit Team
          </button>
          <button
            className={`${styles.team_detail_add_btn}`}
            onClick={() => setMemberModalVisibilityState(true)}
          >
            <Plus size={18} /> Add New Member
          </button>
        </div>
      </div>
      <div className={`${styles.team_detail_card}`}>
        <div className={`${styles.team_card_title_row}`}>
          <Users className={`${styles.team_card_icon}`} size={24} />
          <h1 className={`${styles.team_card_title}`}>{team.name}</h1>
        </div>
        <p className={`${styles.team_card_desc}`}>{team.description}</p>
      </div>
      <div className={`${styles.team_detail_filters_grid}`}>
        <div className={`${styles.filter_group}`}>
          <label className={`${styles.filter_label}`}>
            Filter by Members Name
          </label>
          <div className={`${styles.search_input_wrapper}`}>
            <Search className={`${styles.search_input_icon}`} size={14} />
            <input
              className={`${styles.filter_input}`}
              type="text"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              placeholder="Type name..."
            />
          </div>
        </div>

        <div className={`${styles.filter_group}`}>
          <label className={`${styles.filter_label}`}>
            Filter by Email Address
          </label>
          <div className={`${styles.search_input_wrapper}`}>
            <Search className={`${styles.search_input_icon}`} size={14} />
            <input
              className={`${styles.filter_input}`}
              type="text"
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              placeholder="Type email address..."
            />
          </div>
        </div>

        <div className={`${styles.filter_group}`}>
          <label className={`${styles.filter_label}`}>
            Filter By Members Role
          </label>
          <select
            className={`${styles.filter_select}`}
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
          >
            <option value="All">--- Select Member Role ---</option>
            <option value="All">All Roles</option>
            <option value="Team Lead">Team Lead</option>
            <option value="Team Contributor">Team Contributor</option>
          </select>
        </div>
      </div>
      <div className={`${styles.filters_panel}`}>
        <div className={`${styles.filters_panel_left}`}>
          <div className={`${styles.filter_label}`}>
            <ArrowUpDown size={14} />
            <span>Quick Sort:</span>
          </div>
          <div className={`${styles.filter_buttons_group}`}>
            <button
              className={`${styles.filter_pill}`}
              onClick={() => requestSort("name")}
            >
              Name
            </button>
            <button
              className={`${styles.filter_pill}`}
              onClick={() => requestSort("email")}
            >
              Email
            </button>
            <button
              className={`${styles.filter_pill}`}
              onClick={() => requestSort("role")}
            >
              Role
            </button>
            <button
              className={`${styles.filter_pill}`}
              onClick={() => requestSort("totalTasks")}
            >
              Total Tasks
            </button>
            <button
              className={`${styles.filter_pill}`}
              onClick={() => requestSort("closedTasks")}
            >
              Closed Tasks
            </button>
            <button
              className={`${styles.filter_pill}`}
              onClick={() => requestSort("completionRate")}
            >
              Efficiency
            </button>
          </div>
        </div>
      </div>
      <div className={`${styles.team_table_container}`}>
        {sortedMembers.length === 0 ? (
          <div className={`${styles.table_empty_state}`}>
            No registered team members satisfied the specified filter
            parameters.
          </div>
        ) : (
          <div className={`${styles.table_responsive_wrapper}`}>
            <table className={`${styles.team_members_table}`}>
              <thead>
                <tr>
                  <th
                    className={`${styles.clickable_th}`}
                    onClick={() => requestSort("name")}
                  >
                    <span className={`${styles.th_content_wrapper}`}>
                      Member Name {renderSortIndicator("name")}
                    </span>
                  </th>
                  <th
                    className={`${styles.clickable_th}`}
                    onClick={() => requestSort("email")}
                  >
                    <span className={`${styles.th_content_wrapper}`}>
                      Email Address {renderSortIndicator("email")}
                    </span>
                  </th>
                  <th
                    className={`${styles.clickable_th}`}
                    onClick={() => requestSort("role")}
                  >
                    <span className={`${styles.th_content_wrapper}`}>
                      System Role {renderSortIndicator("role")}
                    </span>
                  </th>
                  <th
                    className={`${styles.clickable_th} ${styles.text_center}`}
                    onClick={() => requestSort("totalTasks")}
                  >
                    <span
                      className={`${styles.th_content_wrapper} ${styles.center_content}`}
                    >
                      Total Tasks {renderSortIndicator("totalTasks")}
                    </span>
                  </th>
                  <th
                    className={`${styles.clickable_th} ${styles.text_center}`}
                    onClick={() => requestSort("closedTasks")}
                  >
                    <span
                      className={`${styles.th_content_wrapper} ${styles.center_content}`}
                    >
                      Closed Tasks {renderSortIndicator("closedTasks")}
                    </span>
                  </th>
                  <th
                    className={`${styles.clickable_th} ${styles.text_center}`}
                    onClick={() => requestSort("completionRate")}
                  >
                    <span
                      className={`${styles.th_content_wrapper} ${styles.center_content}`}
                    >
                      Efficiency {renderSortIndicator("completionRate")}
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedMembers.map((member) => (
                  <tr className={`${styles.table_row_hover}`} key={member.id}>
                    <td className={`${styles.member_name_cell}`}>
                      {member.name}
                    </td>
                    <td className={`${styles.member_email_cell}`}>
                      {member.email}
                    </td>
                    <td className={`${styles.member_role_cell}`}>
                      <span
                        className={`${styles.role_badge} ${
                          styles[
                            member.role === "Team Lead"
                              ? "badge_lead"
                              : "badge_contributor"
                          ]
                        }`}
                      >
                        {member.role === "Team Lead" && <Shield size={12} />}
                        {member.role}
                      </span>
                    </td>
                    <td
                      className={`${styles.member_metric_cell} ${styles.text_center}`}
                    >
                      {member.totalTasks} tasks
                    </td>
                    <td
                      className={`${styles.text_center}`}
                      style={{ padding: "16px 20px" }}
                    >
                      <span className={`${styles.closed_tasks_badge}`}>
                        <CheckCircle2 size={13} />
                        {member.closedTasks}
                      </span>
                    </td>
                    <td
                      className={`${styles.text_center}`}
                      style={{ padding: "16px 20px" }}
                    >
                      <div className={`${styles.efficiency_wrapper}`}>
                        <span
                          className={`${styles.efficiency_text} ${
                            styles[
                              member.completionRate > 70
                                ? "efficiency_high"
                                : member.completionRate > 40
                                  ? "efficiency_medium"
                                  : "efficiency_low"
                            ]
                          }`}
                        >
                          {member.completionRate}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div
              className={`${styles.tasks_cards}`}
              style={{ padding: "20px" }}
            >
              <div className="row">
                {sortedMembers &&
                  sortedMembers.map((member) => {
                    return (
                      <div className="col-12 col-lg-6" key={member.id}>
                        <div
                          className={`mb-3`}
                          style={{
                            overflow: "hidden",
                            cursor: "pointer",
                          }}
                        >
                          <div className={`card mb-3`}>
                            <div className="card-body d-flex gap-2 justify-content-between">
                              <div style={{ fontSize: "16px" }}>
                                <p>
                                  <b>Member Name:</b>
                                  {` `}
                                  {member.name}
                                </p>
                                <p>
                                  <b>Email Address:</b>
                                  {` `}
                                  {member.email}
                                </p>
                                <p className={`${styles.systemRole1}`}>
                                  <b>System Role:</b>
                                  {` `}
                                  <span
                                    className={`${styles.role_badge} ${
                                      styles[
                                        member.role === "Team Lead"
                                          ? "badge_lead"
                                          : "badge_contributor"
                                      ]
                                    }`}
                                  >
                                    {member.role === "Team Lead" && (
                                      <Shield size={12} />
                                    )}
                                    {member.role}
                                  </span>
                                </p>
                                <p>
                                  <b>Total Tasks:</b>
                                  {` `}
                                  {member.totalTasks} tasks
                                </p>
                                <p>
                                  <b>Closed Tasks:</b>
                                  {` `}
                                  <span
                                    className={`${styles.closed_tasks_badge}`}
                                  >
                                    <CheckCircle2 size={13} />
                                    {member.closedTasks}
                                  </span>
                                </p>
                                <p>
                                  <b>Efficiency:</b>
                                  {` `}
                                  <span
                                    className={`${styles.efficiency_text} ${
                                      styles[
                                        member.completionRate > 70
                                          ? "efficiency_high"
                                          : member.completionRate > 40
                                            ? "efficiency_medium"
                                            : "efficiency_low"
                                      ]
                                    }`}
                                  >
                                    {member.completionRate}%
                                  </span>
                                </p>
                              </div>
                              <div style={{ minWidth: "100px" }}>
                                <div className={`${styles.systemRole2}`}>
                                  <p
                                    className={`${styles.systemRole2} d-flex justify-content-end`}
                                  >
                                    <span
                                      className={`${styles.role_badge} ${
                                        styles[
                                          member.role === "Team Lead"
                                            ? "badge_lead"
                                            : "badge_contributor"
                                        ]
                                      }`}
                                    >
                                      {member.role === "Team Lead" && (
                                        <Shield size={12} />
                                      )}
                                      {member.role}
                                    </span>
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
              </div>
            </div>
          </div>
        )}
      </div>
      {isMemberModalOpen && (
        <UserModel setModalVisibilityState={setMemberModalVisibilityState} />
      )}
    </div>
  )
}
