import React, { useState, useEffect, useRef } from "react";
import styles from "./FallowNavBar.module.css"; // وارد کردن استایل

const FallowNavBar = () => {
  const [currentScrollPosition, setCurrentScrollPosition] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);
  const sContRef = useRef(null);
  const hScrollRef = useRef(null);

  const scrollAmount = 320;

  useEffect(() => {
    // تنظیم مقدار حداکثر اسکرول بعد از لود شدن کامپوننت
    setMaxScroll(
      -sContRef.current.offsetWidth + hScrollRef.current.offsetWidth
    );
  }, []);

  const scrollHorizontally = (val) => {
    let newScrollPos = currentScrollPosition + val * scrollAmount;

    if (newScrollPos >= 0) {
      newScrollPos = 0;
    } else if (newScrollPos <= maxScroll) {
      newScrollPos = maxScroll;
    }

    setCurrentScrollPosition(newScrollPos);
  };

  return (
    <div className={styles.container}>
      <div className={styles.horizontalScroll} ref={hScrollRef}>
        <button
          className={styles.btnScroll}
          onClick={() => scrollHorizontally(1)}
          style={{ opacity: currentScrollPosition === 0 ? "0" : "1" }}
        >
          &lt;
        </button>
        <div
          className={styles.storysContainer}
          ref={sContRef}
          style={{ left: `${currentScrollPosition}px` }}
        >
          <div className={styles.storyCircle}>
            <img src="http://placehold.jp/50x50.png" alt="story" />
          </div>
          <div className={styles.storyCircle}>
            <img src="http://placehold.jp/50x50.png" alt="story" />
          </div>
          <div className={styles.storyCircle}>
            <img src="http://placehold.jp/50x50.png" alt="story" />
          </div>
          <div className={styles.storyCircle}>
            <img src="http://placehold.jp/50x50.png" alt="story" />
          </div>
          <div className={styles.storyCircle}>
          <img src="http://placehold.jp/50x50.png" alt="story" />
          </div>
          <div className={styles.storyCircle}>
            <img src="http://placehold.jp/50x50.png" alt="story" />
          </div>
          <div className={styles.storyCircle}>
            <img src="http://placehold.jp/50x50.png" alt="story" />
          </div>
          <div className={styles.storyCircle}>
            <img src="http://placehold.jp/50x50.png" alt="story" />
          </div>
          <div className={styles.storyCircle}>
            <img src="http://placehold.jp/50x50.png" alt="story" />
          </div>
          <div className={styles.storyCircle}>
            <img src="http://placehold.jp/50x50.png" alt="story" />
          </div>
          <div className={styles.storyCircle}>
            <img src="http://placehold.jp/50x50.png" alt="story" />
          </div>
          <div className={styles.storyCircle}>
            <img src="http://placehold.jp/50x50.png" alt="story" />
          </div>
          <div className={styles.storyCircle}>
          <img src="http://placehold.jp/50x50.png" alt="story" />
          </div>
          <div className={styles.storyCircle}>
            <img src="http://placehold.jp/50x50.png" alt="story" />
          </div>
          <div className={styles.storyCircle}>
            <img src="http://placehold.jp/50x50.png" alt="story" />
          </div>
          <div className={styles.storyCircle}>
            <img src="http://placehold.jp/50x50.png" alt="story" />
          </div>
          <div className={styles.storyCircle}>
            <img src="http://placehold.jp/50x50.png" alt="story" />
          </div>
          <div className={styles.storyCircle}>
            <img src="http://placehold.jp/50x50.png" alt="story" />
          </div>
          <div className={styles.storyCircle}>
            <img src="http://placehold.jp/50x50.png" alt="story" />
          </div>
          <div className={styles.storyCircle}>
            <img src="http://placehold.jp/50x50.png" alt="story" />
          </div>
          <div className={styles.storyCircle}>
          <img src="http://placehold.jp/50x50.png" alt="story" />
          </div>
          <div className={styles.storyCircle}>
            <img src="http://placehold.jp/50x50.png" alt="story" />
          </div>
          <div className={styles.storyCircle}>
            <img src="http://placehold.jp/50x50.png" alt="story" />
          </div>
          <div className={styles.storyCircle}>
            <img src="http://placehold.jp/50x50.png" alt="story" />
          </div>

          <div className={styles.storyCircle}>
            <img src="http://placehold.jp/50x50.png" alt="story" />
          </div>
          <div className={styles.storyCircle}>
            <img src="http://placehold.jp/50x50.png" alt="story" />
          </div>
        </div>
        <button
          className={styles.btnScroll}
          onClick={() => scrollHorizontally(-1)}
          style={{ opacity: currentScrollPosition === maxScroll ? "0" : "1" }}
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

export default FallowNavBar;
