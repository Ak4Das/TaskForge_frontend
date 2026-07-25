import styles from "../style/page_modules/Reports.module.css"
import React, { useState, useEffect } from "react"
import axios from "axios"
import { Bar, Pie, Doughnut } from "react-chartjs-2"
import { BarChart3, TrendingUp, AlertCircle, RefreshCw } from "lucide-react"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js"
import {
  closedTasksByTeams,
  closedTasksByOwner,
  fetchTasks,
  pendingTasksByOwner,
} from "../../services/requestToServer"
import { useNavigate } from "react-router-dom"

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
)

let url = null
if (import.meta.env.VITE_MODE === "DEVELOPMENT") {
  url = "http://localhost:3000"
} else {
  url = "https://workasana-backend-zeta.vercel.app"
}

export default function Reports() {
  const [loading, setLoading] = useState(true)
  const [error, setIsError] = useState("")
  const [teamPerformanceData, setTeamPerformanceData] = useState(null)
  const [ownerPerformanceData, setOwnerPerformanceData] = useState(null)
  const [projectBacklogData, setProjectBacklogData] = useState(null)
  const [summaryCards, setSummaryCards] = useState({
    totalClosed: 0,
    pendingDays: 0,
  })
  const navigate = useNavigate()

  useEffect(() => {
    if (error === "Invalid Token.") {
      navigate("/login")
    }
  }, [error])

  function findRemainingDays(createdAt, allocatedTime) {
    const createdAtDay = new Date(createdAt)
    const today = new Date()
    const passedDay = (today - createdAtDay) / (1000 * 60 * 60 * 24)
    const remainingDays = allocatedTime - Math.floor(passedDay)
    return remainingDays
  }

  const fetchAnalyticalReportMatrices = async () => {
    try {
      setLoading(true)

      const teamCounts = {}

      const numberOfClosedTasksByTeams = await closedTasksByTeams({
        setIsError,
      })

      numberOfClosedTasksByTeams &&
        numberOfClosedTasksByTeams.forEach((team) => {
          teamCounts[team.teamDetails.name] = team.count
        })

      const ownerCounts = {}

      const numberOfClosedTasksByOwners = await closedTasksByOwner({
        setIsError,
      })

      numberOfClosedTasksByOwners &&
        numberOfClosedTasksByOwners.forEach((owner) => {
          ownerCounts[owner.name] = owner.count
        })

      const projectPendingEffort = await pendingTasksByOwner({ setIsError })

      const allTasks = await fetchTasks({
        taskEndpoint: `${url}/api/tasks`,
        setIsError,
      })

      let closedCounter = 0

      allTasks &&
        allTasks.forEach((task) => {
          if (task.status === "Completed") {
            closedCounter++
          }
        })

      let totalPendingDaysSum = 0

      allTasks &&
        allTasks.forEach((task) => {
          if (task.status !== "Completed") {
            const effortDays = findRemainingDays(
              task.createdAt,
              task.timeToComplete,
            )
            totalPendingDaysSum += effortDays
          }
        })

      setTeamPerformanceData({
        labels: Object.keys(teamCounts),
        datasets: [
          {
            data: Object.values(teamCounts),
            backgroundColor: [
              "#4F46E5",
              "#10B981",
              "#F59E0B",
              "#EF4444",
              "#8B5CF6",
              "#EC4899",
            ],
            borderWidth: 1,
          },
        ],
      })

      setOwnerPerformanceData({
        labels: Object.keys(ownerCounts),
        datasets: [
          {
            data: Object.values(ownerCounts),
            backgroundColor: [
              "#3B82F6",
              "#10B981",
              "#6366F1",
              "#EC4899",
              "#F59E0B",
              "#14B8A6",
            ],
            hoverOffset: 4,
          },
        ],
      })

      projectPendingEffort &&
        setProjectBacklogData({
          labels: Object.keys(projectPendingEffort),
          datasets: [
            {
              data: Object.values(projectPendingEffort),
              backgroundColor: "#4F46E5",
              borderRadius: 6,
              barThickness: 28,
            },
          ],
        })

      setSummaryCards({
        totalClosed: closedCounter,
        pendingDays: totalPendingDaysSum,
      })
    } catch (error) {
      if (import.meta.env.VITE_MODE === "DEVELOPMENT") {
        console.error(error)
      }
      setIsError(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalyticalReportMatrices()
  }, [])

  return (
    <div className={`${styles.reports_container}`}>
      <div className={`${styles.reports_header_bar}`}>
        <div className={`${styles.title_area}`}>
          <h1 className={`${styles.reports_main_title}`}>TaskForge Reports</h1>
          <p className={`${styles.reports_sub_title}`}>
            Monitor task completion matrices and pending workloads.
          </p>
        </div>

        <button
          className={`${styles.btn_refresh_data}`}
          onClick={fetchAnalyticalReportMatrices}
        >
          <RefreshCw size={14} /> Refresh Data
        </button>
      </div>

      {error && (
        <div className={`${styles.reports_alert_box}`}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <div className={`${styles.metrics_summary_grid}`}>
        <div className={`${styles.metric_card}`}>
          <div className={`${styles.icon_wrapper} ${styles.icon_closed_green}`}>
            <TrendingUp size={24} />
          </div>
          <div className={`${styles.metric_details}`}>
            <span className={`${styles.metric_label}`}>
              Total Action Items Closed
            </span>
            <h3 className={`${styles.metric_value}`}>
              {summaryCards.totalClosed} Tasks
            </h3>
          </div>
        </div>

        <div className={`${styles.metric_card}`}>
          <div className={`${styles.icon_wrapper} ${styles.icon_pending_blue}`}>
            <BarChart3 size={24} />
          </div>
          <div className={`${styles.metric_details}`}>
            <span className={`${styles.metric_label}`}>
              Pending Operational Allocation
            </span>
            <h3 className={`${styles.metric_value}`}>
              {summaryCards.pendingDays} Estimated Days
            </h3>
          </div>
        </div>
      </div>

      {loading ? (
        <div className={`${styles.reports_loading_state}`}>
          Processing data and creating charts using chart.js...
        </div>
      ) : (
        <div className={`${styles.charts_workspace_vertical_flex}`}>
          {/* Pending Work Across Projects (Bar Chart) */}
          <div className={`${styles.chart_full_width_card}`}>
            <h3 className={`${styles.chart_panel_title}`}>
              Pending Work Across Projects (Total Remaining Days)
            </h3>
            <div className={`${styles.bar_chart_container_frame}`}>
              {projectBacklogData ? (
                <Bar
                  data={projectBacklogData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                      y: {
                        beginAtZero: true,
                        title: { display: true, text: "Effort Matrix in Days" },
                      },
                    },
                  }}
                />
              ) : (
                <div className={`${styles.chart_empty_fallback}`}>
                  No backlog items.
                </div>
              )}
            </div>
          </div>

          <div className={`${styles.charts_split_two_column_grid}`}>
            {/* Pie Chart: Closed Tasks by Functional Team */}
            <div className={`${styles.chart_circular_card_wrapper}`}>
              <h3 className={`${styles.chart_panel_title} ${styles.text_left}`}>
                Tasks Closed By Core Team
              </h3>
              <div className={`${styles.circular_chart_canvas_frame}`}>
                {teamPerformanceData ? (
                  <Pie
                    data={teamPerformanceData}
                    options={{ responsive: true }}
                  />
                ) : (
                  <div className={`${styles.chart_empty_fallback}`}>
                    No team metrics.
                  </div>
                )}
              </div>
            </div>

            {/* Doughnut Chart: Closed Tasks by Owner Assignment */}
            <div className={`${styles.chart_circular_card_wrapper}`}>
              <h3 className={`${styles.chart_panel_title} ${styles.text_left}`}>
                Tasks Closed By Responsible Owner
              </h3>
              <div className={`${styles.circular_chart_canvas_frame}`}>
                {ownerPerformanceData ? (
                  <Doughnut
                    data={ownerPerformanceData}
                    options={{ responsive: true }}
                  />
                ) : (
                  <div className={`${styles.chart_empty_fallback}`}>
                    No individual records.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
