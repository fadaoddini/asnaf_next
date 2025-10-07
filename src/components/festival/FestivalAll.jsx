// components/festival/FestivalAll.jsx
import React from 'react';
import styles from './FestivalAll.module.css';

const FestivalAll = () => {
  const handlePhoneCall = (phoneNumber) => {
    window.open(`tel:${phoneNumber}`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>رزرو غرفه</h1>
          <div className={styles.icon}>🎪</div>
        </div>
        
        <div className={styles.content}>
          <p className={styles.message}>
            برای رزرو غرفه و دریافت اطلاعات بیشتر، لطفاً با شماره‌های زیر تماس بگیرید:
          </p>
          
          <div className={styles.phoneNumbers}>
            <div 
              className={styles.phoneItem}
              onClick={() => handlePhoneCall('09135408379')}
            >
              <span className={styles.phoneIcon}>📞</span>
              <span className={styles.phoneNumber}>۰۹۱۳۵۴۰۸۳۷۹</span>
              <span className={styles.clickHint}>(کلیک برای تماس)</span>
            </div>
            
            <div 
              className={styles.phoneItem}
              onClick={() => handlePhoneCall('09132469770')}
            >
              <span className={styles.phoneIcon}>📞</span>
              <span className={styles.phoneNumber}>۰۹۱۳۲۴۶۹۷۷۰</span>
              <span className={styles.clickHint}>(کلیک برای تماس)</span>
            </div>
          </div>
          
          <div className={styles.infoBox}>
            <h3 className={styles.infoTitle}>ساعات تماس:</h3>
            <p className={styles.infoText}>همه‌روزه از ساعت ۸ صبح تا ۱۰ شب</p>
          </div>
        </div>
        
        <div className={styles.footer}>
          <p className={styles.footerText}>
            کارشناسان ما آماده پاسخگویی و راهنمایی شما هستند
          </p>
        </div>
      </div>
    </div>
  );
};

export default FestivalAll;