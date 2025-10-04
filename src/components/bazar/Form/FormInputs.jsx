import React from "react";
import styles from "./FormStyle.module.css"

const FormInputs = ({ formData, handleChange }) => (
  <div className={styles.form_grid}>
    {/* قیمت محصول */}
    <div className={styles.form_group}>
      <label htmlFor="productPrice" className={styles.form_label}>قیمت محصول (تومان)</label>
      <input
        type="number"
        id="productPrice"
        name="price"
        value={formData.price}
        onChange={handleChange}
        required
        className={styles.form_control}
      />
    </div>
    
    {/* وزن محصول */}
    <div className={styles.form_group}>
      <label htmlFor="productWeight" className={styles.form_label}>وزن محصول (کیلوگرم)</label>
      <input
        type="number"
        id="productWeight"
        name="weight"
        value={formData.weight}
        onChange={handleChange}
        required
        className={styles.form_control}
      />
    </div>

    {/* ضمانت محصول */}
    <div className={styles.form_group}>
      <label htmlFor="productWarranty" className={styles.form_label}>آیا محصول شما ضمانت دارد؟</label>
      <select
        id="productWarranty"
        name="warranty"
        value={formData.warranty}
        onChange={handleChange}
        className={styles.form_control}
      >
        <option value="False">ضمانت ندارد</option>
        <option value="True">ضمانت دارد</option>
      </select>
    </div>

    {/* اعتبار آگهی */}
    <div className={styles.form_group}>
      <label htmlFor="expireTime" className={styles.form_label}>اعتبار آگهی</label>
      <select
        id="expireTime"
        name="expire_time"
        value={formData.expire_time}
        onChange={handleChange}
        className={styles.form_control}
      >
        <option value="1">1 روز</option>
        <option value="3">3 روز</option>
        <option value="7">7 روز</option>
        <option value="15">15 روز</option>
        <option value="30">30 روز</option>
      </select>
    </div>

    {/* توضیحات محصول */}
    <div className={`${styles.form_group} ${styles.full_width}`}>
      <label htmlFor="productDescription" className={styles.form_label}>توضیحات محصول</label>
      <textarea
        id="productDescription"
        rows={3}
        name="description"
        value={formData.description}
        onChange={handleChange}
        className={styles.form_control}
      />
    </div>
  </div>
);

export default FormInputs;
