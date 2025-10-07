"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Config from "@/config/config"; 
import styles from "@/styles/home.module.css";
import FestivalMatrix from "@/components/festival/FestivalMatrix";
import FestivalMatrixView from "@/components/festival/FestivalMatrixView";
import RegisterUserFestival from "@/components/festival/RegisterUserFestival";
import ReservationInfo from "@/components/festival/ReservationInfo"; // کامپوننت جدید
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import FestivalAll from "@/components/festival/FestivalAll";

export default function Home() {
  const { user, isAdmin, isStaff, hasAdminAccess, isLoggedIn } = useAuth();
  const [festivals, setFestivals] = useState([]);
  const [selectedFestival, setSelectedFestival] = useState(null);
  const [festivalMatrix, setFestivalMatrix] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showRegistrationDialog, setShowRegistrationDialog] = useState(false);
  const [showReservationInfo, setShowReservationInfo] = useState(false);
  const [fetching, setFetching] = useState(false); 
  const [error, setError] = useState(null); 

  // دریافت نمایشگاه‌ها از سرور
  const fetchFestivals = async () => {
    setFetching(true);
    setError(null);
  
    try {
      const response = await axios.get(
        Config.getApiUrl("festival", "festival")
      );
      setFestivals(response.data);
      if (response.data.length > 0) {
        setSelectedFestival(response.data[0]);
        fetchFestivalMatrix(response.data[0].id);
      }
    } catch (error) {
      console.error("Error fetching festivals:", error);
      setError(error.message);
    } finally {
      setFetching(false);
    }
  };

  // دریافت ماتریس نمایشگاه
  const fetchFestivalMatrix = async (festivalId) => {
    try {
      const response = await axios.get(
        Config.getApiUrl("festival", `festival/${festivalId}/matrix`)
      );
      setFestivalMatrix(response.data.matrix);
      setSelectedRoom(null);
      setShowRegistrationDialog(false);
      setShowReservationInfo(false);
    } catch (error) {
      console.error("Error fetching festival matrix:", error);
    }
  };

  useEffect(() => {
    fetchFestivals();
  }, []);

  const handleFestivalChange = (festival) => {
    setSelectedFestival(festival);
    fetchFestivalMatrix(festival.id);
  };

  // هندلر کلیک برای کاربران معمولی
  const handleRoomSelect = (room) => {
    if (!isLoggedIn()) {
      alert('برای رزرو غرفه باید ابتدا وارد سامانه شوید.');
      return;
    }
    setSelectedRoom(room);
    setShowRegistrationDialog(true);
  };

  // هندلر کلیک برای ادمین
  const handleAdminRoomClick = (room) => {
    setSelectedRoom(room);
    
    if (room.status === 1) { // اگر غرفه رزرو شده است
      setShowReservationInfo(true);
    } else {
      // برای غرفه‌های دیگر، دیالوگ ویرایش نمایش داده می‌شود
      // این رفتار در کامپوننت FestivalMatrix مدیریت می‌شود
    }
  };

  const handleRegistrationComplete = () => {
    setShowRegistrationDialog(false);
    setSelectedRoom(null);
    fetchFestivalMatrix(selectedFestival.id);
  };

  const handleCloseRegistration = () => {
    setShowRegistrationDialog(false);
    setSelectedRoom(null);
  };

  const handleCloseReservationInfo = () => {
    setShowReservationInfo(false);
    setSelectedRoom(null);
    fetchFestivalMatrix(selectedFestival.id); // رفرش ماتریس
  };

  const handleReservationUpdate = () => {
    // وقتی وضعیت رزرو تغییر کرد، ماتریس را رفرش کن
    fetchFestivalMatrix(selectedFestival.id);
  };

  return (
    <div className={styles.container}>
      <main className={styles.main}>


        <div className={styles.left}>

         
          {/* انتخاب نمایشگاه */}
         <div className={styles.headerCards}>

       
  {/* کارت انتخاب نمایشگاه */}
  {/* <div className={styles.card}>
    <div className={styles.festivalSelector}>
      <h2>انتخاب نمایشگاه</h2>
      <select 
        onChange={(e) => handleFestivalChange(festivals.find(f => f.id == e.target.value))}
        value={selectedFestival?.id || ''}
      >
        {festivals.map(festival => (
          <option key={festival.id} value={festival.id}>
            {festival.name} ({festival.number_width} × {festival.number_height})
          </option>
        ))}
      </select>
    </div>
  </div> */}


            {/* بنر در سطر کامل */}
  <div className={styles.bannerContainer}>
    <img 
      className={styles.ImageBanner} 
      src="images/banner.jpg" 
      alt="foodpik"
    />
    <img 
      className={styles.ImageBannerMobile} 
      src="images/bannerـmobile.jpg" 
      alt="foodpik"
    />
  </div>

  {/* کارت اطلاعات نمایشگاه */}
  {/* <div className={styles.card}>
    <div className={styles.festivalInfoCard}>
      <h1 className={styles.titleRed}>
        {selectedFestival ? selectedFestival.name : "نمایشگاه"} | اتاق اصناف بم
      </h1>
      {selectedFestival && (
        <div className={styles.festivalInfo}>
        
          <p>تعداد غرفه‌ها: {selectedFestival.rooms_count}</p>
          <p>غرفه‌های آزاد: {selectedFestival.available_rooms_count}</p>
        </div>
      )}
    </div>
  </div> */}
</div>
          <div className={styles.gridContainer}>
            {isAdmin() ? (
              // نمایشگاه برای ادمین - امکان مدیریت کامل
              <div className={styles.adminView}>
          
                {selectedFestival && (
                  <FestivalMatrix 
                    matrix={festivalMatrix}
                    width={selectedFestival.number_width}
                    height={selectedFestival.number_height}
                    festivalId={selectedFestival.id}
                    onRoomAdded={() => {
                      fetchFestivalMatrix(selectedFestival.id);
                    }}
                    onRoomClick={handleAdminRoomClick}
                    isAdmin={true}
                  />
                )}
              </div>
            ) : (
              // نمایشگاه برای کاربران معمولی
              <div className={styles.userView}>
                {!isLoggedIn() ? (
                  // کاربر لاگین نکرده
                  <div className={styles.loginRequired}>
                    <div className={styles.loginMessage}>
                      <h3> دسترسی نیاز به ورود دارد</h3>
                      <p>برای مشاهده و رزرو غرفه‌ها باید ابتدا وارد سامانه شوید.</p>
                      <div className={styles.loginActions}>
                        <Link href="/login" className={styles.loginButton}>
                          ورود به سامانه
                        </Link>
                       
                      </div>
                    </div>
                  </div>
                ) : (
                  // کاربر لاگین کرده - نمایش نقشه
                  <>
                    {/* <div className={styles.userInstructions}>
                    
                      <p>برای رزرو غرفه، روی غرفه‌های سبز رنگ (آزاد) کلیک کنید.</p>
                    </div> */}
                    {/* {selectedFestival && (
                      <FestivalMatrixView 
                        matrix={festivalMatrix}
                        width={selectedFestival.number_width}
                        height={selectedFestival.number_height}
                        onRoomSelect={handleRoomSelect}
                      />
                    )} */}

                    <FestivalAll />
                  </>
                )}
              </div>
            )}
          </div>

          {/* دیالوگ ثبت رزرو برای کاربران معمولی */}
          {showRegistrationDialog && selectedRoom && isLoggedIn() && !isAdmin() && (
            <RegisterUserFestival 
              selectedRoom={selectedRoom}
              festivalId={selectedFestival.id}
              onRegistrationComplete={handleRegistrationComplete}
              onClose={handleCloseRegistration}
            />
          )}

          {/* دیالوگ اطلاعات رزرو برای ادمین */}
          {showReservationInfo && selectedRoom && isAdmin() && (
            <ReservationInfo 
              room={selectedRoom}
              onClose={handleCloseReservationInfo}
              onReservationUpdate={handleReservationUpdate}
            />
          )}
        </div>
      </main>
    </div>
  );
}