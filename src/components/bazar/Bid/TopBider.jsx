// TopBider.js
import React from "react";
import styles from "./TopBider.module.css";
import formatNumber from "@/components/utils/FormatNumber/formatNumber";


const TopBider = ({ color, bids }) => {
  // گرفتن سه پیشنهاد اول و بقیه پیشنهاد دهندگان
  const topBidders = bids.slice(0, 3); // سه نفر اول
  const otherBidders = bids.slice(3); // بقیه پیشنهاد دهندگان

  return (
    <div className={`${styles.container} ${styles[color]}`}>
      {/* نمایش سه نفر اول */}
      <div className={styles.topBidders}>
        {topBidders.map((bid, index) => (
          <div
            key={index}
            className={`${styles.bidderCard} ${styles[`rank${index + 1}`]}`}
          >
            <div className={styles.imageContainer}>
              <img
                src={bid.image_url || "/images/avatar.png"}
                alt="Profile"
                className={styles.profileImage}
              />
              <div
                className={`${styles.rankBadge} ${styles[`rank${index + 1}`]}`}
              >
                {index + 1}
              </div>
            </div>
            <div className={styles.info}>
              <h3 className={styles.name}>{bid.user}</h3>
              <p className={styles.details}>
              {formatNumber(bid.weight)}kg 
              <img className={styles.zarb} src="/images/zarb.svg" alt="rebo" />
              
               {formatNumber(bid.price)}
              </p>
              <span className={styles.totalPrice}>{formatNumber(bid.total)}
              <span className={styles.toman}>
                    تومان
                </span>
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* نمایش سایر پیشنهاد دهندگان */}
      <ul className={styles.otherBidders}>
        {otherBidders.map((bid, index) => (
          <li key={index} className={styles.otherBidderItem}>
            <span className={styles.rank}>{index + 4}</span>
            <span className={styles.name}>{bid.user}</span>
            <span className={styles.details}>
            {formatNumber(bid.weight)} kg 
            <img className={styles.zarb} src="/images/zarb.svg" alt="rebo" />
             {formatNumber(bid.price)}
            </span>
            <span className={styles.totalPrice}>{formatNumber(bid.total)}

                <span className={styles.toman}>
                    تومان
                </span>
            </span>
            <span className={styles.status}>{bid.status}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TopBider;
