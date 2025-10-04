"use client";
import Link from "next/link";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import Config from "@/config/config"; // کانفیگ API شما
import ProductCard from "@/components/bazar/items/ProductCard";
import styles from "@/styles/bider.module.css";
import { useAuth } from "@/context/AuthContext";
import MyBid from "./MyBid";

export default function MyBids() {
    const { user, isAuthenticated, loading, logout } = useAuth();
    const searchParams = useSearchParams();
    const [myBids, setMyBids] = useState([]);
    const [fetching, setFetching] = useState(false); // وضعیت در حال دریافت درخواست ها
    const [error, setError] = useState(null); // ذخیره خطاها


    const fetchMyBids = async () => {
        if (!user || !isAuthenticated) return;
    
        setFetching(true);
        setError(null);
    
        try {
            const token = localStorage.getItem("accessToken");
            if (!token) {
                console.error("توکن موجود نیست، هدایت به صفحه ورود");
                logout();
                return;
            }
    
            const response = await axios.get(
                Config.getApiUrl("catalogue", "mybids"), // آدرس API مربوط به My Bids
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
    
            setMyBids(response.data); // داده‌های پاسخ
            console.log("########################", response.data);
        } catch (error) {
            console.error("خطا در دریافت پیشنهادات من:", error);
            setError(error);
        } finally {
            setFetching(false);
        }
    };

  useEffect(() => {
    fetchMyBids();
  }, [user, isAuthenticated]);

  if (loading || fetching) {
    return <div>در حال بارگذاری...</div>;
  }

  if (error) {
    return <div>خطا در دریافت محصولات: {error.message || "نامشخص"}</div>;
  }


  return (
    <Suspense fallback={<div>در حال بارگذاری...</div>}>
      <div className={styles.container}>
      <div className={styles.gridContainer}>
      {myBids.length > 0 ? (
    myBids.map((bid) => (
        <MyBid
            key={bid.id}
            color={bid.product_details.sell_buy === 1 ? "buy" : "sell"} // نوع خرید یا فروش
            title={bid.product_details.name_type || "بدون عنوان"}
            description={bid.product_details.description || "توضیحاتی موجود نیست"}
            price={bid.product_details.price || 0}
            myprice={bid.price || 0}
            top_price_bid={bid.product_details.best_price_bid || 0}
            weight={bid.product_details.weight || 0}
            rank={bid.rank} // اضافه کردن رتبه
            packaging={
                bid.product_details.attrs && bid.product_details.attrs.length > 0
                    ? bid.product_details.attrs[0].value
                    : "نوع بسته بندی نامشخص"
            }
            finished_time={bid.product_details.expire_time || "نامشخص"}
            imageSrc={
                bid.product_details.images && bid.product_details.images.length > 0
                    ? `${Config.baseUrl}${bid.product_details.images[0].image}`
                    : "/images/no_pic.jpg"
            }
            url={`/product/${bid.product.id}`}
        />
    ))
) : (
    <div>هیچ پیشنهاد فعالی موجود نیست.</div>
)}
        </div>

      </div>
    </Suspense>
  ); 

}