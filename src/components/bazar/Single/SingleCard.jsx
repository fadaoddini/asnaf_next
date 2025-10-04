import { useState } from "react";
import Image from "next/image";
import formatNumber from "@/components/utils/FormatNumber/formatNumber";
import styles from "./SingleCard.module.css";
import CountdownTimer from "@/components/utils/timer/CountdownTimer";

const SingleCard = ({
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
    <div
      className={styles.card}
      style={{
        "--bg-color": backgroundColor,
        "--text-color": textColor,
        "--border-color": backgroundColor,
        "--bg-color-hover": backgroundColorHover,
        "--text-attr": textColorAttr,
        cursor: "pointer",
      }}
    >
      {/* اسلایدر تصاویر */}
      <div className={styles.imageSlider}>
        <img
          src={images[currentImageIndex] || "/images/no_pic.jpg"} // اگر تصویر وجود ندارد، تصویر پیش‌فرض را نمایش بده
          alt="Product Image"
          width={200}
          height={200}
          className={styles.image}
        />
        <button className={styles.prevButton} onClick={goToPreviousImage}>
          &#10094;
        </button>
        <button className={styles.nextButton} onClick={goToNextImage}>
          &#10095;
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
      </div>

      {/* اطلاعات محصول */}
      <div className={styles.info}>
        <span>{lable}</span>
        <h2 className={styles.title}>{name}</h2>
        <p className={styles.offer}>
          بالاترین پیشنهاد:{" "}
          <span className={styles.green}>{formatNumber(top_price_bid)}</span>
          تومان
        </p>
        <div className={styles.details}>
          <p className={styles.detail}>
            <span className={styles.icon}>💰</span>
            <span className={styles.attr}>قیمت :</span>
            <span className={styles.bold}>{formatNumber(price)}</span>
            تومان
          </p>
          <p className={styles.detail}>
            <span className={styles.icon}>📦</span>
            <span className={styles.attr}>بسته‌بندی :</span>
            {attrs.find((attr) => attr.attr === "بسته بندی")?.value || "نامشخص"}
          </p>
          <p className={styles.detail}>
            <span className={styles.icon}>⚖️</span>
            <span className={styles.attr}>وزن :</span>
            <span className={styles.bold}>{formatNumber(weight)}</span>
            کیلوگرم
          </p>
          <p className={styles.under}>{description}</p>
          <p className={styles.total_price}>
            {formatNumber(totalCost)}
            <span> تومان</span>
          </p>
        </div>
      </div>

      {/* تایمر */}
      <div className={styles.timer}>
        <CountdownTimer targetDate={new Date(expireTime)} />
      </div>

    
      
    </div>
  );
};

export default SingleCard;
