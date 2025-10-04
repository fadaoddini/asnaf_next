import React from "react";
import Select from "react-select";
import styles from "./AttributesSelector.module.css"; // استفاده از استایل‌های CSS

const AttributesSelector = ({
  attributes,
  attributeOptions,
  formData,
  handleAttributeValueChange,
  handleAttributeSelect
}) => (
  <div className={styles.attributes_container}>
    {attributes.map((attr) => (
      <div key={attr.value} className={styles.form_group}>
        <label htmlFor={`attribute_${attr.value}`} className={styles.label}>
          {attr.label}
        </label>
        <Select
          id={`attribute_${attr.value}`} // اضافه کردن id به Select برای دسترسی بهتر
          value={formData.attributeValues[attr.value] || null}
          onChange={(selectedOption) =>
            handleAttributeValueChange(attr.value, selectedOption)
          }
          options={attributeOptions[attr.value] || []}
          isClearable
          onFocus={() => handleAttributeSelect(attr)}
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
    ))}
  </div>
);

export default AttributesSelector;
