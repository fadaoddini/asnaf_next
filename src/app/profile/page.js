"use client";

import styles from "@/styles/profile.module.css";
import { useEffect, useState } from "react";
import axios from "axios";
import Config from "@/config/config";
import UserCard from "@/components/profile/myuser/UserCard";
import { useAuth } from "@/context/AuthContext";
import UserInfo from "@/components/profile/info/UserInfo";
import EditProfileForm from "@/components/profile/user/EditProfileForm";
import MyBids from "@/components/profile/mybid/MyBidList";
import MyProduct from "@/components/profile/myproduct/MyProduct";

export default function Profile() {
  const { user, isAuthenticated } = useAuth();
  const [error, setError] = useState(null);
  const [user_info, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [activeTab, setActiveTab] = useState("edit"); // مدیریت تب فعال

  const handleTabClick = (tab) => setActiveTab(tab); // تغییر تب فعال

  // دریافت توکن از localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const fetchData = async () => {
    try {
      if (!token) return;
      const response = await axios.get(
        Config.getApiUrl("login", "profile/info"),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError(error);
    }
  };

  useEffect(() => {
    if (token && isAuthenticated) {
      fetchData();
    }
  }, [token, isAuthenticated]);

  if (error) {
    return <div>خطا در دریافت اطلاعات: {error.message}</div>;
  }

  if (!user_info) {
    return <div>در حال بارگذاری...</div>;
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "edit":
        return (
          <EditProfileForm 
            token={token} 
            user_info={user_info} 
          />
        );
      case "suggestions":
        return <div>
          <MyBids />
        </div>;
      case "ads":
        return <div> 
          <MyProduct/>
        </div>;
      case "saved":
        return <div>ذخیره شده‌ها</div>;
      default:
        return <div>محتوا پیدا نشد!</div>;
    }
  };
  
  return (
    <div className={`${styles.container}`}>
      <div className={styles.layout}>
        <div className={styles.right}>
          <div className={styles.row_right}>
            {isAuthenticated && user_info && (
              <UserCard
                imageUrl={`${Config.baseUrl}${user_info.image}`}
                name={`${user_info.first_name} ${user_info.last_name}`}
                mobile={user_info.mobile}
                userId={user_info.id}
                userIdViewer={user_info?.id}
                productCount={user_info.product_count}
              />
            )}
          </div>
          <div className={styles.row_right}>
            <UserInfo
              onEdit={() => handleTabClick("edit")}
              onSuggestions={() => handleTabClick("suggestions")}
              onAds={() => handleTabClick("ads")}
              onSaved={() => handleTabClick("saved")}
              onLogout={() => alert("خروج از حساب کاربری")}
            />
          </div>
        </div>

        <div className={styles.left}>
          <div className={styles.body_tab}>{renderTabContent()}</div>
        </div>
      </div>
    </div>
  );
}