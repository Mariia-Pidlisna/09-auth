"use client";
import { useEffect, useState } from "react"; 
import { checkSession, getMe } from "@/lib/api/clientApi";
import { useAuthUserStore } from "@/lib/store/authStore";

type Props = {
  children: React.ReactNode;
};

const AuthProvider = ({ children }: Props) => {
   const [isLoading, setIsLoading] = useState(true);
  const setUser = useAuthUserStore((state) => state.setUser);
  const clearIsAuthenticated = useAuthUserStore(
    (state) => state.clearIsAuthenticated
  );

useEffect(() => {
    const fetchUser = async () => {
      try {
        const isAuthenticated = await checkSession();
        if (isAuthenticated) {
          const user = await getMe();
          if (user) setUser(user);
        } else {
          clearIsAuthenticated();
        }
      } catch (e) {
        clearIsAuthenticated();
      } finally {
        setIsLoading(false); 
      }
    };
    fetchUser();
  }, [setUser, clearIsAuthenticated]);

  if (isLoading) {
    return <div className="loader">Loading...</div>; 
  }

  return children;
};

export default AuthProvider;