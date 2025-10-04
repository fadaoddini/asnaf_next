import React, { useState } from "react";
import ProductFormModal from "./ProductFormModal"; // فرض بر این است که فایل شما در همان پوشه است
import styles from "./AddProduct.module.css"; // استایل‌های مربوط به مودال

const AddProduct = ({ sellBuyType, fetchProducts }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleProductAdded = (newProduct) => {
    fetchProducts();
    handleCloseModal();
  };

  const text1 =
    "اگر محصولی برای فروش دارید از این قسمت می توانید آن را ثبت کنید";
  const text2 =
    "اگر در جستجوی محصولی برای خرید هستید می توانید درخواست سفارش محصول مورد نظر خود را از این قسمت ارائه دهید";

  return (
    <div>
      <div className={styles.box_add_btn}>
        <button onClick={handleOpenModal} className={styles.submitButton}>
          {sellBuyType === "sell" ? "ثبت محصول" : "ثبت درخواست"}
        </button>
        <p className={styles.box_title}>
          {sellBuyType === "sell" ? text1 : text2}
        </p>
      </div>

      {isModalOpen && (
        <ProductFormModal
          show={isModalOpen}
          handleClose={handleCloseModal}
          sellBuyType={sellBuyType} // ارسال نوع خرید/فروش به فرم
          onProductAdded={handleProductAdded} // تابعی برای مدیریت اضافه شدن محصول
        />
      )}
    </div>
  );
};

export default AddProduct;
