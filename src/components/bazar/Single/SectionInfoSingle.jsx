import React from 'react';
import styles from './SectionInfoSingle.module.css';
import formatPrice from '@/components/utils/FormatNumber/formatNumber';

const SectionInfoSingle = ({ price, title, img, vahed , color }) => {
  return (

      <div className={`${styles.info_right} ${styles[color]}`}>
        <div className={styles.info_right_top}>
          <span className={styles.info_right_top_icon}>
            <img className={styles.icon_b} src={img} alt="rebo" />
          </span>
          <span className={styles.info_right_top_title}>
            {title}
            :
          </span>
        </div>
        <div className={styles.info_right_bottom}>
          <span className={styles.info_right_bottom_price}>
            
          {typeof price === 'string' ? price : formatPrice(price)}
          </span>
          <span className={styles.info_right_bottom_toman}>{vahed}</span>
        </div>
      </div>

  );
};

export default SectionInfoSingle;
