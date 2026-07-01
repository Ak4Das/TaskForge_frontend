import { useEffect, useState } from "react"
import context from "./createContexts"
import { fetchMe } from "../../services/requestToServer"
import { useNavigate } from "react-router-dom"

export default function ContextProvider({ children }) {
  const [user, setUser] = useState({})
  const [error, setIsError] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    async function fetchData() {
      const token = localStorage.getItem("token")
      if (token) {
        await fetchMe({ setFunction: setUser, setIsError })
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    if (error === "Invalid Token.") {
      navigate("/login")
    }
  }, [error])

  return <context.Provider value={{ user }}>{children}</context.Provider>
}
