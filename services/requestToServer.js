import axios from "axios"

let url = null
if (import.meta.env.VITE_MODE === "DEVELOPMENT") {
  url = "http://localhost:3000"
} else {
  url = "https://workasana-backend-zeta.vercel.app"
}

export async function fetchAllProjects(obj) {
  const controller = new AbortController()

  const timerId = setTimeout(() => {
    controller.abort()
  }, 10000)

  const { setFunction, setIsError } = obj

  try {
    const response = await axios.get(`${url}/api/projects`, {
      signal: controller.signal,
    })

    clearTimeout(timerId)

    setFunction && setFunction(response.data.respondedData)
    return response.data.respondedData
  } catch (error) {
    clearTimeout(timerId)

    if (import.meta.env.VITE_MODE === "DEVELOPMENT") {
      console.dir(error)
    }

    if (error.response.data.message === "Access Denied: Invalid Token.") {
      setIsError && setIsError("Invalid Token.")
      return
    }

    if (error.name === "CanceledError") {
      setIsError && setIsError("Request timeout")
      return
    }

    setIsError && setIsError(error.message)
  }
}

export async function fetchTasks(obj) {
  const controller = new AbortController()

  const timerId = setTimeout(() => {
    controller.abort()
  }, 10000)

  const { taskEndpoint, setFunction, setIsError } = obj

  try {
    const response = await axios.get(taskEndpoint, {
      signal: controller.signal,
    })

    clearTimeout(timerId)

    setFunction && setFunction(response.data.respondedData)
    return response.data.respondedData
  } catch (error) {
    clearTimeout(timerId)

    if (import.meta.env.VITE_MODE === "DEVELOPMENT") {
      console.dir(error)
    }

    if (error.response.data.message === "Access Denied: Invalid Token.") {
      setIsError && setIsError("Invalid Token.")
      return
    }

    if (error.name === "CanceledError") {
      setIsError && setIsError("Request timeout")
      return
    }

    setIsError && setIsError(error.message)
  }
}

export async function fetchTeams(obj) {
  const controller = new AbortController()

  const timerId = setTimeout(() => {
    controller.abort()
  }, 10000)

  const { setFunction, setIsError } = obj

  try {
    const response = await axios.get(`${url}/api/teams`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      signal: controller.signal,
    })

    clearTimeout(timerId)

    setFunction && setFunction(response.data.respondedData)
    return response.data.respondedData
  } catch (error) {
    clearTimeout(timerId)

    if (import.meta.env.VITE_MODE === "DEVELOPMENT") {
      console.dir(error)
    }

    if (error.response.data.message === "Access Denied: Invalid Token.") {
      setIsError && setIsError("Invalid Token.")
      return
    }

    if (error.name === "CanceledError") {
      setIsError && setIsError("Request timeout")
      return
    }

    setIsError && setIsError(error.message)
  }
}

export async function fetchUsers(obj) {
  const controller = new AbortController()

  const timerId = setTimeout(() => {
    controller.abort()
  }, 10000)

  const { setFunction, setIsError } = obj

  try {
    const response = await axios.get(`${url}/api/users`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      signal: controller.signal,
    })

    clearTimeout(timerId)

    setFunction && setFunction(response.data.respondedData)
    return response.data.respondedData
  } catch (error) {
    clearTimeout(timerId)

    if (import.meta.env.VITE_MODE === "DEVELOPMENT") {
      console.dir(error)
    }

    if (error.response.data.message === "Access Denied: Invalid Token.") {
      setIsError && setIsError("Invalid Token.")
      return
    }

    if (error.name === "CanceledError") {
      setIsError && setIsError("Request timeout")
      return
    }

    setIsError && setIsError(error.message)
  }
}

export async function fetchTags(obj) {
  const controller = new AbortController()

  const timerId = setTimeout(() => {
    controller.abort()
  }, 10000)

  const { setFunction, setIsError } = obj

  try {
    const response = await axios.get(`${url}/api/tags`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      signal: controller.signal,
    })

    clearTimeout(timerId)

    setFunction && setFunction(response.data.respondedData)
    return response.data.respondedData
  } catch (error) {
    clearTimeout(timerId)

    if (import.meta.env.VITE_MODE === "DEVELOPMENT") {
      console.dir(error)
    }

    if (error.response.data.message === "Access Denied: Invalid Token.") {
      setIsError && setIsError("Invalid Token.")
      return
    }

    if (error.name === "CanceledError") {
      setIsError && setIsError("Request timeout")
      return
    }

    setIsError && setIsError(error.message)
  }
}

