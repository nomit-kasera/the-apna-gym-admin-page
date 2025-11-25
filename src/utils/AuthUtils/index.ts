import {
  AuthUtilsSetProfileInStorageErrorCode,
  AuthUtilsSignOutErrorCode,
} from "@/constant/customErrorCodes";
import { UserProfileKey } from "@/constant/storageKeys";

import { logger } from "../Logger";

export interface ProfileObject {
  name: string;
  email: string;
  token: string;
  user_id: string;
}

export const setProfileInStorage = (profileObj: ProfileObject): boolean => {
  try {
    localStorage.setItem(UserProfileKey, JSON.stringify(profileObj));
    return true;
  } catch (err: any) {
    logger.error(`[ERROR_CODE: ${AuthUtilsSetProfileInStorageErrorCode}]`, err);
    return false;
  }
};

export const getProfileFromStorage = (): ProfileObject | null => {
  try {
    const data = localStorage.getItem(UserProfileKey);
    if (!data) throw new Error("Profile not set");
    return JSON.parse(data);
  } catch (err: any) {
    return null;
  }
};

export const signOut = (): boolean => {
  try {
    localStorage.removeItem(UserProfileKey);
    return true;
  } catch (err: any) {
    logger.error(`[ERROR_CODE: ${AuthUtilsSignOutErrorCode}]`, err);
    return false;
  }
};
