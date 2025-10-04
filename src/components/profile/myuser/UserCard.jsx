import { useState, useEffect } from "react";
import axios from "axios";
import Config from "config/config";
import styles from "./UserCard.module.css"; // مطمئن شوید که استایل‌های مناسب را اضافه کنید
import useCheckToken from "@/hook/useCheckToken";
import UserInfo from "../info/UserInfo";

const UserCard = ({
  imageUrl: initialImageUrl,
  name,
  mobile,
  userId,
  userIdViewer,
  productCount,
}) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [imageUrl, setImageUrl] = useState(
    initialImageUrl || "/images/avatar.png"
  );
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const isLoggedIn = useCheckToken();
  const token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

  // چک کردن وضعیت دنبال‌کردن کاربر
  const checkFollowingStatus = async () => {
    if (isLoggedIn && token) {
      try {
        const response = await axios.get(
          Config.getApiUrl("login", `userDetails/${userId}`),
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data) {
          setIsFollowing(response.data.isFollowing);
          setFollowersCount(response.data.followers);
          setFollowingCount(response.data.following);
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    }
  };

  useEffect(() => {
    checkFollowingStatus();
  }, [userId, token]);

  // دنبال کردن کاربر
  const handleFollow = async () => {
    if (!token) return;
    try {
      const response = await axios.post(
        Config.getApiUrl("login", "follow/"),
        { user_id: userId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200 || response.status === 201) {
        setIsFollowing(true);
        setFollowersCount((prevCount) => prevCount + 1);
      }
    } catch (error) {
      console.error("Error following user:", error);
    }
  };

  // دنبال نکردن کاربر
  const handleUnfollow = async () => {
    if (!token) return;
    try {
      const response = await axios.delete(
        Config.getApiUrl("login", "unfollow/"),
        {
          data: { user_id: userId },
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200 || response.status === 204) {
        setIsFollowing(false);
        setFollowersCount((prevCount) => prevCount - 1);
      }
    } catch (error) {
      console.error("Error unfollowing user:", error);
    }
  };

  // آپلود تصویر جدید برای پروفایل
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const imagePreviewUrl = URL.createObjectURL(file);
      setImageUrl(imagePreviewUrl);

      const formData = new FormData();
      formData.append("image", file);

      try {
        const response = await axios.post(
          Config.getApiUrl("login", "setImageUser"),
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          console.log("Image uploaded successfully!");
        }
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  return (
    <div className={styles.profile_section}>
      <h3 className={styles.name_user}> 
        {name}
      </h3>

      <div className={styles.card}>
        <div className={styles.content}>
          <div className={styles.main_img}>
            <div className={styles.imageContainer}>
              <img src={imageUrl} alt="User" className={styles.image} />
            </div>
            {userId === userIdViewer && (
              <label className={styles.cameraIcon}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: "none" }}
                />
                📷
              </label>
            )}
          </div>

          <div className={styles.stats}>
            {/* <div className={styles.statItem}>
              <span className={styles.badi}>{productCount}</span>
              <span>محصول</span>
            </div> */}
            <div className={styles.divider}></div>
            <div className={styles.statItem}>
              <span className={styles.badi}>{followersCount}</span>
              <span>دنبال‌کننده‌ها</span>
            </div>
            <div className={styles.divider}></div>
            <div className={styles.statItem}>
              <span className={styles.badi}>{followingCount}</span>
              <span>دنبال‌شده‌ها</span>
            </div>
          </div>
        </div>

        {userId !== userIdViewer && isLoggedIn && (
          <div className={styles.buttons}>
            {isFollowing ? (
              <button
                className={styles.button_unfollow}
                onClick={handleUnfollow}
              >
                دنبال نکردن
              </button>
            ) : (
              <button className={styles.button_follow} onClick={handleFollow}>
                دنبال کردن
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserCard;
