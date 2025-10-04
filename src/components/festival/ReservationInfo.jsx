// components/festival/ReservationInfo.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Config from '@/config/config';
import styles from './reservationInfo.module.css';

const ReservationInfo = ({ room, onClose }) => {
  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchReservationInfo();
  }, [room]);

  const fetchReservationInfo = async () => {
    try {
      setLoading(true);
      // فرض می‌کنیم API برای دریافت اطلاعات رزرو یک غرفه داریم
      const response = await axios.get(
        Config.getApiUrl("festival", `room/${room.id}/reservation`),
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          }
        }
      );
      setReservation(response.data);
    } catch (error) {
      console.error('Error fetching reservation info:', error);
      setError('خطا در دریافت اطلاعات رزرو');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      const response = await axios.put(
        Config.getApiUrl("festival", `reservation/${reservation.id}`),
        { status: newStatus },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          }
        }
      );
      
      setReservation(response.data);
      alert('وضعیت با موفقیت به‌روزرسانی شد');
    } catch (error) {
      console.error('Error updating reservation status:', error);
      alert('خطا در به‌روزرسانی وضعیت');
    }
  };

  if (loading) {
    return (
      <div className={styles.dialogOverlay}>
        <div className={styles.dialog}>
          <div className={styles.loading}>در حال بارگذاری...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.dialogOverlay}>
        <div className={styles.dialog}>
          <div className={styles.error}>{error}</div>
          <button className={styles.closeButton} onClick={onClose}>بستن</button>
        </div>
      </div>
    );
  }

  if (!reservation) {
    return (
      <div className={styles.dialogOverlay}>
        <div className={styles.dialog}>
          <div className={styles.noReservation}>هیچ اطلاعات رزروی برای این غرفه یافت نشد</div>
          <button className={styles.closeButton} onClick={onClose}>بستن</button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.dialogOverlay}>
      <div className={styles.dialog}>
        <div className={styles.dialogHeader}>
          <h3>اطلاعات رزرو غرفه {room.name}</h3>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>
        
        <div className={styles.dialogContent}>
          {/* اطلاعات غرفه */}
          <div className={styles.section}>
            <h4>اطلاعات غرفه</h4>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <label>نام غرفه:</label>
                <span>{room.name}</span>
              </div>
              <div className={styles.infoItem}>
                <label>موقعیت:</label>
                <span>({room.w_i}, {room.h_i})</span>
              </div>
              <div className={styles.infoItem}>
                <label>متراژ:</label>
                <span>{room.metraj || 'تعیین نشده'}</span>
              </div>
              <div className={styles.infoItem}>
                <label>قیمت:</label>
                <span>{room.price ? `${room.price} تومان` : 'تعیین نشده'}</span>
              </div>
            </div>
          </div>

          {/* اطلاعات کاربر */}
          <div className={styles.section}>
            <h4>اطلاعات متقاضی</h4>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <label>نام و نام خانوادگی:</label>
                <span>{reservation.first_name} {reservation.last_name}</span>
              </div>
              <div className={styles.infoItem}>
                <label>شماره موبایل:</label>
                <span>{reservation.user_mobile}</span>
              </div>
              <div className={styles.infoItem}>
                <label>کد ملی:</label>
                <span>{reservation.national_code}</span>
              </div>
              <div className={styles.infoItem}>
                <label>تلفن ثابت:</label>
                <span>{reservation.phone}</span>
              </div>
              <div className={styles.infoItem}>
                <label>ایمیل:</label>
                <span>{reservation.email || 'ندارد'}</span>
              </div>
              <div className={styles.infoItem}>
                <label>آدرس:</label>
                <span>{reservation.address}</span>
              </div>
            </div>
          </div>

          {/* اطلاعات کسب و کار */}
          {(reservation.company_name || reservation.activity_type) && (
            <div className={styles.section}>
              <h4>اطلاعات کسب و کار</h4>
              <div className={styles.infoGrid}>
                {reservation.company_name && (
                  <div className={styles.infoItem}>
                    <label>نام شرکت/مؤسسه:</label>
                    <span>{reservation.company_name}</span>
                  </div>
                )}
                {reservation.company_registration_number && (
                  <div className={styles.infoItem}>
                    <label>شماره ثبت:</label>
                    <span>{reservation.company_registration_number}</span>
                  </div>
                )}
                {reservation.activity_type && (
                  <div className={styles.infoItem}>
                    <label>نوع فعالیت:</label>
                    <span>{reservation.activity_type}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* تصویر رسید پرداخت */}
          <div className={styles.section}>
            <h4>رسید پرداخت</h4>
            <div className={styles.receiptSection}>
              {reservation.receipt_image ? (
                <div className={styles.receiptImage}>
                  <img 
                    src={reservation.receipt_image} 
                    alt="رسید پرداخت" 
                    className={styles.receiptImg}
                  />
                  <a 
                    href={reservation.receipt_image} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={styles.downloadLink}
                  >
                    📥 دانلود تصویر
                  </a>
                </div>
              ) : (
                <div className={styles.noReceipt}>تصویر رسید پرداخت موجود نیست</div>
              )}
            </div>
          </div>

          {/* توضیحات اضافی */}
          {reservation.description && (
            <div className={styles.section}>
              <h4>توضیحات اضافی</h4>
              <div className={styles.description}>
                {reservation.description}
              </div>
            </div>
          )}

          {/* وضعیت رزرو و اقدامات */}
          <div className={styles.section}>
            <h4>وضعیت رزرو</h4>
            <div className={styles.statusSection}>
              <div className={styles.currentStatus}>
                <label>وضعیت فعلی:</label>
                <span className={`${styles.status} ${styles[`status-${reservation.status}`]}`}>
                  {reservation.status_display}
                </span>
              </div>
              
              <div className={styles.statusActions}>
                <h5>تغییر وضعیت:</h5>
                <div className={styles.actionButtons}>
                  {reservation.status === 0 && (
                    <>
                      <button 
                        className={styles.approveButton}
                        onClick={() => handleStatusUpdate(1)}
                      >
                        تایید رزرو
                      </button>
                      <button 
                        className={styles.rejectButton}
                        onClick={() => handleStatusUpdate(2)}
                      >
                        رد رزرو
                      </button>
                    </>
                  )}
                  {reservation.status === 1 && (
                    <button 
                      className={styles.cancelButton}
                      onClick={() => handleStatusUpdate(3)}
                    >
                      لغو رزرو
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* اطلاعات زمانی */}
          <div className={styles.section}>
            <h4>اطلاعات زمانی</h4>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <label>تاریخ درخواست:</label>
                <span>{new Date(reservation.created_at).toLocaleString('fa-IR')}</span>
              </div>
              {reservation.reserved_at && (
                <div className={styles.infoItem}>
                  <label>تاریخ تایید:</label>
                  <span>{new Date(reservation.reserved_at).toLocaleString('fa-IR')}</span>
                </div>
              )}
              <div className={styles.infoItem}>
                <label>آخرین بروزرسانی:</label>
                <span>{new Date(reservation.updated_at).toLocaleString('fa-IR')}</span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.dialogActions}>
          <button className={styles.closeBtn} onClick={onClose}>
            بستن
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReservationInfo;