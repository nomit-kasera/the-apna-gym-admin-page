import { createStore } from "zustand/vanilla";
import createBoundedUseStore from "@/utils/createBoundedUseStore";

type State = {
  name: string;
  email: string;
  isAuthenticated: boolean;
  token: string;
  isVerified: boolean;
  accountStatus: string;
  user_id: string,
};

type Action = {
  setUserProfile: (
    name: string,
    email: string,
    user_id: string,
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
  setUserProfile: (
    name: string,
    email: string,
    user_id: string,
  ) =>
    set(() => ({
      name,
      email,
      user_id,
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
      accountStatus: "",
      token: "",
      isAuthenticated: false,
      user_id: "",
    })),
}));

// Create a hook to be used inside react components
const useUserStore = createBoundedUseStore(userStore);

export default useUserStore;
