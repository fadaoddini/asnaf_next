import React from "react";
import Select from "react-select";
import styles from "./ProductTypeSelector.module.css"; // استفاده از استایل‌های CSS

const ProductTypeSelector = ({ formData, productTypes, handleProductTypeChange }) => (
  <div className={styles.form_group}>
    <label htmlFor="productType" className={styles.label}>
      نوع محصول
    </label>
    <Select
      id="productType" // اضافه کردن id برای دسترسی بهتر
      value={formData.productType || null}
      onChange={handleProductTypeChange}
      options={productTypes}
      isClearable
      className={styles.form_control}
      placeholder="انتخاب کنید..." // ویژگی placeholder
      styles={{
        control: (base) => ({
          ...base,
          border: '1px solid #ccc',
          boxShadow: 'none',
          '&:hover': {
            borderColor: '#007bff',
          },
        }),
        placeholder: (base) => ({
          ...base,
          color: '#888',
        }),
      }}
    />
  </div>
);

export default ProductTypeSelector;
