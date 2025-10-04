import React, { useState, useEffect } from 'react';
import styles from './CountdownTimer.module.css';

const CountdownTimer = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState(null); // در ابتدا مقدار زمان باقی‌مانده را null قرار می‌دهیم
  const [flipping, setFlipping] = useState({ hours: false, minutes: false, seconds: false });

  useEffect(() => {
    // فقط در سمت کلاینت محاسبه زمان انجام می‌شود
    const timer = setInterval(() => {
      const newTimeLeft = getTimeLeft(targetDate);

      setFlipping({
        hours: newTimeLeft.hours !== timeLeft?.hours,
        minutes: newTimeLeft.minutes !== timeLeft?.minutes,
        seconds: newTimeLeft.seconds !== timeLeft?.seconds,
      });

      setTimeLeft(newTimeLeft);

      if (newTimeLeft.total <= 0) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate, timeLeft]);

  function getTimeLeft(targetDate) {
    const now = new Date();
    const difference = targetDate - now;

    if (difference <= 0) {
      return {
        total: 0,
        days: null,
        hours: '00',
        minutes: '00',
        seconds: '00',
      };
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 3600));
    const minutes = Math.floor((difference % (1000 * 3600)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return {
      total: difference,
      days: days > 0 ? days : null,
      hours: hours < 10 ? `0${hours}` : `${hours}`,
      minutes: minutes < 10 ? `0${minutes}` : `${minutes}`,
      seconds: seconds < 10 ? `0${seconds}` : `${seconds}`,
    };
  }

  // اگر timeLeft هنوز مقداردهی نشده، تایمر را نمایش ندهیم
  if (!timeLeft) return null;

  const renderTimeCard = (value, isFlipping) => (
    <div className={styles.timerCard}>
      <div className={`${styles.timerCardInner} ${isFlipping ? styles.flipping : ''}`}>
        <div className={`${styles.timerCardFace} ${styles.timerCardFront}`}>
          {value}
        </div>
        <div className={`${styles.timerCardFace} ${styles.timerCardBack}`}>
          {value}
        </div>
      </div>
    </div>
  );

  const isLast24Hours = timeLeft.total <= 24 * 3600 * 1000;

  return (
    <div className={`${styles.timerContainer} ${isLast24Hours ? styles.lessThan24Hours : styles.moreThan24Hours}`}>
      {timeLeft.days !== null && <span>{timeLeft.days} روز باقی مانده</span>}
      {timeLeft.days === null && (
        <>
        <span className={styles.baghi}>
        باقی مانده
        </span>
        
          {renderTimeCard(timeLeft.hours, flipping.hours)}
          <span className={styles.timeSeparator}>:</span>
          {renderTimeCard(timeLeft.minutes, flipping.minutes)}
          <span className={styles.timeSeparator}>:</span>
          {renderTimeCard(timeLeft.seconds, flipping.seconds)}

          
        </>
      )}
    </div>
  );
};

export default CountdownTimer;
