import Link from "next/link";
import styles from "./MyBid.module.css";
import formatNumber from "@/components/utils/FormatNumber/formatNumber";

const Icon = ({ src, alt, color }) => {
  const iconClass = color === "sell" ? styles.sellIcon : styles.buyIcon;
  return <img className={`${styles.icon} ${iconClass}`} src={src} alt={alt} />;
};

const MyBid = ({
  color,
  url,
  title,
  price,
  myprice,
  weight,
  packaging,
  imageSrc,
  rank,
}) => {
  const cardClassName = color === "sell" ? styles.sellCard : styles.buyCard;
  const subTitle = color === "sell" ? "آگهی خرید" : "آگهی فروش";

  return (
    <Link href={url}>
      <div className={`${styles.card} ${cardClassName}`} style={{ cursor: "pointer" }}>
        <div className={styles.imageContainer}>
          <img src={imageSrc} alt={title} width={100} height={100} className={styles.image} />
          <img
            className={styles.label_img}
            src={`/images/label_${color}.svg`}
            alt={color}
          />
        </div>
        <div className={styles.info}>
          <h2 className={styles.title}>
            <span>{subTitle}</span> {title}
          </h2>
          <div className={styles.details}>
            <p className={styles.detail}>
              <Icon src="/images/bag.svg" alt="بسته‌بندی" color={color} />
              <span className={styles.attr}>نوع بسته‌بندی:</span> {packaging}
            </p>
            <p className={styles.detail}>
              <Icon src="/images/weight.svg" alt="وزن" color={color} />
              <span className={styles.attr}>وزن:</span>
              <span className={styles.bold}>{formatNumber(weight)}</span> کیلوگرم
            </p>
            <p className={styles.detailer}>
              <span className={styles.bolder}>{formatNumber(price)}</span> تومان
              <span className={styles.attr}>  - به ازای هر کیلوگرم</span>
            </p>
          </div>
        </div>
        <div className={styles.timerContainer}>
          <div className={styles.timerLeft}>
            <span className={styles.span_rank}>رتبه شما: {formatNumber(rank)}</span>
            <div className={styles.timerIcon}>
              <span>
                پیشنهاد شما: {formatNumber(myprice)} تومان
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MyBid;