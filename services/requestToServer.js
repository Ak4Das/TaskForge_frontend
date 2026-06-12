import axios from "axios"

export async function fetchAllProjects(obj) {
  const controller = new AbortController()

  const timerId = setTimeout(() => {
    controller.abort()
  }, 10000)

  const { setFunction, setIsError } = obj

  try {
    const response = await axios.get("http://localhost:3000/api/projects", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      signal: controller.signal,
    })

    clearTimeout(timerId)

    setFunction && setFunction(response.data.respondedData)
    return response.data.respondedData
  } catch (error) {
    clearTimeout(timerId)

    if (error.response.data.message === "Access Denied: Invalid Token.") {
      setIsError && setIsError("Invalid Token.")
      return
    }

    if (error.name === "CanceledError") {
      setIsError && setIsError("Request timeout")
      return
    }

    if (error.response) {
      throw new Error("Request failed")
    }

    throw error
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
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      signal: controller.signal,
    })

    clearTimeout(timerId)

    setFunction && setFunction(response.data.respondedData)
    return response.data.respondedData
  } catch (error) {
    clearTimeout(timerId)

    if (error.response.data.message === "Access Denied: Invalid Token.") {
      setIsError && setIsError("Invalid Token.")
      return
    }

    if (error.name === "CanceledError") {
      setIsError && setIsError("Request timeout")
      return
    }

    if (error.response) {
      throw new Error("Request failed")
    }

    throw error
  }
}

export async function fetchTeams(obj) {
  const controller = new AbortController()

  const timerId = setTimeout(() => {
    controller.abort()
  }, 10000)

  const { setFunction, setIsError } = obj

  try {
    const response = await axios.get("http://localhost:3000/api/teams", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      signal: controller.signal,
    })

    clearTimeout(timerId)

    setFunction && setFunction(response.data.respondedData)
    return response.data.respondedData
  } catch (error) {
    clearTimeout(timerId)

    if (error.response.data.message === "Access Denied: Invalid Token.") {
      setIsError && setIsError("Invalid Token.")
      return
    }

    if (error.name === "CanceledError") {
      setIsError && setIsError("Request timeout")
      return
    }

    if (error.response) {
      throw new Error("Request failed")
    }

    throw error
  }
}

export async function fetchUsers(obj) {
  const controller = new AbortController()

  const timerId = setTimeout(() => {
    controller.abort()
  }, 10000)

  const { setFunction, setIsError } = obj

  try {
    const response = await axios.get("http://localhost:3000/api/users", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      signal: controller.signal,
    })

    clearTimeout(timerId)

    setFunction && setFunction(response.data.respondedData)
    return response.data.respondedData
  } catch (error) {
    clearTimeout(timerId)

    if (error.response.data.message === "Access Denied: Invalid Token.") {
      setIsError && setIsError("Invalid Token.")
      return
    }

    if (error.name === "CanceledError") {
      setIsError && setIsError("Request timeout")
      return
    }

    if (error.response) {
      throw new Error("Request failed")
    }

    throw error
  }
}

export async function fetchTags(obj) {
  const controller = new AbortController()

  const timerId = setTimeout(() => {
    controller.abort()
  }, 10000)

  const { setFunction, setIsError } = obj

  try {
    const response = await axios.get("http://localhost:3000/api/tags", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      signal: controller.signal,
    })

    clearTimeout(timerId)

    setFunction && setFunction(response.data.respondedData)
    return response.data.respondedData
  } catch (error) {
    clearTimeout(timerId)

    if (error.response.data.message === "Access Denied: Invalid Token.") {
      setIsError && setIsError("Invalid Token.")
      return
    }

    if (error.name === "CanceledError") {
      setIsError && setIsError("Request timeout")
      return
    }

    if (error.response) {
      throw new Error("Request failed")
    }

    throw error
  }
}