export async function fetchMe(obj) {
  const controller = new AbortController()

  const timerId = setTimeout(() => {
    controller.abort()
  }, 10000)

  const { setFunction, setIsError } = obj

  try {
    const response = await axios.get(`${url}/api/auth/me`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      signal: controller.signal,
    })

    clearTimeout(timerId)

    const respondedData = response.data.respondedData

    const user = {
      id: respondedData._id,
      name: respondedData.name,
      email: respondedData.email,
    }

    setFunction && setFunction(user)
    return user
  } catch (error) {
    clearTimeout(timerId)

    if (import.meta.env.VITE_MODE === "DEVELOPMENT") {
      console.dir(error)
    }

    if (error.response.data.message === "Access Denied: Invalid Token.") {
      setIsError && setIsError("Invalid Token.")
      return
    }

    if (error.name === "CanceledError") {
      setIsError && setIsError("Request timeout")
      return
    }

    setIsError && setIsError(error.message)
  }
}

export async function fetchTasksById(obj) {
  const controller = new AbortController()

  const timerId = setTimeout(() => {
    controller.abort()
  }, 10000)

  const { taskId, setFunction, setIsError } = obj

  try {
    const response = await axios.get(
      `${url}/api/tasks/${taskId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        signal: controller.signal,
      },
    )

    clearTimeout(timerId)

    setFunction && setFunction(response.data.respondedData)
    return response.data.respondedData
  } catch (error) {
    clearTimeout(timerId)

    if (import.meta.env.VITE_MODE === "DEVELOPMENT") {
      console.dir(error)
    }

    if (error.response.data.message === "Access Denied: Invalid Token.") {
      setIsError && setIsError("Invalid Token.")
      return
    }

    if (error.name === "CanceledError") {
      setIsError && setIsError("Request timeout")
      return
    }

    setIsError && setIsError(error.message)
  }
}

export async function fetchTeamsById(obj) {
  const controller = new AbortController()

  const timerId = setTimeout(() => {
    controller.abort()
  }, 10000)

  const { teamId, setFunction, setIsError } = obj

  try {
    const response = await axios.get(
      `${url}/api/teams/${teamId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        signal: controller.signal,
      },
    )

    clearTimeout(timerId)

    setFunction && setFunction(response.data.respondedData)
    return response.data.respondedData
  } catch (error) {
    clearTimeout(timerId)

    if (import.meta.env.VITE_MODE === "DEVELOPMENT") {
      console.dir(error)
    }

    if (error.response.data.message === "Access Denied: Invalid Token.") {
      setIsError && setIsError("Invalid Token.")
      return
    }

    if (error.name === "CanceledError") {
      setIsError && setIsError("Request timeout")
      return
    }

    setIsError && setIsError(error.message)
  }
}

export async function login(obj) {
  const controller = new AbortController()

  const timerId = setTimeout(() => {
    controller.abort()
  }, 10000)

  const { body, setFunction, setIsError } = obj

  try {
    const response = await axios.post(
      `${url}/api/auth/login`,
      body,
      {
        signal: controller.signal,
      },
    )

    clearTimeout(timerId)

    setFunction && setFunction(response.data)
    return response.data
  } catch (error) {
    clearTimeout(timerId)

    if (import.meta.env.VITE_MODE === "DEVELOPMENT") {
      console.dir(error)
    }

    if (error.response.data.message === "User not found.") {
      setIsError && setIsError("User not found.")
      return
    }

    setIsError && setIsError(error.message)
  }
}

export async function signUp(obj) {
  const controller = new AbortController()

  const timerId = setTimeout(() => {
    controller.abort()
  }, 10000)

  const { body, setFunction, setIsError } = obj

  try {
    const response = await axios.post(
      `${url}/api/auth/signup`,
      body,
      {
        signal: controller.signal,
      },
    )

    clearTimeout(timerId)

    setFunction && setFunction(response.data)
    return response.data
  } catch (error) {
    clearTimeout(timerId)

    if (import.meta.env.VITE_MODE === "DEVELOPMENT") {
      console.dir(error)
    }

    if (error.response.data.message === "This email is already active.") {
      setIsError && setIsError("This email is already active.")
      return
    }

    if (error.name === "CanceledError") {
      setIsError && setIsError("Request timeout")
      return
    }

    setIsError && setIsError(error.message)
  }
}

