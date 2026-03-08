import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/types/user";

type AuthUserStore = {
  user: User;
  isAuthenticated: boolean;
  setUser: (user: User) => void;
  clearIsAuthenticated: () => void;
};

const initialUser: User = {
  username: "",
  email: "",
  avatar: "",
};

export const useAuthUserStore = create<AuthUserStore>()(
  persist(
    (set) => ({
      user: initialUser,
      isAuthenticated: false,
      setUser: (user) =>
        set({
          user,
          isAuthenticated: true,
        }),
      clearIsAuthenticated: () =>
        set({
          user: initialUser,
          isAuthenticated: false,
        }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
