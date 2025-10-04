import React from "react";
import styles from "./ProposerCard.module.css"; // فایل CSS ماژولار را ایمپورت می‌کنیم
import formatNumber from "@/components/utils/FormatNumber/formatNumber";
const ProposerCard = ({ color, proposer }) => {
  const bgColorBorderHover = color === "buy" ? "var(--light-green)" : "var(--light-red)";
  const textColor = color === "buy" ? "var(--dark-green)" : "var(--dark-red)";
  const btnHover = color === "buy" ? "var(--darked-green)" : "var(--darked-red)";

  return (
    <div className={styles.card} style={{
        "--bg-border-hover": bgColorBorderHover,
        "--text-color": textColor,
        "--btn-hover": btnHover,
      }}>
      {/* تصویر پروفایل */}
      <div className={styles.profileContainer}>
        <img
          src={proposer.image}
          alt="Profile"
          className={styles.profileImage}
        />
      </div>

      {/* اطلاعات پیشنهاد دهنده */}
      <div className={styles.infoContainer}>
        <div className={styles.nameSection}>
          <span className={styles.icon}>👤</span> {/* آیکن نام */}
          <span className={styles.name}>{proposer.name}</span>
        </div>
        <div className={styles.bidSection}>
          <span className={styles.icon}>💰</span> {/* آیکن قیمت */}
          <span className={styles.price}>{formatNumber(proposer.price)}</span>
          تومان به ازای هر کیلو 
         ،
          <span className={styles.price}>{formatNumber(proposer.weight)}</span>
          کیلوگرم 
          و در مجموع
          <span className={styles.price}>
            {formatNumber(proposer.total_price)}
          </span>
          تومان
        </div>
      </div>

      {/* وضعیت پیشنهاد دهنده */}
      <div className={styles.statusContainer}>
        {/* <span className={styles.status}>{proposer.status}</span> */}
        <button className={styles.callButton}>تماس</button>
      </div>
    </div>
  );
};

export default ProposerCard;
