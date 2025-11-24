"use client"

import LoginPage from "@/Module/Login"
import { useState } from "react"
import Dashboard from "./dashboard"

export default function Home() {
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
    <div>
      {isAuthenticated ? (
        <Dashboard adminName={adminName} onLogout={handleLogout} />
      ) : (
        <LoginPage onLogin={handleLogin} />
      )}
    </div>
  )
}
