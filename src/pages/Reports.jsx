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

// Register essential modular dependencies required by Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
)

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

      numberOfClosedTasksByTeams.forEach((team) => {
        teamCounts[team.teamDetails.name] = team.count
      })

      const ownerCounts = {}

      const numberOfClosedTasksByOwners = await closedTasksByOwner({
        setIsError,
      })

      numberOfClosedTasksByOwners.forEach((owner) => {
        ownerCounts[owner.name] = owner.count
      })

      const projectPendingEffort = await pendingTasksByOwner({ setIsError })

      const allTasks = await fetchTasks({
        taskEndpoint: "http://localhost:3000/api/tasks",
        setIsError,
      })

      let closedCounter = 0

      allTasks.forEach((task) => {
        if (task.status === "Completed") {
          closedCounter++
        }
      })

      let totalPendingDaysSum = 0

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
            label: "Tasks Closed",
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
            label: "Assignments Finished",
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

      setProjectBacklogData({
        labels: Object.keys(projectPendingEffort),
        datasets: [
          {
            label: "Pending Work Effort (Days)",
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
    <div
      style={{
        padding: "32px",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "32px",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "28px",
              fontWeight: "700",
              color: "#111827",
              margin: "0 0 6px 0",
            }}
          >
            Workasana Reports
          </h1>
          <p style={{ color: "#4B5563", margin: 0 }}>
            Monitor task completion matrices, pending resource blocks, and
            delivery cycles.
          </p>
        </div>

        <button
          onClick={fetchAnalyticalReportMatrices}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            backgroundColor: "#ffffff",
            border: "1px solid #D1D5DB",
            padding: "10px 16px",
            borderRadius: "8px",
            fontSize: "13px",
            fontWeight: "600",
            color: "#374151",
            cursor: "pointer",
            transition: "background-color 0.15s",
          }}
        >
          <RefreshCw size={14} /> Refresh Data
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
            padding: "14px 16px",
            borderRadius: "8px",
            marginBottom: "24px",
            fontSize: "14px",
          }}
        >
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "24px",
          marginBottom: "32px",
        }}
      >
        <div
          style={{
            backgroundColor: "#ffffff",
            border: "1px solid #E5E7EB",
            borderRadius: "14px",
            padding: "24px",
            display: "flex",
            alignItems: "center",
            gap: "16px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
          }}
        >
          <div
            style={{
              p: "12px",
              borderRadius: "10px",
              backgroundColor: "#D1FAE5",
              color: "#065F46",
            }}
          >
            <TrendingUp size={24} />
          </div>
          <div>
            <span
              style={{ fontSize: "14px", color: "#6B7280", fontWeight: "500" }}
            >
              Total Action Items Closed
            </span>
            <h3
              style={{
                fontSize: "28px",
                fontWeight: "700",
                color: "#111827",
                margin: "4px 0 0 0",
              }}
            >
              {summaryCards.totalClosed} Tasks
            </h3>
          </div>
        </div>

        <div
          style={{
            backgroundColor: "#ffffff",
            border: "1px solid #E5E7EB",
            borderRadius: "14px",
            padding: "24px",
            display: "flex",
            alignItems: "center",
            gap: "16px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
          }}
        >
          <div
            style={{
              p: "12px",
              borderRadius: "10px",
              backgroundColor: "#DBEAFE",
              color: "#1E40AF",
            }}
          >
            <BarChart3 size={24} />
          </div>
          <div>
            <span
              style={{ fontSize: "14px", color: "#6B7280", fontWeight: "500" }}
            >
              Pending Operational Allocation
            </span>
            <h3
              style={{
                fontSize: "28px",
                fontWeight: "700",
                color: "#111827",
                margin: "4px 0 0 0",
              }}
            >
              {summaryCards.pendingDays} Estimated Days
            </h3>
          </div>
        </div>
      </div>

      {/* Analytical Charts Component Grid Rendering */}
      {loading ? (
        <div
          style={{ textAlign: "center", padding: "60px 0", color: "#6B7280" }}
        >
          Processing data and creating charts using chart.js...
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
          {/* Pending Work Across Projects (Bar Chart) */}
          <div
            style={{
              backgroundColor: "#ffffff",
              border: "1px solid #E5E7EB",
              borderRadius: "14px",
              padding: "28px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
            }}
          >
            <h3
              style={{
                fontSize: "16px",
                fontWeight: "600",
                color: "#111827",
                margin: "0 0 20px 0",
              }}
            >
              Pending Work Across Projects (Total Remaining Days)
            </h3>
            <div
              style={{
                minHeight: "260px",
                maxHeight: "320px",
                position: "relative",
              }}
            >
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
                <div style={{ textAlign: "center", color: "#9CA3AF" }}>
                  No backlog items.
                </div>
              )}
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "32px",
            }}
          >
            {/* Pie Chart: Closed Tasks by Functional Team */}
            <div
              style={{
                backgroundColor: "#ffffff",
                border: "1px solid #E5E7EB",
                borderRadius: "14px",
                padding: "28px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <h3
                style={{
                  fontSize: "16px",
                  fontWeight: "600",
                  color: "#111827",
                  margin: "0 0 20px 0",
                  width: "100%",
                  textAlign: "left",
                }}
              >
                Tasks Closed By Core Team
              </h3>
              <div
                style={{
                  width: "100%",
                  maxWidth: "240px",
                  position: "relative",
                }}
              >
                {teamPerformanceData ? (
                  <Pie
                    data={teamPerformanceData}
                    options={{ responsive: true }}
                  />
                ) : (
                  <div style={{ color: "#9CA3AF" }}>No team metrics.</div>
                )}
              </div>
            </div>

            {/* Doughnut Chart: Closed Tasks by Owner Assignment */}
            <div
              style={{
                backgroundColor: "#ffffff",
                border: "1px solid #E5E7EB",
                borderRadius: "14px",
                padding: "28px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <h3
                style={{
                  fontSize: "16px",
                  fontWeight: "600",
                  color: "#111827",
                  margin: "0 0 20px 0",
                  width: "100%",
                  textAlign: "left",
                }}
              >
                Tasks Closed By Responsible Owner
              </h3>
              <div
                style={{
                  width: "100%",
                  maxWidth: "240px",
                  position: "relative",
                }}
              >
                {ownerPerformanceData ? (
                  <Doughnut
                    data={ownerPerformanceData}
                    options={{ responsive: true }}
                  />
                ) : (
                  <div style={{ color: "#9CA3AF" }}>No individual records.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
