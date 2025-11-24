import { createStore } from "zustand/vanilla";
import createBoundedUseStore from "@/utils/createBoundedUseStore";

type State = {
  name: string;
  email: string;
  isAuthenticated: boolean;
  profilePic: string;
  token: string;
  isVerified: boolean;
  accountStatus: string;
  user_id: string,
  role: string
};

type Action = {
  setUserProfile: (
    name: string,
    email: string,
    profilePic: string,
    user_id: string,
    role: string,
  ) => void;
  setToken: (token: string) => void;
  setAuthenticated: (val: boolean) => void;
  reset: () => void;
};

// using createStore from zustand/vanilla instead of store because we want to use this state outside of react components
export const userStore = createStore<State & Action>()((set) => ({
  name: "",
  email: "",
  profilePic: "",
  token: "",
  accountStatus: "",
  isVerified: false,
  isAuthenticated: false,
  user_id: "",
  role: "",
  setUserProfile: (
    name: string,
    email: string,
    profilePic: string,
    user_id: string,
    role: string
  ) =>
    set(() => ({
      name,
      email,
      profilePic,
      user_id,
      role
    })),
  setToken: (token) =>
    set(() => ({
      token,
    })),
  setAuthenticated: (isAuthenticated) =>
    set(() => ({
      isAuthenticated,
    })),
  reset: () =>
    set(() => ({
      name: "",
      email: "",
      profilePic: "",
      accountStatus: "",
      token: "",
      isAuthenticated: false,
      user_id: "",
      role: ""
    })),
}));

// Create a hook to be used inside react components
const useUserStore = createBoundedUseStore(userStore);

export default useUserStore;
