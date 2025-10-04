import React from 'react';
import styles from './PriceList.module.css'; // استایل‌ها را از فایل CSS وارد کنید
import formatNumber from '@/components/utils/FormatNumber/formatNumber';


const PriceList = ({ items, color, lable }) => {
  const backgroundColor =
    color === "buy" ? "var(--dark-green)" : "var(--dark-red)";
  const backgroundColorHover =
    color === "buy" ? "var(--light-green)" : "var(--light-red)";
  const textColor = color === "buy" ? "var(--light-green)" : "var(--light-red)";
  const textColorAttr =
    color === "buy" ? "var(--darked-green)" : "var(--darked-red)";

  return (
    <div className={styles.container} style={{
        "--bg-color": backgroundColor,
        "--text-color": textColor,
        "--border-color": backgroundColor,
        "--bg-color-hover": backgroundColorHover,
        "--text-attr": textColorAttr,
        cursor: "pointer",
      }}>
        <h3 className={styles.h_title}>
        {color === "sell" ? `فروشندگان خرمای ${lable} ` : `خریداران خرمای ${lable} `}
           </h3>
      <div className={styles.header}>
        
        <div className={styles.cell}>قیمت (تومان)</div>
        <div className={styles.cell}>مقدار (kg)</div>
        <div className={styles.cell}>کل (تومان)</div>
      </div>
      {items.map((item, index) => (
        <div key={index} className={styles.row}>
          <div className={styles.cell}>{formatNumber(item.price)}</div>
          <div className={styles.cell}>{item.quantity}</div>
          <div className={styles.cell}>{formatNumber(item.total)}</div>
        </div>
      ))}
    </div>
  );
};

export default PriceList;