export async function fetchMe(obj) {
  const controller = new AbortController()

  const timerId = setTimeout(() => {
    controller.abort()
  }, 10000)

  const { setFunction, setIsError } = obj

  try {
    const response = await axios.get("http://localhost:3000/api/auth/me", {
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

    if (error.response.data.message === "Access Denied: Invalid Token.") {
      setIsError && setIsError("Invalid Token.")
      return
    }

    if (error.name === "CanceledError") {
      setIsError && setIsError("Request timeout")
      return
    }

    if (error.response) {
      throw new Error("Request failed")
    }

    throw error
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
      `http://localhost:3000/api/tasks/${taskId}`,
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

    if (error.response.data.message === "Access Denied: Invalid Token.") {
      setIsError && setIsError("Invalid Token.")
      return
    }

    if (error.name === "CanceledError") {
      setIsError && setIsError("Request timeout")
      return
    }

    if (error.response) {
      throw new Error("Request failed")
    }

    throw error
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
      "http://localhost:3000/api/auth/login",
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

    if (error.response.data.message === "User not found.") {
      setIsError && setIsError("User not found.")
      return
    }

    if (error.name === "CanceledError") {
      setIsError && setIsError("Request timeout")
      return
    }

    throw error
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
      "http://localhost:3000/api/auth/signup",
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

    if (error.response.data.message === "This email is already active.") {
      setIsError && setIsError("This email is already active.")
      return
    }

    if (error.name === "CanceledError") {
      setIsError && setIsError("Request timeout")
      return
    }

    if (error.response) {
      throw new Error("Request failed")
    }

    throw error
  }
}

export async function createTeam(obj) {
  const controller = new AbortController()

  const timerId = setTimeout(() => {
    controller.abort()
  }, 10000)

  const { body, setFunction, setIsError } = obj

  try {
    const response = await axios.post("http://localhost:3000/api/teams", body, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      signal: controller.signal,
    })

    clearTimeout(timerId)

    setFunction && setFunction(response.data.respondedData)
    return response.data.respondedData
  } catch (error) {
    clearTimeout(timerId)

    if (error.response.data.message === "Access Denied: Invalid Token.") {
      setIsError && setIsError("Invalid Token.")
      return
    }

    if (error.name === "CanceledError") {
      setIsError && setIsError("Request timeout")
      return
    }

    if (error.response) {
      throw new Error("Request failed")
    }

    throw error
  }
}

export async function createTask(obj) {
  const controller = new AbortController()

  const timerId = setTimeout(() => {
    controller.abort()
  }, 10000)

  const { body, setFunction, setIsError } = obj

  try {
    const response = await axios.post("http://localhost:3000/api/tasks", body, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      signal: controller.signal,
    })

    clearTimeout(timerId)

    setFunction && setFunction(response.data.respondedData)
    return response.data.respondedData
  } catch (error) {
    clearTimeout(timerId)

    if (error.response.data.message === "Access Denied: Invalid Token.") {
      setIsError && setIsError("Invalid Token.")
      return
    }

    if (error.name === "CanceledError") {
      setIsError && setIsError("Request timeout")
      return
    }

    if (error.response) {
      throw new Error("Request failed")
    }

    throw error
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
      "http://localhost:3000/api/projects",
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

    if (error.response.data.message === "Access Denied: Invalid Token.") {
      setIsError && setIsError("Invalid Token.")
      return
    }

    if (error.name === "CanceledError") {
      setIsError && setIsError("Request timeout")
      return
    }

    if (error.response) {
      throw new Error("Request failed")
    }

    throw error
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
      "http://localhost:3000/api/report/closed-tasks-teams",
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

    if (error.response.data.message === "Access Denied: Invalid Token.") {
      setIsError && setIsError("Invalid Token.")
      return
    }

    if (error.name === "CanceledError") {
      setIsError && setIsError("Request timeout")
      return
    }

    if (error.response) {
      throw new Error("Request failed")
    }

    throw error
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
      "http://localhost:3000/api/report/closed-tasks-owners",
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

    if (error.response.data.message === "Access Denied: Invalid Token.") {
      setIsError && setIsError("Invalid Token.")
      return
    }

    if (error.name === "CanceledError") {
      setIsError && setIsError("Request timeout")
      return
    }

    if (error.response) {
      throw new Error("Request failed")
    }

    throw error
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
      "http://localhost:3000/api/report/pending",
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

    if (error.response.data.message === "Access Denied: Invalid Token.") {
      setIsError && setIsError("Invalid Token.")
      return
    }

    if (error.name === "CanceledError") {
      setIsError && setIsError("Request timeout")
      return
    }

    if (error.response) {
      throw new Error("Request failed")
    }

    throw error
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
      `http://localhost:3000/api/tasks/${taskId}`,
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

    if (error.response.data.message === "Access Denied: Invalid Token.") {
      setIsError && setIsError("Invalid Token.")
      return
    }

    if (error.name === "CanceledError") {
      setIsError && setIsError("Request timeout")
      return
    }

    if (error.response) {
      throw new Error("Request failed")
    }

    throw error
  }
}
