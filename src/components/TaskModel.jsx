import styles from "../style/component_modules/TaskModel.module.css"
import React, { useState, useEffect } from "react"
import axios from "axios"
import { X } from "lucide-react"
import {
  createTask,
  fetchAllProjects,
  fetchTags,
  fetchTeams,
  fetchUsers,
} from "../../services/requestToServer"
import { useSearchParams } from "react-router-dom"
import TagsModel from "./TagsModel"
import { useFormik } from "formik"
import { taskSchema } from "../schemas/EditTask.schema"

export default function TaskModal({ setModalVisibilityState, fetchData }) {
  const [projects, setProjects] = useState([])
  const [teams, setTeams] = useState([])
  const [users, setUsers] = useState([])
  const [tags, setTags] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [error, setIsError] = useState("")
  const [searchParams, setSearchParams] = useSearchParams()

  const isTagsModalOpen = searchParams.get("newTagsModal") === "true"

  const initialValues = {
    name: "",
    project: "",
    team: "",
    owners: [],
    tags: [],
    timeToComplete: 1,
    status: "To Do",
    priority: "High",
  }

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: taskSchema,
    enableReinitialize: true,
    onSubmit: async (values, action) => {
      try {
        setSubmitting(true)

        const response = await createTask({ body: values, setIsError })
        if (response && Object.keys(response).length) {
          setModalVisibilityState(false)
          fetchData()
        }
      } catch (error) {
        if (import.meta.env.VITE_MODE === "DEVELOPMENT") {
          console.error(error)
        }
        setIsError(error.message)
      } finally {
        setSubmitting(false)
      }
    },
  })

  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    setFieldValue,
    handleSubmit,
  } = formik

  const fetchFormContextDependencies = async () => {
    try {
      await Promise.all([
        fetchAllProjects({ setFunction: setProjects, setIsError }),
        fetchTeams({ setFunction: setTeams, setIsError }),
        fetchUsers({ setFunction: setUsers, setIsError }),
        fetchTags({ setFunction: setTags, setIsError }),
      ])
    } catch (error) {
      if (import.meta.env.VITE_MODE === "DEVELOPMENT") {
        console.error(error)
      }
      setIsError(error.message)
    }
  }

  useEffect(() => {
    fetchFormContextDependencies()
  }, [])

  // Change Tags modal open/close states directly with the browser URL parameters
  const setTagsModalVisibilityState = (isOpen) => {
    const updatedParams = new URLSearchParams(searchParams)
    if (isOpen) {
      updatedParams.set("newTagsModal", "true")
    } else {
      updatedParams.delete("newTagsModal")
    }
    setSearchParams(updatedParams)
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalCard}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>Create New Task</h3>
          <button
            className={styles.closeHeaderBtn}
            onClick={() => setModalVisibilityState(false)}
          >
            <X size={20} />
          </button>
        </div>

        <form className={styles.modalForm} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Task Title Name</label>
            <input
              className={styles.formInput}
              type="text"
              name="name"
              value={values.name}
              required
              placeholder="e.g., Fix auth failure edge cases"
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.name && touched.name ? (
              <p className={styles.errorMessage} className={`text-danger my-0`}>
                {errors.name}
              </p>
            ) : null}
          </div>

          <div className={styles.formGridTwoCol}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Projects List</label>
              <select
                className={styles.formSelect}
                required
                name="project"
                value={values.project}
                onChange={handleChange}
                onBlur={handleBlur}
              >
                <option value="">-- Choose Project --</option>
                {projects.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name}
                  </option>
                ))}
              </select>
              {errors.project && touched.project ? (
                <p
                  className={styles.errorMessage}
                  className={`text-danger my-0`}
                >
                  {errors.project}
                </p>
              ) : null}
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Teams List</label>
              <select
                className={styles.formSelect}
                required
                name="team"
                value={values.team}
                onChange={handleChange}
                onBlur={handleBlur}
              >
                <option value="">-- Choose Team --</option>
                {teams.map((t) => (
                  <option key={t._id} value={t._id}>
                    {t.name}
                  </option>
                ))}
              </select>
              {errors.team && touched.team ? (
                <p
                  className={styles.errorMessage}
                  className={`text-danger my-0`}
                >
                  {errors.team}
                </p>
              ) : null}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              Task Owners Assigned (Hold Cmd/Ctrl to choose multiple)
            </label>
            <select
              className={styles.formSelectMultiple}
              multiple
              required
              name="owners"
              onChange={(e) => {
                const selectedOptions = Array.from(e.target.selectedOptions)

                const checkedOptionsArray = selectedOptions.map(
                  (opt) => opt.value,
                )

                setFieldValue("owners", checkedOptionsArray)
              }}
              onBlur={handleBlur}
            >
              {users.map((user) => (
                <option
                  className={styles.selectOptionItem}
                  key={user._id}
                  value={user._id}
                >
                  {user.name}
                </option>
              ))}
            </select>
            {errors.owners && touched.owners ? (
              <p className={styles.errorMessage} className={`text-danger my-0`}>
                {errors.owners}
              </p>
            ) : null}
          </div>

          <div className={styles.formGroup}>
            <div className={styles.labelActionRow}>
              <label className={styles.formLabelInline}>
                Tags (Hold Cmd/Ctrl to choose multiple)
              </label>
              <button
                className={styles.inlineActionBtn}
                onClick={() => setTagsModalVisibilityState(true)}
                type="button"
              >
                Add New Tag
              </button>
            </div>
            <select
              className={styles.formSelectMultiple}
              multiple
              name="tags"
              onChange={(e) => {
                const selectedOptions = Array.from(e.target.selectedOptions)

                const checkedOptionsArray = selectedOptions.map(
                  (opt) => opt.value,
                )

                setFieldValue("tags", checkedOptionsArray)
              }}
              onBlur={handleBlur}
            >
              {tags.map((tag) => (
                <option
                  className={styles.selectOptionItem}
                  key={tag._id}
                  value={tag._id}
                >
                  {tag.name}
                </option>
              ))}
            </select>
            {errors.tags && touched.tags ? (
              <p className={styles.errorMessage} className={`text-danger my-0`}>
                {errors.tags}
              </p>
            ) : null}
          </div>

          <div className={styles.formGridTwoCol}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                Estimated Effort (Days)
              </label>
              <input
                className={styles.formInput}
                type="number"
                min="1"
                name="timeToComplete"
                value={values.timeToComplete}
                required
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.timeToComplete && touched.timeToComplete ? (
                <p
                  className={styles.errorMessage}
                  className={`text-danger my-0`}
                >
                  {errors.timeToComplete}
                </p>
              ) : null}
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Initial Core Status</label>
              <select
                className={styles.formSelect}
                name="status"
                value={values.status}
                onChange={handleChange}
                onBlur={handleBlur}
              >
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Blocked">Blocked</option>
              </select>
              {errors.status && touched.status ? (
                <p
                  className={styles.errorMessage}
                  className={`text-danger my-0`}
                >
                  {errors.status}
                </p>
              ) : null}
            </div>
          </div>

          <div className={styles.modalFooter}>
            <button
              className={styles.cancelBtn}
              type="button"
              onClick={() => setModalVisibilityState(false)}
            >
              Cancel
            </button>
            <button
              className={styles.submitBtn}
              type="submit"
              disabled={submitting}
            >
              {submitting ? "Creating..." : "Create Assignment"}
            </button>
          </div>
        </form>
      </div>
      {isTagsModalOpen && (
        <TagsModel
          setTagsModalVisibilityState={setTagsModalVisibilityState}
          fetchData={fetchFormContextDependencies}
        />
      )}
    </div>
  )
}
