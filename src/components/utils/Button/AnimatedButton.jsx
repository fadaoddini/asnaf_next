// components/AnimatedButton.js
import React from 'react';
import Link from 'next/link';
import styles from './AnimatedButton.module.css';

const AnimatedButton = ({ title = 'Click Me', href = '#', color = 'orange' }) => {
  // تعیین رنگ‌ها بر اساس پراپ
  const backgroundColor = color === 'green' ? 'var(--dark-green)' : 'var(--dark-red)';
  const hoverColor = color === 'green' ? 'var(--light-green)' : 'var(--light-red)';
  const darked = color === 'green' ? 'var(--darked-green)' : 'var(--darked-red)';



  return (
    <Link href={href} passHref>
      <div 
        className={styles.button}
        style={{
          '--button-bg': backgroundColor,
          '--button-hover-bg': hoverColor,
          '--button-hover-color': backgroundColor,
          '--darked': darked
        }}
      >
        <span className={styles.title}> {title}</span>
       
        <span className={styles.circle}></span>
      </div>
    </Link>
  );
};

export default AnimatedButton;
