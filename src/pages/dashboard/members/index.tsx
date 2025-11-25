"use client"
import withAuth from "@/Components/Auth/withAuth"
import Layout from "@/Components/Layout"
import UserManagement from "@/Module/UserManagement"

function Members() {

    return (
        <Layout
            pageTitle="Members"
        >
            <UserManagement />
        </Layout>
    )
}

export default withAuth(Members)