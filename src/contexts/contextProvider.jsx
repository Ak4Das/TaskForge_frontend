import { useEffect, useState } from "react"
import context from "./createContexts"
import { fetchMe } from "../../services/requestToServer"

export default function ContextProvider({ children }) {
  const [user, setUser] = useState({})

  useEffect(() => {
    async function fetchData() {
      const token = localStorage.getItem("token")
      if (token) {
        const response = await fetchMe({ setFunction: setUser })

        if (!response) {
          setUser(null)
        }
      } else {
        setUser(null)
      }
    }
    fetchData()
  }, [])

  return (
    <context.Provider value={{ user, setUser }}>{children}</context.Provider>
  )
}