export async function createTeam(obj) {
  const controller = new AbortController()

  const timerId = setTimeout(() => {
    controller.abort()
  }, 10000)

  const { body, setFunction, setIsError } = obj

  try {
    const response = await axios.post(`${url}/api/teams`, body, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      signal: controller.signal,
    })

    clearTimeout(timerId)

    setFunction && setFunction(response.data.respondedData)
    return response.data.respondedData
  } catch (error) {
    clearTimeout(timerId)

    if (import.meta.env.VITE_MODE === "DEVELOPMENT") {
      console.dir(error)
    }

    if (error.response.data.message === "Access Denied: Invalid Token.") {
      setIsError && setIsError("Invalid Token.")
      return
    }

    if (error.name === "CanceledError") {
      setIsError && setIsError("Request timeout")
      return
    }

    setIsError && setIsError(error.message)
  }
}

export async function createTask(obj) {
  const controller = new AbortController()

  const timerId = setTimeout(() => {
    controller.abort()
  }, 10000)

  const { body, setFunction, setIsError } = obj

  try {
    const response = await axios.post(`${url}/api/tasks`, body, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      signal: controller.signal,
    })

    clearTimeout(timerId)

    setFunction && setFunction(response.data.respondedData)
    return response.data.respondedData
  } catch (error) {
    clearTimeout(timerId)

    if (import.meta.env.VITE_MODE === "DEVELOPMENT") {
      console.dir(error)
    }

    if (error.response.data.message === "Access Denied: Invalid Token.") {
      setIsError && setIsError("Invalid Token.")
      return
    }

    if (error.name === "CanceledError") {
      setIsError && setIsError("Request timeout")
      return
    }

    setIsError && setIsError(error.message)
  }
}

export async function createProject(obj) {
  const controller = new AbortController()

  const timerId = setTimeout(() => {
    controller.abort()
  }, 10000)

  const { body, setFunction, setIsError } = obj

  try {
    const response = await axios.post(
      `${url}/api/projects`,
      body,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        signal: controller.signal,
      },
    )

    clearTimeout(timerId)

    setFunction && setFunction(response.data.respondedData)
    return response.data.respondedData
  } catch (error) {
    clearTimeout(timerId)

    if (import.meta.env.VITE_MODE === "DEVELOPMENT") {
      console.dir(error)
    }

    if (error.response.data.message === "Access Denied: Invalid Token.") {
      setIsError && setIsError("Invalid Token.")
      return
    }

    if (error.name === "CanceledError") {
      setIsError && setIsError("Request timeout")
      return
    }

    setIsError && setIsError(error.message)
  }
}

export async function createTags(obj) {
  const controller = new AbortController()

  const timerId = setTimeout(() => {
    controller.abort()
  }, 10000)

  const { body, setFunction, setIsError } = obj

  try {
    const response = await axios.post(`${url}/api/tags`, body, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      signal: controller.signal,
    })

    clearTimeout(timerId)

    setFunction && setFunction(response.data.respondedData)
    return response.data.respondedData
  } catch (error) {
    clearTimeout(timerId)

    if (import.meta.env.VITE_MODE === "DEVELOPMENT") {
      console.dir(error)
    }

    if (error.response.data.message === "Access Denied: Invalid Token.") {
      setIsError && setIsError("Invalid Token.")
      return
    }

    if (error.name === "CanceledError") {
      setIsError && setIsError("Request timeout")
      return
    }

    setIsError && setIsError(error.message)
  }
}

export async function closedTasksByTeams(obj) {
  const controller = new AbortController()

  const timerId = setTimeout(() => {
    controller.abort()
  }, 10000)

  const { setFunction, setIsError } = obj

  try {
    const response = await axios.get(
      `${url}/api/report/closed-tasks-teams`,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        signal: controller.signal,
      },
    )

    clearTimeout(timerId)

    setFunction && setFunction(response.data.respondedData)
    return response.data.respondedData
  } catch (error) {
    clearTimeout(timerId)

    if (import.meta.env.VITE_MODE === "DEVELOPMENT") {
      console.dir(error)
    }

    if (error.response.data.message === "Access Denied: Invalid Token.") {
      setIsError && setIsError("Invalid Token.")
      return
    }

    if (error.name === "CanceledError") {
      setIsError && setIsError("Request timeout")
      return
    }

    setIsError && setIsError(error.message)
  }
}

export async function closedTasksByOwner(obj) {
  const controller = new AbortController()

  const timerId = setTimeout(() => {
    controller.abort()
  }, 10000)

  const { setFunction, setIsError } = obj

  try {
    const response = await axios.get(
      `${url}/api/report/closed-tasks-owners`,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        signal: controller.signal,
      },
    )

    clearTimeout(timerId)

    setFunction && setFunction(response.data.respondedData)
    return response.data.respondedData
  } catch (error) {
    clearTimeout(timerId)

    if (import.meta.env.VITE_MODE === "DEVELOPMENT") {
      console.dir(error)
    }

    if (error.response.data.message === "Access Denied: Invalid Token.") {
      setIsError && setIsError("Invalid Token.")
      return
    }

    if (error.name === "CanceledError") {
      setIsError && setIsError("Request timeout")
      return
    }

    setIsError && setIsError(error.message)
  }
}

