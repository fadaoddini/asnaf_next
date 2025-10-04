'use client';

import { useState } from 'react';
import styles from './law.module.css';

export default function Law() {
  const [openItems, setOpenItems] = useState([]);

  const toggleItem = (index) => {
    if (openItems.includes(index)) {
      setOpenItems(openItems.filter(item => item !== index));
    } else {
      setOpenItems([...openItems, index]);
    }
  };

  const laws = [
    {
      id: 1,
      question: "ابتدا قبل از رزرو باید از طریق لینک زیر بیعانه را پرداخت نمایید",
      answer: (
        <>
          <p>لطفاً قبل از تکمیل فرم رزرو، مبلغ بیعانه را از طریق لینک زیر پرداخت نمایید:</p>
          <div className={styles.paymentLink}>
            <a 
              href="https://zarinp.al/620554" 
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.link}
            >
              https://zarinp.al/620554
            </a>
          </div>
          <p>پس از پرداخت موفق، تصویر رسید پرداختی را در قسمت مربوطه در فرم رزرو آپلود نمایید.</p>
        </>
      )
    },
    {
      id: 2,
      question: "کنسلی رزرو غیرممکن است",
      answer: "پس از انجام رزرو، امکان کنسل کردن آن وجود ندارد. این سیاست به منظور حفظ برنامه‌ریزی و مدیریت بهتر منابع در نظر گرفته شده است. لطفاً قبل از نهایی کردن رزرو، از تصمیم خود اطمینان حاصل فرمایید."
    },
    {
      id: 3,
      question: "وجه پرداختی بابت بیعانه غیرقابل استرداد است",
      answer: "مبلغ بیعانه پرداختی در صورت انصراف از رزرو، تحت هیچ شرایطی قابل بازگشت نمی‌باشد. این مبلغ به عنوان تضمین رزرو در نظر گرفته شده و در صورت انصراف، به عنوان خسارت محسوب می‌گردد."
    },
    {
      id: 4,
      question: "رزرو پس از تایید پرداخت قطعی است",
      answer: "رزرو شما تنها پس از تایید کامل پرداخت، نهایی و قطعی می‌شود. تا قبل از تایید پرداخت، رزرو شما در حالت انتظار قرار دارد و امکان لغو یا تغییر آن توسط سیستم وجود دارد."
    },
    {
      id: 5,
      question: "هنگام رزرو باید رسید پرداختی مبلغ بیعانه ۱۰ میلیون تومان را آپلود نمایید",
      answer: "لطفاً پس از واریز مبلغ بیعانه ۱۰ میلیون تومانی، تصویر واضح از رسید پرداختی را در فرم مربوطه آپلود نمایید. این رسید باید شامل اطلاعات کامل انتقال، شامل شماره پیگیری، تاریخ و ساعت تراکنش باشد. عدم آپلود رسید معتبر می‌تواند منجر به تاخیر در تایید رزرو یا لغو آن شود."
    }
  ];

  return (
    <div className={styles.lawContainer}>
      <h1 className={styles.lawTitle}>قوانین و مقررات</h1>
      <ul className={styles.lawList}>
        {laws.map((law, index) => (
          <li key={law.id} className={styles.lawItem}>
            <div 
              className={styles.lawHeader} 
              onClick={() => toggleItem(index)}
            >
              <div className={styles.lawNumber}>{law.id}</div>
              <div className={styles.lawQuestion}>{law.question}</div>
              <svg 
                className={`${styles.lawIcon} ${openItems.includes(index) ? styles.open : ''}`} 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className={`${styles.lawContent} ${openItems.includes(index) ? styles.open : ''}`}>
              <div className={styles.lawText}>{law.answer}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}