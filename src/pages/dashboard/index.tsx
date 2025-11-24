"use client"
import Layout from "@/Components/Layout"
import DashboardOverview from "@/Module/Dashboard-Overview"
import UserManagement from "@/Module/UserManagement"
import { useState } from "react"

interface DashboardProps {
    adminName: string
    onLogout: () => void
}

export default function Dashboard({ adminName, onLogout }: DashboardProps) {
    const [activeTab, setActiveTab] = useState<"overview" | "users">("overview")

    const pageTitle = activeTab === "overview" ? "Dashboard Overview" : "User Management"

    return (
        <Layout
            adminName={adminName}
            onLogout={onLogout}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            pageTitle={pageTitle}
        >
            {activeTab === "overview" && <DashboardOverview />}
            {activeTab === "users" && <UserManagement />}
        </Layout>
    )
}
