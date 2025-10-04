import { useEffect, useState } from "react";
import Modal from "react-modal";
import axios from "axios";
import Config from "config/config";
import styles from "./AddBid.module.css"; // اضافه کردن استایل ماژول
const AddBid = ({ productId, name, lable, top_price_bid, onBidSubmitted, onBidListSubmitted }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bidPrice, setBidPrice] = useState("");
  const [bidWeight, setBidWeight] = useState("");
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);


  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleBidSubmit = async (e) => {
    e.preventDefault();
    const bidData = {
      price: bidPrice,
      weight: bidWeight,
      product_id: productId, // شناسه محصول
    };

    try {
      const response = await axios.post(
        Config.getApiUrl("bid", "add_bid_api"),
        bidData, // داده‌های ارسال شده
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      
      // پس از ارسال موفقیت‌آمیز، تابع بروزرسانی لیست بیدها را فراخوانی کنید
      if (onBidSubmitted) {
        onBidSubmitted();  // بروزرسانی لیست بیدها
        onBidListSubmitted();
      }

      closeModal(); // بستن مودال بعد از ارسال
    } catch (error) {
      console.error("Error submitting bid:", error);
    }
  };

  return (
    <div>
      <button onClick={openModal} className={styles.submitButton}>
        ثبت پیشنهاد قیمت
      </button>
      <p className={styles.title}>
        می توانید پیشنهاد خود را ثبت کنید و در لیست مزایده این محصول قرار بگیرید
      </p>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        overlayClassName={styles.modalOverlay}
        className={styles.modalContent}
      >
        <h2 className={styles.header}>
          ثبت پیشنهاد قیمت
          <span>
            ({name} - {lable} )
          </span>
        </h2>
        <p className={styles.p2}>
          بهترین قیمت پیشنهاد شده
          <span>
          {top_price_bid}
          </span>
         

          تومان به ازای هر کیلوگرم می باشد
        </p>
        <form onSubmit={handleBidSubmit}>
          <div className={styles.inputContainer}>
            <label htmlFor="bidPrice" className={styles.inputLabel}>
              قیمت به ازای هر کیلوگرم (تومان):
            </label>
            <input
              type="number"
              id="bidPrice"
              value={bidPrice}
              onChange={(e) => setBidPrice(e.target.value)}
              required
              className={styles.inputField}
            />
          </div>
          <div className={styles.inputContainer}>
            <label htmlFor="bidWeight" className={styles.inputLabel}>
              وزن کل (کیلوگرم):
            </label>
            <input
              type="number"
              id="bidWeight"
              value={bidWeight}
              onChange={(e) => setBidWeight(e.target.value)}
              required
              className={styles.inputField}
            />
          </div>
          <div className={styles.buttons}>
            <button type="submit" className={styles.submitButton2}>
              ارسال پیشنهاد
            </button>
            <button
              type="button"
              onClick={closeModal}
              className={styles.closeButton}
            >
              بستن
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AddBid;
