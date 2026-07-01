import styles from "../style/page_modules/TaskDetail.module.css"
import React, { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import axios from "axios"
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  AlertTriangle,
  HelpCircle,
  Folder,
  Users,
  User,
  Tag,
  CalendarDays,
  Clock3,
  SquarePen,
} from "lucide-react"
import { fetchTasksById, updateTask } from "../../services/requestToServer"

export default function TaskDetail() {
  const { taskId } = useParams()
  const navigate = useNavigate()
  const [task, setTask] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setIsError] = useState("")
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    if (error === "Invalid Token.") {
      navigate("/login")
    }
  }, [error])

  useEffect(() => {
    const fetchIndividualTaskData = async () => {
      try {
        setLoading(true)

        await fetchTasksById({
          taskId,
          setFunction: setTask,
          setIsError,
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

    fetchIndividualTaskData()
  }, [taskId])

  const handleMarkAsComplete = async () => {
    try {
      setUpdating(true)

      await updateTask({
        taskId,
        body: {
          status: "Completed",
        },
        setFunction: setTask,
        setIsError,
      })
    } catch (error) {
      if (import.meta.env.VITE_MODE === "DEVELOPMENT") {
        console.error(error)
      }
      setIsError(error.message)
    } finally {
      setUpdating(false)
    }
  }

  function findRemainingDays(createdAt, allocatedTime) {
    const createdAtDay = new Date(createdAt)
    const today = new Date()
    const passedDay = (today - createdAtDay) / (1000 * 60 * 60 * 24)
    const remainingDays = allocatedTime - Math.floor(passedDay)
    return `${remainingDays} ${remainingDays === 1 ? "day" : "days"}`
  }

  function findDueDate(createdAt, allocatedTime) {
    const createdAtDay = new Date(createdAt)
    createdAtDay.setDate(createdAtDay.getDate() + allocatedTime)
    const dueDate = new Date(createdAtDay)
    return dueDate.toLocaleDateString()
  }

  const getStatusClass = (status) => {
    switch (status) {
      case "To Do":
        return styles.statusTodo
      case "In Progress":
        return styles.statusProgress
      case "Completed":
        return styles.statusCompleted
      case "Blocked":
        return styles.statusBlocked
      default:
        return ""
    }
  }

  if (loading) {
    return <div className={styles.loadingState}>Loading task...</div>
  }

  if (error || !task) {
    return (
      <div className={styles.errorWrapper}>
        <div className={styles.errorBanner}>
          {error ||
            "The targeted assignment file could not be localized within active records."}
        </div>
        <Link className={styles.backLink} to="/dashboard">
          <ArrowLeft size={16} /> Return to Dashboard View
        </Link>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <button className={styles.backWorkspaceBtn} onClick={() => navigate(-1)}>
        <ArrowLeft size={16} /> Return to Previous Workspace
      </button>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div className={styles.badgeWrapper}>
            <span
              className={`${styles.statusBadge} ${getStatusClass(task.status)}`}
            >
              {task.status === "Completed" && <CheckCircle2 size={14} />}
              {task.status === "In Progress" && <Clock size={14} />}
              {task.status === "Blocked" && <AlertTriangle size={14} />}
              {task.status === "To Do" && <HelpCircle size={14} />}
              {task.status}
            </span>
          </div>
          <h1 className={styles.taskTitle}>{task.name}</h1>
        </div>

        <div className={styles.cardBody}>
          <div className={styles.dataGridRow}>
            <div className={styles.labelCell}>
              <Folder size={16} />
              <span>Project Context:</span>
            </div>
            <div className={styles.valueCellBold}>{task.project?.name}</div>
          </div>

          <div className={styles.dataGridRow}>
            <div className={styles.labelCell}>
              <Users size={16} />
              <span>Assigned Team:</span>
            </div>
            <div className={styles.valueCell}>{task.team?.name}</div>
          </div>

          <div className={styles.dataGridRow}>
            <div className={`${styles.labelCell} ${styles.alignStart}`}>
              <User size={16} />
              <span>Responsible Owners:</span>
            </div>
            <div className={styles.ownersFlexContainer}>
              {task.owners && task.owners.length > 0 ? (
                task.owners.map((owner) => (
                  <span className={styles.ownerTag} key={owner._id}>
                    {owner.name} ({owner.email})
                  </span>
                ))
              ) : (
                <span className={styles.emptyStateText}>
                  No profile node targets bound.
                </span>
              )}
            </div>
          </div>

          <div className={styles.dataGridRow}>
            <div className={styles.labelCell}>
              <CalendarDays size={16} />
              <span>Due Date:</span>
            </div>
            <div className={styles.valueCellBold}>
              {findDueDate(task.createdAt, task.timeToComplete)}
            </div>
          </div>

          <div className={styles.dataGridRow}>
            <div className={styles.labelCell}>
              <Clock3 size={16} />
              <span>Time Remaining:</span>
            </div>
            <div className={styles.valueCellBold}>
              {findRemainingDays(task.createdAt, task.timeToComplete)}
            </div>
          </div>

          <div className={styles.dataGridRowLast}>
            <div className={styles.labelCell}>
              <Tag size={16} />
              <span>Categorical Tags:</span>
            </div>
            <div className={styles.tagsFlexContainer}>
              {task.tags && task.tags.length > 0 ? (
                task.tags.map((tag, i) => (
                  <span className={styles.categoryTag} key={i}>
                    {tag.name}
                  </span>
                ))
              ) : (
                <span className={styles.emptyStateText}>
                  No catalog markers attached.
                </span>
              )}
            </div>
          </div>
        </div>

        {task.status !== "Completed" && (
          <div className={styles.cardFooter}>
            <button
              className={styles.submitBtn}
              onClick={() => navigate(`/tasks/edit/${taskId}`)}
              disabled={updating}
            >
              <SquarePen size={16} />
              Edit Task
            </button>
            <button
              className={styles.submitBtn}
              onClick={handleMarkAsComplete}
              disabled={updating}
            >
              <CheckCircle2 size={16} />
              {updating ? "Updating state..." : "Mark as Complete"}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
