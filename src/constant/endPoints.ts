export const ApiEndpoints = Object.freeze({
    members: {
        get: {
            membersData: (page: number = 1, limit: number = 10) => `/api/members?filters[is_active][$eq]=true?pagination[page]=${page}&pagination[pageSize]=${limit}`
        },
        post: {
            addMemebr: "/api/members"
        },
        put: {
            updateMember: (memberId: string) => `/api/members/${memberId}`
        },
        delete: {
            deleteMember: (memberId: string) => `/api/members/${memberId}`
        }
    },
    dashboadr: {
        get: {
            stats: "/api/member/stats",
            latestRegistartion: "/api/members/latest",
            searchByPhone: (phone:number) => `/api/member/search?phone=${phone}`
        }
    },
    auth: {
        validateToken: "/api/users/me",
        login: "/api/auth/local",
        register: "/api/auth/register"
    },
});
