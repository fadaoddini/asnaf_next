import { useState } from "react";
import styles from "./SingleApp.module.css";
import CountdownTimer from "@/components/utils/timer/CountdownTimer";
const SingleApp = ({
  color,
  images,
  description,
  weight,
  price,
  warranty,
  lable,
  name,
  top_price_bid,
  user,
  attrs,
  expireTime,
}) => {
  const totalCost = weight * price;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const backgroundColor =
    color === "buy" ? "var(--dark-green)" : "var(--dark-red)";
  const backgroundColorHover =
    color === "buy" ? "var(--light-green)" : "var(--light-red)";
  const textColor = color === "buy" ? "var(--dark-green)" : "var(--dark-red)";
  const textColorAttr =
    color === "buy" ? "var(--darked-green)" : "var(--darked-red)";

  const goToNextImage = () => {
    setCurrentImageIndex((currentImageIndex + 1) % images.length);
  };

  const goToPreviousImage = () => {
    setCurrentImageIndex(
      (currentImageIndex - 1 + images.length) % images.length
    );
  };
  return (
    <div>
      <div className={styles.imageSlider}>
        <img
          src={images[currentImageIndex] || "/images/no_pic.jpg"} // اگر تصویر وجود ندارد، تصویر پیش‌فرض را نمایش بده
          alt="Product Image"
          width={400}
          height={400}
          className={styles.image}
        />
        <button className={styles.prevButton} onClick={goToPreviousImage}>
        &#10095;
        </button>
        <button className={styles.nextButton} onClick={goToNextImage}>
          
          &#10094;
        </button>
        <div className={styles.dots}>
          {images.map((_, index) => (
            <span
              key={index}
              className={`${styles.dot} ${
                currentImageIndex === index ? styles.active : ""
              }`}
              onClick={() => setCurrentImageIndex(index)}
            ></span>
          ))}
        </div>
        <div className={styles.time_content}>
          <span className={styles.icon_time}>
            <img src="/images/time.svg" alt="rebo" />
          </span>
          <span className={styles.counter_time}>
            <CountdownTimer targetDate={new Date(expireTime)} />
          </span>
        </div>
      </div>
          
      

    </div>
  );
};

export default SingleApp;
