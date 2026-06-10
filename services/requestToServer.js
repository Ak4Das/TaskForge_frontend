import axios from "axios"

export async function fetchAllProjects(obj) {
  const controller = new AbortController()

  const timerId = setTimeout(() => {
    controller.abort()
  }, 10000)

  try {
    const { setFunction, setIsError } = obj
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

  try {
    const { taskEndpoint, setFunction, setIsError } = obj
    const response = await axios.get(taskEndpoint, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      signal: controller.signal,
    })

    clearTimeout(timerId)

    setFunction && setFunction(response.data.respondedData)
    return response.data.respondedData
  } catch (error) {
    clearTimeout(timerId)

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

  try {
    const { setFunction, setIsError } = obj
    const response = await axios.get("http://localhost:3000/api/teams", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      signal: controller.signal,
    })

    clearTimeout(timerId)

    setFunction && setFunction(response.data.respondedData)
    return response.data.respondedData
  } catch (error) {
    clearTimeout(timerId)

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

  try {
    const { setFunction, setIsError } = obj
    const response = await axios.get("http://localhost:3000/api/users", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      signal: controller.signal,
    })

    clearTimeout(timerId)

    setFunction && setFunction(response.data.respondedData)
    return response.data.respondedData
  } catch (error) {
    clearTimeout(timerId)

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

  try {
    const { taskId, setFunction, setIsError } = obj
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

  try {
    const { body, setFunction, setIsError } = obj
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

export async function signUp(obj) {
  const controller = new AbortController()

  const timerId = setTimeout(() => {
    controller.abort()
  }, 10000)

  try {
    const { body, setFunction, setIsError } = obj
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

  try {
    const { body, setFunction, setIsError } = obj
    const response = await axios.post("http://localhost:3000/api/teams", body, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      signal: controller.signal,
    })

    clearTimeout(timerId)

    setFunction && setFunction(response.data.respondedData)
    return response.data.respondedData
  } catch (error) {
    clearTimeout(timerId)

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

  try {
    const { body, setFunction, setIsError } = obj
    const response = await axios.post("http://localhost:3000/api/tasks", body, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      signal: controller.signal,
    })

    clearTimeout(timerId)

    setFunction && setFunction(response.data.respondedData)
    return response.data.respondedData
  } catch (error) {
    clearTimeout(timerId)

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

export async function closedTasks(obj) {
  const controller = new AbortController()

  const timerId = setTimeout(() => {
    controller.abort()
  }, 10000)

  try {
    const { setFunction, setIsError } = obj
    const response = await axios.get(
      "http://localhost:3000/api/report/closed-tasks",
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
