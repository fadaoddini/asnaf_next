// components/AnimatedButton.js
import React from 'react';
import formatNumber from '../FormatNumber/formatNumber';
import styles from './AnimatedSpan.module.css';

const AnimatedSpan = ({ title = 'Click Me', color = 'orange', price = 0, title2="تومان" }) => {
  // تعیین رنگ‌ها بر اساس پراپ
  const backgroundColor = color === 'green' 
  ? 'var(--dark-green)' 
  : color === 'red' 
    ? 'var(--dark-red)' 
    : 'var(--darked-orange)';  // اگر رنگ orange باشد

const hoverColor = color === 'green' 
  ? 'var(--light-green)' 
  : color === 'red' 
    ? 'var(--light-red)' 
    : 'var(--white)';  // اگر رنگ orange باشد

const darked = color === 'green' 
  ? 'var(--darked-green)' 
  : color === 'red' 
    ? 'var(--darked-red)' 
    : 'var(--darked-orange)';  // اگر رنگ orange باشد




  return (
      <div 
        className={styles.button}
        style={{
          '--button-bg': backgroundColor,
          '--button-hover-bg': hoverColor,
          '--button-hover-color': backgroundColor,
          '--darked': darked
        }}
      >
        <span className={styles.title}> {title}  </span>
        <span className={styles.title}>  {formatNumber(price)}   </span>
        <span className={styles.title}> {title2} </span>
        

          
       
       
        <span className={styles.circle}></span>
      </div>
  );
};

export default AnimatedSpan;
