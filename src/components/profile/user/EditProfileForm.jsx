"use client";

import React, { useState, useEffect } from "react";
import styles from "./EditProfileForm.module.css";
import { useAuth } from "@/context/AuthContext";
import ConfirmDialog from "@/components/utils/ConfirmDialog";
import axios from "axios";
import Config from "@/config/config";

const EditProfileForm = () => {
  const { user, loading } = useAuth(); // دریافت اطلاعات کاربر و وضعیت بارگذاری
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    mobile: "",
  });
  const [errors, setErrors] = useState({});
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false); // مدیریت نمایش دیالوگ تأیید

  // مقداردهی اولیه فرم با اطلاعات کاربر
  useEffect(() => {
    if (user) {
      setForm({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        mobile: user.mobile || "",
      });
    }
  }, [user]);

  // مدیریت تغییرات در فیلدهای فرم
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // باز کردن دیالوگ تأیید
  const handleOpenConfirm = (e) => {
    e.preventDefault();
    setIsConfirmOpen(true);
  };

  // مدیریت ارسال فرم
  const handleSubmit = async () => {
    setLoadingSubmit(true);
    setErrors({});
    setIsConfirmOpen(false); // بستن دیالوگ تأیید

    try {
      const token = localStorage.getItem("accessToken");
      await axios.post(
        Config.getApiUrl("login", "edit_profile_user"),
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
     
    } catch (error) {
      console.error("Error updating profile:", error);
      setErrors(error.response?.data || {});
    } finally {
      setLoadingSubmit(false);
    }
  };

  // بستن دیالوگ تأیید
  const handleCancel = () => {
    setIsConfirmOpen(false);
  };

  if (loading) {
    return <div>در حال بارگذاری اطلاعات...</div>;
  }

  return (
    <div className={styles.container}>
      {/* دیالوگ تأیید */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        message="آیا از ایجاد تغییرات اطمینان دارید؟"
        onConfirm={handleSubmit}
        onCancel={handleCancel}
        confirmText="بله"
        cancelText="خیر"
      />

      {/* فرم */}
      <form onSubmit={handleOpenConfirm} className={styles.form}>
        <div className={styles.field}>
          <label className={styles.label_a} htmlFor="first_name">نام</label>
          <input
            type="text"
            id="first_name"
            name="first_name"
            value={form.first_name}
            onChange={handleChange}
            className={styles.input}
          />
          {errors.first_name && (
            <span className={styles.error}>{errors.first_name}</span>
          )}
        </div>

        <div className={styles.field}>
          <label className={styles.label_a} htmlFor="last_name">نام خانوادگی</label>
          <input
            type="text"
            id="last_name"
            name="last_name"
            value={form.last_name}
            onChange={handleChange}
            className={styles.input}
          />
          {errors.last_name && (
            <span className={styles.error}>{errors.last_name}</span>
          )}
        </div>

        <div className={styles.field}>
          <label className={styles.label_a} htmlFor="email">ایمیل</label>
          <input
            type="email"
            id="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className={styles.input}
          />
          {errors.email && <span className={styles.error}>{errors.email}</span>}
        </div>

        <div className={styles.field}>
          <label className={styles.label_a} htmlFor="mobile">موبایل</label>
          <input
            type="text"
            id="mobile"
            name="mobile"
            value={form.mobile}
            readOnly
            className={`${styles.input} ${styles.readOnly}`}
          />
        </div>

        <button
          type="submit"
          className={styles.button}
          disabled={loadingSubmit}
        >
          {loadingSubmit ? "در حال ارسال..." : "ذخیره"}
        </button>
      </form>
    </div>
  );
};

export default EditProfileForm;