export async function pendingTasksByOwner(obj) {
  const controller = new AbortController()

  const timerId = setTimeout(() => {
    controller.abort()
  }, 10000)

  const { setFunction, setIsError } = obj

  try {
    const response = await axios.get(
      `${url}/api/report/pending`,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        signal: controller.signal,
      },
    )

    clearTimeout(timerId)

    setFunction && setFunction(response.data.respondedData)
    return response.data.respondedData
  } catch (error) {
    clearTimeout(timerId)

    if (import.meta.env.VITE_MODE === "DEVELOPMENT") {
      console.dir(error)
    }

    if (error.response.data.message === "Access Denied: Invalid Token.") {
      setIsError && setIsError("Invalid Token.")
      return
    }

    if (error.name === "CanceledError") {
      setIsError && setIsError("Request timeout")
      return
    }

    setIsError && setIsError(error.message)
  }
}

export async function updateTask(obj) {
  const { taskId, body, setFunction, setIsError } = obj

  const controller = new AbortController()

  const timerId = setTimeout(() => {
    controller.abort()
  }, 10000)

  try {
    const response = await axios.patch(
      `${url}/api/tasks/${taskId}`,
      body,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        signal: controller.signal,
      },
    )

    clearTimeout(timerId)

    setFunction && setFunction(response.data.respondedData)
    return response.data.respondedData
  } catch (error) {
    clearTimeout(timerId)

    if (import.meta.env.VITE_MODE === "DEVELOPMENT") {
      console.dir(error)
    }

    if (error.response.data.message === "Access Denied: Invalid Token.") {
      setIsError && setIsError("Invalid Token.")
      return
    }

    if (error.name === "CanceledError") {
      setIsError && setIsError("Request timeout")
      return
    }

    setIsError && setIsError(error.message)
  }
}

export async function deleteTask(obj) {
  const { taskId, setIsError } = obj

  const controller = new AbortController()

  const timerId = setTimeout(() => {
    controller.abort()
  }, 10000)

  try {
    const response = await axios.delete(
      `${url}/api/tasks/${taskId}`,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        signal: controller.signal,
      },
    )

    clearTimeout(timerId)
  } catch (error) {
    clearTimeout(timerId)

    if (import.meta.env.VITE_MODE === "DEVELOPMENT") {
      console.dir(error)
    }

    if (error.response.data.message === "Access Denied: Invalid Token.") {
      setIsError && setIsError("Invalid Token.")
      return
    }

    if (error.name === "CanceledError") {
      setIsError && setIsError("Request timeout")
      return
    }

    setIsError && setIsError(error.message)
  }
}

export async function updateUserProfile(obj) {
  const { body, setFunction, setIsError } = obj

  const controller = new AbortController()

  const timerId = setTimeout(() => {
    controller.abort()
  }, 10000)

  try {
    const response = await axios.patch(
      `${url}/api/users/profile`,
      body,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        signal: controller.signal,
      },
    )

    clearTimeout(timerId)

    setFunction && setFunction(response.data.respondedData)
    return response.data.respondedData
  } catch (error) {
    clearTimeout(timerId)

    if (import.meta.env.VITE_MODE === "DEVELOPMENT") {
      console.dir(error)
    }

    if (error.response.data.message === "Access Denied: Invalid Token.") {
      setIsError && setIsError("Invalid Token.")
      return
    }

    if (error.name === "CanceledError") {
      setIsError && setIsError("Request timeout")
      return
    }

    setIsError && setIsError(error.message)
  }
}

export async function updateTeam(obj) {
  const { teamId, body, setFunction, setIsError } = obj

  const controller = new AbortController()

  const timerId = setTimeout(() => {
    controller.abort()
  }, 10000)

  try {
    const response = await axios.patch(
      `${url}/api/teams/${teamId}`,
      body,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        signal: controller.signal,
      },
    )

    clearTimeout(timerId)

    setFunction && setFunction(response.data.respondedData)
    return response.data.respondedData
  } catch (error) {
    clearTimeout(timerId)

    if (import.meta.env.VITE_MODE === "DEVELOPMENT") {
      console.dir(error)
    }

    if (error.response.data.message === "Access Denied: Invalid Token.") {
      setIsError && setIsError("Invalid Token.")
      return
    }

    if (error.name === "CanceledError") {
      setIsError && setIsError("Request timeout")
      return
    }

    setIsError && setIsError(error.message)
  }
}
