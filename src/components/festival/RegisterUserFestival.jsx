// components/festival/RegisterUserFestival.jsx
import React, { useState } from 'react';
import axios from 'axios';
import Config from '@/config/config';
import { useAuth } from '@/context/AuthContext';
import styles from './registerUserFestival.module.css';

const RegisterUserFestival = ({ selectedRoom, festivalId, onRegistrationComplete, onClose }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
    national_code: '',
    phone: '',
    address: '',
    company_name: '',
    company_registration_number: '',
    activity_type: '',
    receipt_image: null,
    description: ''
  });

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'receipt_image') {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

// در کامپوننت RegisterUserFestival - آپدیت تابع handleSubmit
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const submitData = new FormData();
    
    // اطلاعات کاربر
    submitData.append('first_name', formData.first_name);
    submitData.append('last_name', formData.last_name);
    submitData.append('national_code', formData.national_code);
    submitData.append('phone', formData.phone);
    submitData.append('email', formData.email || '');
    submitData.append('address', formData.address);
    submitData.append('company_name', formData.company_name || '');
    submitData.append('company_registration_number', formData.company_registration_number || '');
    submitData.append('activity_type', formData.activity_type || '');
    submitData.append('description', formData.description || '');
    
    // اطلاعات رزرو
    submitData.append('room', selectedRoom.id);
    
    if (formData.receipt_image) {
      submitData.append('receipt_image', formData.receipt_image);
    }

    const response = await axios.post(
      Config.getApiUrl("festival", "room/reservation"),
      submitData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      }
    );

    if (response.data.status === 'success') {
      alert('رزرو با موفقیت ثبت شد و در انتظار تایید می‌باشد.');
      if (onRegistrationComplete) {
        onRegistrationComplete();
      }
    } else {
      alert('خطا در ثبت رزرو: ' + response.data.message);
    }

  } catch (error) {
    console.error('Error submitting reservation:', error);
    const errorMessage = error.response?.data?.message || 
                        error.response?.data?.errors ? 
                        JSON.stringify(error.response.data.errors) : 
                        error.message;
    alert('خطا در ثبت رزرو: ' + errorMessage);
  } finally {
    setLoading(false);
  }
};

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className={styles.dialogOverlay}>
      <div className={styles.dialog}>
        <div className={styles.dialogHeader}>
          <h3>ثبت درخواست رزرو غرفه</h3>
          <button className={styles.closeButton} onClick={handleClose}>×</button>
        </div>
        
        <div className={styles.dialogContent}>
          <div className={styles.roomInfo}>
            <h4>اطلاعات غرفه انتخاب شده</h4>
            <div className={styles.roomDetails}>
              <p><strong>نام غرفه:</strong> {selectedRoom.name}</p>
              <p><strong>موقعیت:</strong> ({selectedRoom.w_i}, {selectedRoom.h_i})</p>
              <p><strong>متراژ:</strong> {selectedRoom.metraj || 'تعیین نشده'}</p>
              <p><strong>قیمت:</strong> {selectedRoom.price ? `${selectedRoom.price} تومان` : 'تعیین نشده'}</p>
              <p><strong>توضیحات:</strong> {selectedRoom.description || 'ندارد'}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className={styles.registrationForm}>
            <h4>تکمیل اطلاعات برای رزرو</h4>
            
            <div className={styles.formSection}>
              <h5>اطلاعات شخصی</h5>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="first_name">نام *</label>
                  <input
                    type="text"
                    id="first_name"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="last_name">نام خانوادگی *</label>
                  <input
                    type="text"
                    id="last_name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="national_code">کد ملی *</label>
                  <input
                    type="text"
                    id="national_code"
                    name="national_code"
                    value={formData.national_code}
                    onChange={handleInputChange}
                    required
                    maxLength="10"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="phone">تلفن ثابت *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="email">ایمیل</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="address">آدرس *</label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows="3"
                  required
                />
              </div>
            </div>

            <div className={styles.formSection}>
              <h5>اطلاعات کسب و کار</h5>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="company_name">نام شرکت/مؤسسه</label>
                  <input
                    type="text"
                    id="company_name"
                    name="company_name"
                    value={formData.company_name}
                    onChange={handleInputChange}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="company_registration_number">شماره ثبت</label>
                  <input
                    type="text"
                    id="company_registration_number"
                    name="company_registration_number"
                    value={formData.company_registration_number}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="activity_type">نوع فعالیت</label>
                <input
                  type="text"
                  id="activity_type"
                  name="activity_type"
                  value={formData.activity_type}
                  onChange={handleInputChange}
                  placeholder="مثال: صنایع دستی، پوشاک، مواد غذایی و ..."
                />
              </div>
            </div>

            <div className={styles.formSection}>
              <h5>رسید پرداخت</h5>
              <div className={styles.formGroup}>
                <label htmlFor="receipt_image">تصویر فیش واریزی *</label>
                <input
                  type="file"
                  id="receipt_image"
                  name="receipt_image"
                  onChange={handleInputChange}
                  accept="image/*,.pdf"
                  required
                />
                <small>فرمت‌های مجاز: JPG, PNG, PDF (حداکثر 5MB)</small>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="description">توضیحات اضافی</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="هر گونه توضیح اضافی در مورد درخواست رزرو..."
                />
              </div>
            </div>

            <div className={styles.dialogActions}>
              <button 
                type="submit" 
                className={styles.submitButton}
                disabled={loading}
              >
                {loading ? 'در حال ثبت...' : 'ثبت درخواست رزرو'}
              </button>
              <button 
                type="button" 
                className={styles.cancelButton}
                onClick={handleClose}
                disabled={loading}
              >
                انصراف
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterUserFestival;