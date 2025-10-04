"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Config from "@/config/config";

const useCheckToken = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // اگر توکن معتبر باشد true، در غیر این صورت false
  const [loading, setLoading] = useState(true); // وضعیت در حال بارگذاری
  const [error, setError] = useState(null); // ارور‌ها

  useEffect(() => {
    const checkToken = async () => {
      if (typeof window === "undefined") return; // بررسی اینکه کد در سمت کاربر اجرا می‌شود

      setLoading(true);
      setIsAuthenticated(null);

      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");

     

      // اگر هیچ توکنی وجود ندارد
      if (!accessToken && !refreshToken) {
        console.log("کاربر لاگین نمی باشد");
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      // اگر فقط refreshToken موجود است
      if (!accessToken && refreshToken) {
       
        try {
          const response = await axios.post(
            Config.getApiUrl("login", "refreshToken"),
            { refresh: refreshToken }
          );

          // ذخیره توکن‌های جدید
          localStorage.setItem("accessToken", response.data.access);
          localStorage.setItem("refreshToken", response.data.refresh);
          setIsAuthenticated(true);
        } catch (refreshError) {
          console.log(
            "خطا در ریفرش کردن توکن: ",
            refreshError.response ? refreshError.response.data : refreshError
          );
          setError(refreshError); 
          setIsAuthenticated(false);
        } finally {
          setLoading(false);
        }
        return;
      }

      // اگر accessToken موجود است، بررسی اعتبار آن
      if (accessToken) {
        try {
          await axios.get(Config.getApiUrl("login", "profile/info"), {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          setIsAuthenticated(true);
        } catch (error) {
          console.log("خطا در اعتبارسنجی توکن: ", error);

          // تلاش برای استفاده از refreshToken در صورت وجود
          if (refreshToken) {
            try {
              const response = await axios.post(
                Config.getApiUrl("login", "refreshToken"),
                { refresh: refreshToken }
              );

              // ذخیره توکن‌های جدید
              localStorage.setItem("accessToken", response.data.access);
              localStorage.setItem("refreshToken", response.data.refresh);
              setIsAuthenticated(true);
            } catch (refreshError) {
              console.log(
                "خطا در ریفرش کردن توکن: ",
                refreshError.response ? refreshError.response.data : refreshError
              );
              setError(refreshError);
              setIsAuthenticated(false);
            }
          } else {
            setIsAuthenticated(false);
          }
        } finally {
          setLoading(false);
        }
      }
    };

    checkToken();
  }, []);

  return { isAuthenticated, loading, error };
};

export default useCheckToken;
