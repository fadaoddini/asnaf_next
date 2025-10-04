import React from 'react';
import Link from 'next/link';
import styles from './DesCardBazar2.module.css'; // وارد کردن استایل

const DesCardBazar2 = ({ href, coverImage, titleImage, characterImage , color }) => {
  const fullUrl = `${href}?color=${color}`;
  return (
    <Link href={fullUrl} passHref>
      <div className={styles.card}>
        <div className={styles.wrapper}>
          <img src={coverImage} alt="Cover" className={styles.coverImage} />
        </div>
        <p className={styles.title}>{titleImage}</p>
        <img src={characterImage} alt="Character" className={styles.character} />
      </div>
    </Link>
  );
};

export default DesCardBazar2;
