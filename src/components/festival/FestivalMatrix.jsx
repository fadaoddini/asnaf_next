// components/festival/FestivalMatrix.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Config from '@/config/config';
import styles from './festivalMatrix.module.css';

const FestivalMatrix = ({ matrix, width, height, festivalId, onRoomAdded, onRoomClick }) => {
  const [selectedCell, setSelectedCell] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    nabsh: true,
    metraj: '',
    description: '',
    price: '',
    is_label: false,
    status: 0
  });
  const [reservationInfo, setReservationInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [reservationLoading, setReservationLoading] = useState(false);

  // تابع برای دریافت اطلاعات رزرو
  const fetchReservationInfo = async (roomId) => {
    if (!roomId) return;
    setReservationLoading(true);
    try {
      const response = await axios.get(
        Config.getApiUrl("festival", `room/${roomId}/reservation-info`),
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          }
        }
      );
      setReservationInfo(response.data);
    } catch (error) {
      console.error('Error fetching reservation info:', error);
      setReservationInfo(null);
    } finally {
      setReservationLoading(false);
    }
  };

  const getCellColorClass = (cell) => {
    if (!cell || cell.empty) return styles.cellEmpty;
    if (cell.status === 0) return styles.cellFree;
    if (cell.status === 1) return styles.cellReserved;
    if (cell.status === 2) return styles.cellConfirmed;
    if (cell.status === 3) return styles.cellUnavailable;
    return styles.cellEmpty;
  };

  const getCellTitle = (cell, rowIndex, colIndex) => {
    if (!cell || cell.empty) {
      return `موقعیت: (${colIndex}, ${rowIndex})\nوضعیت: خالی\n(کلیک برای افزودن غرفه)`;
    }
    return `غرفه: ${cell.name}\nموقعیت: (${colIndex}, ${rowIndex})\nوضعیت: ${cell.status_display}\nقیمت: ${cell.price} تومان`;
  };

  const handleCellClick = async (cell, rowIndex, colIndex) => {
    // اگر سلول خالی نیست، اجازه ویرایش بده
    if (cell && !cell.empty) {
      setFormData({
        name: cell.name || '',
        nabsh: cell.nabsh !== undefined ? cell.nabsh : true,
        metraj: cell.metraj || '',
        description: cell.description || '',
        price: cell.price || '',
        is_label: cell.is_label || false,
        status: cell.status || 0
      });

      // اگر غرفه رزرو شده است، اطلاعات رزرو را دریافت کن
      if (cell.status === 1) {
        await fetchReservationInfo(cell.id);
      } else {
        setReservationInfo(null);
      }
    } else {
      // اگر سلول خالی است، فرم خالی نشان بده
      setFormData({
        name: `غرفه ${colIndex}-${rowIndex}`,
        nabsh: true,
        metraj: '',
        description: '',
        price: '',
        is_label: false,
        status: 0
      });
      setReservationInfo(null);
    }

    setSelectedCell({ cell, rowIndex, colIndex });
    setShowDialog(true);
  };

  // وقتی وضعیت تغییر کرد، اطلاعات رزرو را بروزرسانی کن
  useEffect(() => {
    if (showDialog && selectedCell && selectedCell.cell && !selectedCell.cell.empty) {
      if (formData.status === 1 && selectedCell.cell.status !== 1) {
        // اگر وضعیت به رزرو شده تغییر کرد
        fetchReservationInfo(selectedCell.cell.id);
      } else if (formData.status !== 1) {
        // اگر وضعیت از رزرو شده تغییر کرد
        setReservationInfo(null);
      }
    }
  }, [formData.status, showDialog, selectedCell]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // تبدیل مقادیر خالی به ۰
      const processedFormData = {
        ...formData,
        metraj: formData.metraj === '' ? '0' : formData.metraj,
        price: formData.price === '' ? '0' : formData.price,
      };

      const roomData = {
        ...processedFormData,
        w_i: selectedCell.colIndex,
        h_i: selectedCell.rowIndex,
        festival: festivalId
      };

      let response;
      
      if (selectedCell.cell && !selectedCell.cell.empty) {
        // ویرایش غرفه موجود
        response = await axios.put(
          Config.getApiUrl("festival", `festival/${festivalId}/room/${selectedCell.cell.id}`),
          roomData
        );
      } else {
        // ایجاد غرفه جدید
        response = await axios.post(
          Config.getApiUrl("festival", `festival/${festivalId}/room`),
          roomData
        );
      }

      if (onRoomAdded) {
        onRoomAdded(response.data);
      }

      setShowDialog(false);
      setSelectedCell(null);
      setReservationInfo(null);
      
    } catch (error) {
      console.error('Error saving room:', error);
      alert('خطا در ذخیره اطلاعات: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedCell.cell || selectedCell.cell.empty) return;

    if (!confirm('آیا از حذف این غرفه مطمئن هستید؟')) return;

    setLoading(true);

    try {
      await axios.delete(
        Config.getApiUrl("festival", `festival/${festivalId}/room/${selectedCell.cell.id}`)
      );

      if (onRoomAdded) {
        onRoomAdded();
      }

      setShowDialog(false);
      setSelectedCell(null);
      setReservationInfo(null);
      
    } catch (error) {
      console.error('Error deleting room:', error);
      alert('خطا در حذف غرفه: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const closeDialog = () => {
    setShowDialog(false);
    setSelectedCell(null);
    setReservationInfo(null);
  };

  return (
    <div className={styles.matrixContainer}>
      <div 
        className={styles.matrixGrid}
        style={{
          gridTemplateColumns: `repeat(${width}, 1fr)`,
          gridTemplateRows: `repeat(${height}, 1fr)`
        }}
      >
        {matrix.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`${styles.matrixCell} ${getCellColorClass(cell)}`}
              title={getCellTitle(cell, rowIndex, colIndex)}
              onClick={() => handleCellClick(cell, rowIndex, colIndex)}
            >
              {cell && !cell.empty && (
                <span className={styles.cellIndicator}>
                  {cell.status === 1 ? 'R' : cell.status === 2 ? 'C' : ''}
                </span>
              )}
            </div>
          ))
        )}
      </div>
      
      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <div className={`${styles.legendColor} ${styles.cellFree}`}></div>
          <span>  غرفه آزاد</span>
        </div>
        <div className={styles.legendItem}>
          <div className={`${styles.legendColor} ${styles.cellEmpty}`}></div>
          <span>  راهرو</span>
        </div>
        <div className={styles.legendItem}>
          <div className={`${styles.legendColor} ${styles.cellReserved}`}></div>
          <span>رزرو شده (R)</span>
        </div>
        <div className={styles.legendItem}>
          <div className={`${styles.legendColor} ${styles.cellConfirmed}`}></div>
          <span>قطعی شده (C)</span>
        </div>
        <div className={styles.legendItem}>
          <div className={`${styles.legendColor} ${styles.cellUnavailable}`}></div>
          <span>غیرقابل فروش</span>
        </div>
     
      </div>

    {/* دیالوگ */}
      {showDialog && selectedCell && (
        <div className={styles.dialogOverlay}>
          <div className={styles.dialog} style={reservationInfo ? {maxWidth: '600px'} : {}}>
            <div className={styles.dialogHeader}>
              <h3>
                {selectedCell.cell && !selectedCell.cell.empty ? 'ویرایش غرفه' : 'افزودن غرفه جدید'}
              </h3>
              <button className={styles.closeButton} onClick={closeDialog}>×</button>
            </div>
            
            <form onSubmit={handleSubmit} className={styles.dialogForm}>
              <div className={styles.formGroup}>
                <label>موقعیت:</label>
                <span className={styles.positionDisplay}>
                  ({selectedCell.colIndex}, {selectedCell.rowIndex})
                </span>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="name">نام غرفه:</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="metraj">متراژ:</label>
                <input
                  type="number"
                  id="metraj"
                  name="metraj"
                  value={formData.metraj}
                  onChange={handleInputChange}
                  step="1"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="price">قیمت (تومان):</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  step="1000000"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="description">توضیحات:</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                />
              </div>

              <div className={styles.formGroupRow}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    name="nabsh"
                    checked={formData.nabsh}
                    onChange={handleInputChange}
                  />
                  نبش می باشد
                </label>

                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    name="is_label"
                    checked={formData.is_label}
                    onChange={handleInputChange}
                  />
                  لیبل دارد
                </label>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="status">وضعیت:</label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                >
                  <option value={0}>آزاد</option>
                  <option value={1}>رزرو شده</option>
                  <option value={2}>قطعی شده</option>
                  <option value={3}>غیرقابل فروش</option>
                </select>
              </div>

              {/* بخش اطلاعات رزرو */}
              {(formData.status === 1 || reservationInfo) && (
                <div className={styles.reservationSection}>
                  <h4>📋 اطلاعات رزرو</h4>
                  
                  {reservationLoading ? (
                    <div className={styles.loading}>در حال دریافت اطلاعات رزرو...</div>
                  ) : reservationInfo ? (
                    <div className={styles.reservationInfo}>
                      <div className={styles.reservationRow}>
                        <strong>نام و نام خانوادگی:</strong>
                        <span>{reservationInfo.first_name} {reservationInfo.last_name}</span>
                      </div>
                      <div className={styles.reservationRow}>
                        <strong>کد ملی:</strong>
                        <span>{reservationInfo.national_code}</span>
                      </div>
                      <div className={styles.reservationRow}>
    <strong>تصویر فیش واریزی:</strong>
    <span>
        {reservationInfo.receipt_image ? (
            <div className={styles.receiptImageContainer}>
                <img 
                    src={`${Config.baseUrl}${reservationInfo.receipt_image}`}
                    alt="فیش واریزی"
                    className={styles.receiptImage}
                    onClick={() => window.open(`${Config.baseUrl}${reservationInfo.receipt_image}`, '_blank')}
                />
                <button 
                    className={styles.viewFullButton}
                    onClick={() => window.open(`${Config.baseUrl}${reservationInfo.receipt_image}`, '_blank')}
                >
                    مشاهده تصویر کامل
                </button>
            </div>
        ) : (
            'فاقد تصویر'
        )}
    </span>
</div>
                      <div className={styles.reservationRow}>
                        <strong>تلفن:</strong>
                        <span>{reservationInfo.phone}</span>
                      </div>
                      <div className={styles.reservationRow}>
                        <strong>ایمیل:</strong>
                        <span>{reservationInfo.email || '---'}</span>
                      </div>
                      <div className={styles.reservationRow}>
                        <strong>نام شرکت:</strong>
                        <span>{reservationInfo.company_name || '---'}</span>
                      </div>
                      <div className={styles.reservationRow}>
                        <strong>شماره ثبت شرکت:</strong>
                        <span>{reservationInfo.company_registration_number || '---'}</span>
                      </div>
                      <div className={styles.reservationRow}>
                        <strong>نوع فعالیت:</strong>
                        <span>{reservationInfo.activity_type || '---'}</span>
                      </div>
                      <div className={styles.reservationRow}>
                        <strong>آدرس:</strong>
                        <span>{reservationInfo.address}</span>
                      </div>
                      <div className={styles.reservationRow}>
                        <strong>تاریخ رزرو:</strong>
                        <span>{new Date(reservationInfo.created_at).toLocaleString('fa-IR')}</span>
                      </div>
                      <div className={styles.reservationRow}>
                        <strong>وضعیت رزرو:</strong>
                        <span className={`${styles.statusBadge} ${styles[`status-${reservationInfo.status}`]}`}>
                          {reservationInfo.status_display}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className={styles.noReservation}>
                      هیچ اطلاعات رزروی برای این غرفه یافت نشد.
                    </div>
                  )}
                </div>
              )}

              <div className={styles.dialogActions}>
                <button 
                  type="submit" 
                  className={styles.saveButton}
                  disabled={loading}
                >
                  {loading ? 'در حال ذخیره...' : 'ذخیره'}
                </button>
                
                {selectedCell.cell && !selectedCell.cell.empty && (
                  <button 
                    type="button" 
                    className={styles.deleteButton}
                    onClick={handleDelete}
                    disabled={loading}
                  >
                    حذف
                  </button>
                )}
                
                <button 
                  type="button" 
                  className={styles.cancelButton}
                  onClick={closeDialog}
                  disabled={loading}
                >
                  انصراف
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FestivalMatrix;