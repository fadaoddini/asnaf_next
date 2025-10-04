"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Config from "@/config/config";
import useCheckToken from "@/hook/useCheckToken";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const router = useRouter();
  const { isAuthenticated, loading } = useCheckToken();
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (loading) return;

    if (isAuthenticated) {
      const fetchUserData = async () => {
        try {
          const accessToken = localStorage.getItem("accessToken");
          if (!accessToken) {
            console.log("Access token is missing");
            return;
          }

          const response = await axios.get(
            Config.getApiUrl("login", "profile/info"),
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          setUser(response.data); 
          console.log("User data:", response.data);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };

      fetchUserData();
    } else {
      console.log("متاسفانه اطلاعات از سرور به دست ما نرسید");
    }
  }, [isAuthenticated, loading, router]);

  const login = async (mobile, code) => {
    try {
      const response = await axios.post(
        Config.getApiUrl("login", "verifyCode"),
        { mobile, code }
      );
      if (response.status === 200) {
        localStorage.setItem("accessToken", response.data.access_token);
        localStorage.setItem("refreshToken", response.data.refresh_token);
        setUser(response.data.user);
        router.push("/");
        window.location.reload();
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setUser(null);
    router.push("/");
    window.location.reload();
  };

  // توابع کمکی برای بررسی دسترسی‌ها
  const isAdmin = () => {
    return user?.is_admin || user?.is_superuser;
  };

  const isStaff = () => {
    return user?.is_staff_user || user?.is_staff;
  };

  const hasAdminAccess = () => {
    return isAdmin() || isStaff();
  };

  const isLoggedIn = () => {
    return isAuthenticated && !loading;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        login,
        logout,
        isAdmin,        // اضافه کردن تابع بررسی ادمین
        isStaff,        // اضافه کردن تابع بررسی staff
        hasAdminAccess, // اضافه کردن تابع بررسی دسترسی ادمین
        isLoggedIn, // اضافه کردن تابع بررسی لاگین

      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);