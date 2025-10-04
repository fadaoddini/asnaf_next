"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import Config from "@/config/config";
import styles from "@/styles/styleVerify.module.css";

const Verify = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthenticated } = useAuth();
  const [mobile, setMobile] = useState(null);
  const [code, setCode] = useState(["", "", "", ""]);
  const [toast, setToast] = useState({ message: "", type: "" });
  const [timeLeft, setTimeLeft] = useState(120);
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const mobileParam = searchParams.get("mobile");
    if (mobileParam) {
      setMobile(mobileParam);
    } else {
      setToast({ message: "شماره موبایل معتبر نیست.", type: "error" });
    }
  }, [searchParams]);

  useEffect(() => {
    const savedTime = parseInt(localStorage.getItem("verifyTimeLeft"), 10);
    if (savedTime && savedTime > Date.now()) {
      setTimeLeft(Math.floor((savedTime - Date.now()) / 1000));
    } else {
      setTimeLeft(120); // Reset if no saved time or time is expired
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 0) {
          clearInterval(timer);
          setToast({ message: "زمان شما به پایان رسید.", type: "error" });
          router.push("/login");
          return 0;
        }

        localStorage.setItem("verifyTimeLeft", Date.now() + prevTime * 1000);
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (/^\d$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);
      if (index < 3) {
        document.getElementById(`code-input-${index + 1}`).focus();
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const enteredCode = code.join("");
    if (enteredCode.length !== 4) {
      setToast({ message: "لطفاً کد ۴ رقمی را وارد کنید.", type: "error" });
      return;
    }

    try {
      const response = await axios.post(
        Config.getApiUrl("login", "verifyCode"),
        {
          mobile,
          code: enteredCode,
        }
      );

      if (response.status === 200) {
        localStorage.setItem("accessToken", response.data.access_token);
        localStorage.setItem("refreshToken", response.data.refresh_token);
        setToast({ message: "تأیید موفقیت‌آمیز بود.", type: "success" });
        router.push("/");
        window.location.reload();
      } else {
        setToast({ message: "کد تایید اشتباه است.", type: "error" });
      }
    } catch (error) {
      setToast({
        message: "خطایی رخ داده است، لطفاً دوباره تلاش کنید.",
        type: "error",
      });
    }
  };

  return (
    <div className={styles.verify_wrapper}>
      <div className={styles.verify_container}>
        <Image
          src="/images/logo.png"
          alt="rebo"
          className={styles.logo}
          width={100}
          height={100}
        />
        <p className={styles.enter_text}>
          شماره ارسال شده به موبایل خود را وارد نمائید
        </p>
        <form onSubmit={handleSubmit}>
          <div className={styles.code_container}>
            {code.map((digit, index) => (
              <input
                key={index}
                id={`code-input-${index}`}
                type="text"
                value={digit}
                onChange={(e) => handleChange(e, index)}
                maxLength="1"
                className={styles.code_input}
              />
            ))}
          </div>
          <button type="submit">تأیید</button>
        </form>
        <div className={styles.timer}>{timeLeft}s</div>
        {toast.message && (
          <div
            className={`${styles.toast} ${
              toast.type === "error" ? styles.error : styles.success
            }`}
          >
            {toast.message}
          </div>
        )}
      </div>
    </div>
  );
};

export default Verify;
