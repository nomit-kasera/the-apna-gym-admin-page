"use client"

import LoginPage from "@/Module/Login"
import { useState } from "react"
import Dashboard from "./dashboard/home"
import { Box } from "@chakra-ui/react"
import withAuth from "@/Components/Auth/withAuth"

function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [adminName, setAdminName] = useState("")

  const handleLogin = (name: string) => {
    setAdminName(name)
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setAdminName("")
  }

  return (
    <Box>
      <Dashboard adminName={adminName} onLogout={handleLogout} />
    </Box>
  )
}

export default withAuth(Home)
