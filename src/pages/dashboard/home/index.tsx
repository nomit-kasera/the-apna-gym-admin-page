"use client"
import withAuth from "@/Components/Auth/withAuth"
import Layout from "@/Components/Layout"
import DashboardOverview from "@/Module/Dashboard-Overview"

interface DashboardProps {
    adminName: string
    onLogout: () => void
}

function Dashboard() {

    return (
        <Layout
            pageTitle="overview"
        >
            <DashboardOverview />
        </Layout>
    )
}

export default withAuth(Dashboard)