import React from "react";
import styles from "./UserInfo.module.css";

const UserInfo = ({ onEdit, onSuggestions, onAds, onSaved, onLogout }) => {
  return (
    <div className={styles.container}>
      <div className={styles.item} onClick={onEdit}>
        <div className={styles.icon}>
          <img className={styles.icon_img} src="/images/edit_icon.png" alt="rebo" />
        </div>
        <span className={styles.span2}>ویرایش اطلاعات فردی</span>
      </div>

      {/* <div className={styles.item} onClick={onSuggestions}>
        <div className={styles.icon}>
        <img className={styles.icon_img} src="/images/bid_icon.png" alt="rebo" />
        </div>
        <span className={styles.span2}>پیشنهادات من</span>
      </div>

      <div className={styles.item} onClick={onAds}>
        <div className={styles.icon}>
        <img className={styles.icon_img} src="/images/adv_icon.png" alt="rebo" />
        </div>
        <span className={styles.span2}>آگهی های من</span>
      </div>

      <div className={styles.item} onClick={onSaved}>
        <div className={styles.icon}>
        <img className={styles.icon_img} src="/images/favorit_icon.png" alt="rebo" />
        </div>
        <span className={styles.span2}>ذخیره شده ها</span>
      </div> */}

   
    </div>
  );
};

export default UserInfo;
