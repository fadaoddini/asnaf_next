"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Config from "@/config/config"; // کانفیگ API شما
import ProductCard from "@/components/bazar/items/ProductCard";
import styles from "./MyProduct.module.css"; // استایل‌های ماژولار

const MyProduct = () => {
  const [activeTab, setActiveTab] = useState(1); // تنظیم وضعیت تب فعال
  const [products, setProducts] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null); // ذخیره توکن JWT


  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken"); 
    if (storedToken) {
      setToken(storedToken); 
      console.log("dsdsdsdsdsd",storedToken);
    } else {
      setError("توکن JWT یافت نشد.");
    }
  }, []);

  // وضعیت‌های مختلف برای فیلتر کردن
  const STATUS_MAP = {
    1: 1, // در انتظار تایید
    2: 2, // تایید شده
    3: 3, // رد شده
    4: 4,  // منقضی شده
  };

  // برای دریافت محصولات بر اساس وضعیت
  const fetchProducts = async (status) => {
    if (!token) {
      setError("توکن JWT معتبر نیست.");
      return;
    }

    setFetching(true); // شروع بارگذاری
    setError(null); // ریست خطاها

    try {
      // ارسال درخواست به API
      const response = await axios.post(
        Config.getApiUrl("catalogue", "myproducts"),
        {
          status: STATUS_MAP[status], // ارسال وضعیت به API
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // ارسال توکن JWT برای احراز هویت
          },
        }
      );
      setProducts(response.data);
      console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$", response.data);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError(err.message || "خطا در دریافت محصولات");
    } finally {
      setFetching(false); // پایان بارگذاری
    }
  };

  // بارگذاری محصولات هنگام تغییر تب
  useEffect(() => {
    if (token) {
      fetchProducts(activeTab); // بارگذاری محصولات برای وضعیت انتخابی
    }
  }, [activeTab, token]);

  // مدیریت بارگذاری و خطاها
  if (fetching) {
    return <div>در حال بارگذاری...</div>;
  }

  if (error) {
    return <div>خطا در دریافت محصولات: {error}</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.tabsWrapper}>
        {/* تب‌ها */}
        <div className={styles.tabs}>
          <button
            className={`${styles.tabButton} ${activeTab === 1 ? styles.activeTab : ""}`}
            onClick={() => setActiveTab(1)}
          >
            در انتظار تایید
          </button>
          <button
            className={`${styles.tabButton} ${activeTab === 2 ? styles.activeTab : ""}`}
            onClick={() => setActiveTab(2)}
          >
            تایید شده
          </button>
          <button
            className={`${styles.tabButton} ${activeTab === 3 ? styles.activeTab : ""}`}
            onClick={() => setActiveTab(3)}
          >
            رد شده
          </button>
          <button
            className={`${styles.tabButton} ${activeTab === 4 ? styles.activeTab : ""}`}
            onClick={() => setActiveTab(4)}
          >
            منقضی شده
          </button>
        </div>
      </div>

      {/* لیست محصولات */}
      <div className={styles.gridContainer}>
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              title={product.name_type || "بدون عنوان"}
              description={product.description || "توضیحاتی موجود نیست"}
              price={product.price || 0}
              top_price_bid={product.best_price_bid || 0}
              weight={product.weight || 0}
              packaging={
                product.attrs && product.attrs.length > 0
                  ? product.attrs[0].value
                  : "نوع بسته بندی نامشخص"
              }
              finished_time={product.expire_time || "نامشخص"}
              imageSrc={
                product.images && product.images.length > 0
                  ? `${Config.baseUrl}${product.images[0].image}`
                  : "/images/no_pic.jpg"
              }
              url={`/product/${product.id}`}
            />
          ))
        ) : (
          <div>هیچ محصولی یافت نشد.</div>
        )}
      </div>
    </div>
  );
};

export default MyProduct;
