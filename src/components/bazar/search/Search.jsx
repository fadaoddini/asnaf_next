import React from "react";
import styles from "./search.module.css";

const Search = ({ query, setQuery }) => {
  // مدیریت تغییرات ورودی
  const handleInputChange = (e) => {
    setQuery(e.target.value); // به‌روزرسانی مقدار ورودی
  };

  return (
    <div className={styles.searchContainer}>
      <div className={styles.searchWrapper}>
        <input
          type="text"
          value={query}
          onChange={handleInputChange} // تغییرات ورودی را مدیریت می‌کند
          placeholder="جستجو..."
          className={styles.searchInput}
        />
        <button className={styles.searchButton}>
          <span className={styles.searchIcon}>
            <img src="/images/search.svg" alt="search" />
          </span>
        </button>
      </div>
    </div>
  );
};

export default Search;
