export const ApiEndpoints = Object.freeze({
    members: {
        get: {
            membersData: (page: number = 1, limit: number = 10) =>  `/api/members?pagination[page]=${page}&pagination[pageSize]=${limit}`
        }
    },
    auth: {
        validateToken: "/internal/auth/validate-token",
        login: "/internal/auth/login",
        register: "/internal/auth/register"
    },
});
