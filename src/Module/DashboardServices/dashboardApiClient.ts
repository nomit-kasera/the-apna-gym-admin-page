import { ApiEndpoints } from "@/constant/endPoints";
import { BaseApiClient } from "@/services/baseApiClient";
import { getProfileFromStorage } from "@/utils/AuthUtils";
import { getErrorMessageFromAxios } from "@/utils/getErrorMessage";

export type ValidateTokenBody = {
    token: string;
};

export type LoginBody = {
    identifier: string;
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
    jwt: string,
    user: {
        id: number,
        documentId: string,
        username: string,
        email: string,
        createdAt: string,
        updatedAt: string,
    }
}

export interface Member {
    id?: number;
    documentId?: string;
    full_name: string;
    phone_number: string;
    email: string;
    membership_type: "monthly" | "quarterly" | "half yearly" | "yearly";
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

interface AddUpdateMemberBody {
    data: {
        full_name: string,
        phone_number: string,
        email: string,
        membership_type: "monthly" | "quarterly" | "half yearly" | "yearly";
        start_date: string,
        end_date: string,
        is_active?: boolean
    }
}

export interface StatsResponse {
    totalMembers: number;
    activeMembers: number;
    monthlyRevenue: number;
    expiringByMonth: Record<string, number>;
    membershipBreakdown: {
        monthly: number,
        quarterly: number,
        yearly: number
        halfyearly: number
    }
}

export interface LatestRegistration {
    id: number;
    full_name: string;
    membership_type: "monthly" | "quarterly" | "half yearly" | "yearly";
    createdAt: string; // ISO date string
}

export type LatestRegistrationsResponse = LatestRegistration[];


export class ApiClient extends BaseApiClient {
    constructor() {
        super({});
    }



    async validateToken(token: string) {
        const profileData = getProfileFromStorage();
        try {
            const resp = await this.secureApiCall({
                type: "GET",
                url: ApiEndpoints.auth.validateToken,
                token: token
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
            const resp = await this.secureApiCall({
                type: "GET",
                url: ApiEndpoints.members.get.membersData(page, limit),
            });
            return resp.data;
        } catch (err: any) {
            return Promise.reject(getErrorMessageFromAxios(err));
        }
    }

    async updateMember(body: AddUpdateMemberBody, memberId: string): Promise<MembersApiResponse> {
        try {
            const resp = await this.secureApiCall({
                type: "PUT",
                url: ApiEndpoints.members.put.updateMember(memberId),
                body
            });
            return resp.data;
        } catch (err: any) {
            return Promise.reject(getErrorMessageFromAxios(err));
        }
    }

    async deleteMember(memberId: string): Promise<MembersApiResponse> {
        try {
            const resp = await this.secureApiCall({
                type: "DELETE",
                url: ApiEndpoints.members.delete.deleteMember(memberId)
            });
            return resp.data;
        } catch (err: any) {
            return Promise.reject(getErrorMessageFromAxios(err));
        }
    }

    async addMember(body: AddUpdateMemberBody): Promise<MembersApiResponse> {
        try {
            const resp = await this.secureApiCall({
                type: "POST",
                url: ApiEndpoints.members.post.addMemebr,
                body
            });
            return resp.data;
        } catch (err: any) {
            return Promise.reject(getErrorMessageFromAxios(err));
        }
    }

    async getStats(): Promise<StatsResponse> {
        try {
            const resp = await this.apiCall({
                type: "GET",
                url: ApiEndpoints.dashboadr.get.stats,
            });
            return resp.data;
        } catch (err: any) {
            return Promise.reject(getErrorMessageFromAxios(err));
        }
    }

    async getLatestRegistation(): Promise<LatestRegistration[]> {
        try {
            const resp = await this.apiCall({
                type: "GET",
                url: ApiEndpoints.dashboadr.get.latestRegistartion,
            });
            return resp.data;
        } catch (err: any) {
            return Promise.reject(getErrorMessageFromAxios(err));
        }
    }


}

export const dashboardApiClient = new ApiClient();