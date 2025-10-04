import { useState, useEffect } from "react";
import axios from "axios";
import Config from "@/config/config";

import styles from "./FavoriteButton.module.css"; // استایل ماژولار
import ConfirmDialog from "@/components/utils/ConfirmDialog";

export default function FavoriteButton({ productId, token }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false); // برای کنترل نمایش دیالوگ تأیید

  // بررسی وضعیت علاقه‌مندی‌ها
  const checkFavoriteStatus = async () => {
    if (!token) return;

    try {
      const response = await axios.get(`${Config.getApiUrl("catalogue", "favorites")}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const isFav = response.data.some((favorite) => favorite.product === productId);
      setIsFavorite(isFav);
    } catch (error) {
      console.error("خطا در بررسی علاقه‌مندی‌ها:", error);
    }
  };

  // افزودن به علاقه‌مندی‌ها
  const addToFavorites = async () => {
    if (!token) return;
    setLoading(true);

    try {
      await axios.post(
        `${Config.getApiUrl("catalogue", "favorites")}`,
        { product: productId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsFavorite(true);
    } catch (error) {
      console.error("خطا در افزودن به علاقه‌مندی‌ها:", error);
    } finally {
      setLoading(false);
    }
  };

  // حذف از علاقه‌مندی‌ها
  const removeFromFavorites = async () => {
    if (!token) return;
    setLoading(true);

    try {
      await axios.delete(`${Config.getApiUrl("catalogue", `favorites/${productId}`)}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIsFavorite(false);
    } catch (error) {
      console.error("خطا در حذف از علاقه‌مندی‌ها:", error);
    } finally {
      setLoading(false);
      setIsDialogOpen(false); // بستن دیالوگ پس از حذف
    }
  };

  // باز کردن دیالوگ برای حذف
  const handleRemoveClick = () => {
    setIsDialogOpen(true);
  };

  // بستن دیالوگ
  const handleDialogCancel = () => {
    setIsDialogOpen(false);
  };

  // بارگذاری وضعیت علاقه‌مندی هنگام mount
  useEffect(() => {
    checkFavoriteStatus();
  }, [productId, token]);

  return (
    <>
      {/* دکمه علاقه‌مندی */}
      <div
        className={`${styles.favoriteIcon} ${isFavorite ? styles.active : ""}`}
        onClick={isFavorite ? handleRemoveClick : addToFavorites}
        role="button"
        aria-label={isFavorite ? "حذف از علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها"}
        disabled={loading}
      >
        <img
          src={isFavorite ? "/images/favorit_add.svg" : "/images/favorit.svg"}
          alt={isFavorite ? "حذف از علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها"}
          className={loading ? styles.loading : ""}
        />
      </div>

      {/* دیالوگ تأیید برای حذف */}
      <ConfirmDialog
        message="آیا مطمئن هستید که می‌خواهید این محصول را از علاقه‌مندی‌ها حذف کنید؟"
        onConfirm={removeFromFavorites}
        onCancel={handleDialogCancel}
        confirmText="بله"
        cancelText="خیر"
        isOpen={isDialogOpen}
      />
    </>
  );
}
