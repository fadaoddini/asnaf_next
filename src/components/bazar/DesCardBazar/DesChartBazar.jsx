import React from "react";
import styles from "./DesChart.module.css"; // وارد کردن استایل


const DesChartBazar = ({ imageSrc, title, description, link }) => {
  return (
    <div className={styles.card}>
      
      <img src={imageSrc} alt={title} className={styles.image} />
      <div className={styles.content}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.description_chart}>{description}</p>
      </div>
    </div>
  );
};

export default DesChartBazar;
