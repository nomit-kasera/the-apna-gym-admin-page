import { ApiEndpoints } from "@/constant/endPoints";
import { BaseApiClient } from "@/services/baseApiClient";
import { getErrorMessageFromAxios } from "@/utils/getErrorMessage";


export type ValidateTokenBody = {
    token: string;
};

export type LoginBody = {
    email: string;
    password: string;
};

export interface UserDetails {
    name: string;
    email: string;
    username: string;
    profile_pic: string;
    role: string;
}

export interface LoginResponse {
    status: string;
    user_id: string;
    details: UserDetails;
    token: string;
    role: string;
}

export interface Member {
    id: number;
    full_name: string;
    phone_number: string;
    email: string;
    membership_type: "monthly" | "quarterly" | "yearly";
    start_date: string;        // ISO date format
    end_date: string;          // ISO date format
    is_active?: boolean;
    membership_status: "active" | "expired" | "expiring_soon";
    createdAt?: string;
    updatedAt?: string;
}


export interface Pagination {
    start: number;
    limit: number;
    total: number;
}


export interface MembersApiResponse {
    data: Member[];
    meta: {
        pagination: Pagination;
    };
}



export class ApiClient extends BaseApiClient {
    constructor() {
        super({});
    }


    async validateToken(body: ValidateTokenBody) {
        try {
            const resp = await this.apiCall({
                type: "POST",
                url: ApiEndpoints.auth.validateToken,
                body: {
                    token: body.token,
                },
            });
            return resp.data.is_valid;
        } catch (err: any) {
            return Promise.reject(getErrorMessageFromAxios(err));
        }
    }

    async login(body: LoginBody): Promise<LoginResponse> {
        try {
            const resp = await this.apiCall({
                type: "POST",
                url: ApiEndpoints.auth.login,
                body,
            });
            return resp.data;
        } catch (err: any) {
            return Promise.reject(getErrorMessageFromAxios(err));
        }
    }


    async getMembers(page: number = 1, limit: number = 10): Promise<MembersApiResponse> {
        try {
            const resp = await this.apiCall({
                type: "GET",
                url: ApiEndpoints.members.get.membersData(page, limit),
            });
            return resp.data;
        } catch (err: any) {
            return Promise.reject(getErrorMessageFromAxios(err));
        }
    }


}

export const dashboardApiClient = new ApiClient();