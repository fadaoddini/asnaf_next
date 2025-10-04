import React from 'react';
import Link from 'next/link'; // وارد کردن Link از next
import styles from './DesCardBazar.module.css'; // وارد کردن استایل

const DesCardBazar = ({ imageSrc, title, description, link }) => {
  return (
    <div className={styles.card}>
      <img src={imageSrc} alt={title} className={styles.image} />
      <div className={styles.content}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.description}>{description}</p>
        <Link href={link} className={styles.button}>
          جزئیات بیشتر
        </Link>
      </div>
    </div>
  );
};

export default DesCardBazar;
