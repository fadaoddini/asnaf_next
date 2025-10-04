"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext"; // Import context to access auth data
import styles from "@/styles/header.module.css";
import ConfirmDialog from "./utils/ConfirmDialog";

export default function Header() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();

  const [iconSrc, setIconSrc] = useState({
    question: "/images/question.svg",
    exit: "/images/exit.svg",
    profile: "/images/profile.svg",
    login: "/images/login.svg",
    home: "/images/home.svg",
    bazar: "/images/bazar.svg",
    create: "/images/create.svg",
    category: "/images/category.svg",
    law: "/images/law.png",
  });

  const handleMouseEnter = (icon) => {
    setIconSrc((prevState) => ({
      ...prevState,
      [icon]: `/images/${icon}_hover.svg`,
    }));
  };

  const handleMouseLeave = (icon) => {
    setIconSrc((prevState) => ({
      ...prevState,
      [icon]: `/images/${icon}.svg`,
    }));
  };

  const handleLogoutClick = () => {
    setIsDialogOpen(true);
  };

  const handleConfirmLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Error during logout:", error);
      alert("خطا در خروج. لطفاً دوباره امتحان کنید.");
    } finally {
      setIsDialogOpen(false);
    }
  };

  const handleCancelLogout = () => {
    setIsDialogOpen(false);
  };

  return (
    <>
      {/* هدر برای دسکتاپ */}
      <header className={styles.header}>
        <div className={styles.navbar_wrapper}>
          <nav className={styles.navbar_container}>
            <Image
              src="/images/logo.png"
              alt="نمایشگاه بم |  اتاق اصناف بم"
              className={styles.logo}
              width={70}
              height={70}
            />

            <div className={styles.left_menu}>
              {/* خانه */}
              <div
                className={styles.tooltip_container}
                onMouseEnter={() => handleMouseEnter("home")}
                onMouseLeave={() => handleMouseLeave("home")}
              >
                <Link href="/">
                  <Image
                    src={iconSrc.home}
                    alt="خانه"
                    className={styles.icon}
                    width={24}
                    height={24}
                  />
                  <span className={styles.nav_title}>خانه</span>
                </Link>
              </div>

              {/* چیدمان نمایشگاه */}
              <div
                className={styles.tooltip_container}
                onMouseEnter={() => handleMouseEnter("category")}
                onMouseLeave={() => handleMouseLeave("category")}
              >
                <Link href="/law">
                  <Image
                    src={iconSrc.category}
                    alt="قوانین"
                    className={styles.icon}
                    width={34}
                    height={34}
                  />
                  <span className={styles.nav_title}>قوانین </span>
                </Link>
              </div>


              

              {!isAuthenticated && (
                <>
                <div
                className={styles.tooltip_container}
                onMouseEnter={() => handleMouseEnter("exit")}
                onMouseLeave={() => handleMouseLeave("exit")}
              >
                <Link href="/login">
                  <Image
                    src={iconSrc.exit}
                    alt="ورود"
                    className={styles.icon}
                    width={34}
                    height={34}
                  />
                  <span className={styles.nav_title}>ورود</span>
                </Link>
              </div>

                </>
                )}

             
              {isAuthenticated && (
                <>


              {/* <div
                className={styles.tooltip_container}
                onMouseEnter={() => handleMouseEnter("create")}
                onMouseLeave={() => handleMouseLeave("create")}
              >
                <Link href="/rezerve">
                  <Image
                    src={iconSrc.create}
                    alt="رزرو غرفه"
                    className={styles.icon}
                    width={34}
                    height={34}
                  />
                  <span className={styles.nav_title}>رزرو غرفه</span>
                </Link>
              </div> */}


              <div
                className={styles.tooltip_container}
                onMouseEnter={() => handleMouseEnter("profile")}
                onMouseLeave={() => handleMouseLeave("profile")}
              >
                <Link href="/profile">
                  <Image
                    src={iconSrc.profile}
                    alt="پروفایل"
                    className={styles.icon}
                    width={34}
                    height={34}
                  />
                  <span className={styles.nav_title}>پروفایل</span>
                </Link>
              </div>

                <div
                  className={styles.tooltip_container}
                  onMouseEnter={() => handleMouseEnter("exit")}
                  onMouseLeave={() => handleMouseLeave("exit")}
                  onClick={handleLogoutClick}
                >
                  <Image
                    src={iconSrc.exit}
                    alt="خروج"
                    className={styles.icon}
                    width={34}
                    height={34}
                  />
                  <span className={styles.nav_title}>خروج</span>
                </div>
                </>
              )}
            </div>
          </nav>
        </div>
      </header>

      {/* منوی موبایل */}
      <div className={styles.mobile_navbar}>
        <Link href="/">
          <Image src={iconSrc.home} alt="خانه" width={24} height={24} />
        </Link>
        <Link href="/law">
          <Image src={iconSrc.law} alt="قوانین" width={24} height={24} />
        </Link>
       
        {!isAuthenticated && (
          <Link href="/login">
          <Image src={iconSrc.exit} alt="ورود" width={24} height={24} />
        </Link>
        )}
        {isAuthenticated && (
          <>
           {/* <Link href="/rezerve">
          <Image src={iconSrc.create} alt="رزرو غرفه" width={24} height={24} />
        </Link> */}
        <Link href="/profile">
          <Image src={iconSrc.profile} alt="پروفایل" width={24} height={24} />
        </Link>
          <Image
            src={iconSrc.exit}
            alt="خروج"
            width={24}
            height={24}
            onClick={handleLogoutClick}
          />


          </>
        )}
      </div>

      {/* نمایش دیالوگ تایید خروج */}
      {isDialogOpen && (
        <ConfirmDialog
          message="آیا مطمئن هستید که می‌خواهید خارج شوید؟"
          onConfirm={handleConfirmLogout}
          onCancel={handleCancelLogout}
          isOpen={isDialogOpen}
        />
      )}
    </>
  );
}
