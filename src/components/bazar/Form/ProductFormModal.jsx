import React, { useState, useEffect } from "react";
import axios from "axios";
import Config from "config/config";
import ProductTypeSelector from "./ProductTypeSelector";
import AttributesSelector from "./AttributeSelector";
import ImageUploader from "./ImageUploader";
import FormInputs from "./FormInputs";
import styles from "./FormStyle.module.css";

const ProductFormModal = ({
  show,
  handleClose,
  sellBuyType,
  onProductAdded,
}) => {
  const typeValue =
    sellBuyType === "sell" ? "1" : sellBuyType === "buy" ? "2" : null;
  const [formData, setFormData] = useState({
    price: "",
    weight: "",
    warranty: "False",
    expire_time: "1",
    description: "",
    productType: null,
    attributeValues: {},
    images: [],
    sellBuy: typeValue,
  });

  const [productTypes, setProductTypes] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [attributeOptions, setAttributeOptions] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imagePreviews, setImagePreviews] = useState([]);

  // گرفتن انواع محصول از سرور
  useEffect(() => {
    const fetchProductTypes = async () => {
      try {
        const response = await axios.get(
          Config.getApiUrl("catalogue", "product_types/")
        );
        const typeOptions = response.data.map((type) => ({
          value: type.id,
          label: type.title,
        }));
        setProductTypes(typeOptions);
      } catch (err) {
        console.error("Error fetching product types:", err);
        setError("خطا در بارگذاری انواع محصولات. لطفاً دوباره تلاش کنید.");
      }
    };

    fetchProductTypes();
  }, []);

  // گرفتن ویژگی‌های محصول بر اساس نوع محصول
  useEffect(() => {
    const fetchAttributes = async () => {
      if (formData.productType) {
        try {
          const response = await axios.get(
            Config.getApiUrl("catalogue", "product_attributes/"),
            {
              params: { product_type_id: formData.productType.value },
            }
          );

          const attributeOptions = response.data.map((attr) => ({
            value: attr.id,
            label: attr.title,
          }));
          setAttributes(attributeOptions);
          setFormData((prevState) => ({
            ...prevState,
            attributeValues: {},
          }));
          setAttributeOptions({});
        } catch (err) {
          console.error("Error fetching attributes:", err);
          setError("خطا در بارگذاری ویژگی‌ها. لطفاً دوباره تلاش کنید.");
        }
      } else {
        setAttributes([]);
        setFormData((prevState) => ({
          ...prevState,
          attributeValues: {},
        }));
        setAttributeOptions({});
      }
    };

    fetchAttributes();
  }, [formData.productType]);

  const fetchAttributeValues = async (attributeId) => {
    try {
      const response = await axios.get(
        Config.getApiUrl("catalogue", "attribute_values/"),
        {
          params: { attribute_id: attributeId },
        }
      );

      const values = response.data.map((value) => ({
        value: value.id,
        label: value.value,
      }));
      setAttributeOptions((prevOptions) => ({
        ...prevOptions,
        [attributeId]: values,
      }));
    } catch (err) {
      console.error("Error fetching attribute values:", err);
      setError("خطا در بارگذاری مقادیر ویژگی‌ها. لطفاً دوباره تلاش کنید.");
    }
  };

  const handleProductTypeChange = (selectedOption) => {
    setFormData((prevState) => ({
      ...prevState,
      productType: selectedOption,
    }));
  };

  const handleAttributeValueChange = (attributeId, selectedOption) => {
    setFormData((prevState) => ({
      ...prevState,
      attributeValues: {
        ...prevState.attributeValues,
        [attributeId]: selectedOption || null,
      },
    }));
  };

  const handleAttributeSelect = (attribute) => {
    if (!formData.attributeValues[attribute.value]) {
      fetchAttributeValues(attribute.value);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = new FormData();
    form.append("price", formData.price);
    form.append("weight", formData.weight);
    form.append("warranty", formData.warranty);
    form.append("expire_time", formData.expire_time);
    form.append("description", formData.description);
    form.append(
      "product_type",
      formData.productType ? formData.productType.value : ""
    );
    form.append("sell_buy", typeValue);

    const attrs = Object.keys(formData.attributeValues).map((attributeId) => ({
      attr: attributeId,
      value: formData.attributeValues[attributeId].value,
    }));
    form.append("attrs", JSON.stringify(attrs));

    formData.images.forEach((image, index) => {
      form.append(`image${index}`, image);
    });

    form.append("numpic", formData.images.length);

    try {
      const response = await axios.post(
        Config.getApiUrl("catalogue", "add_product_api/"),
        form, // داده‌های ارسال شده
        {
          withCredentials: true, // ارسال کوکی‌ها
        }
      );

      console.log("محصول با موفقیت اضافه شد:", response.data);
      onProductAdded(response.data);
      handleClose();
    } catch (err) {
      console.error(
        "خطا در افزودن محصول:",
        err.response ? err.response.data : err.message
      );
      setError("خطا در افزودن محصول. لطفاً دوباره تلاش کنید.");
    } finally {
      setLoading(false);
    }
  };

  return (
    show && (
      <div className={styles.modalOverlay}>
        <div className={styles.modalContent}>
          <header className={styles.header}>
            <h2 className={styles.titr}>
              {typeValue==="1"?"افزودن محصول":"ثبت درخواست"}
            </h2>
            <button className={styles.closeButton} onClick={handleClose}>
              ×
            </button>
          </header>
          <form onSubmit={handleSubmit}>
            <div className={styles.box_attr}>
              {/* انتخاب نوع محصول */}
              <ProductTypeSelector
                formData={formData}
                productTypes={productTypes}
                handleProductTypeChange={handleProductTypeChange}
              />
              {/* نمایش ویژگی‌ها بر اساس نوع محصول انتخاب‌شده */}
              {formData.productType && (
                <AttributesSelector
                  attributes={attributes}
                  attributeOptions={attributeOptions}
                  formData={formData}
                  handleAttributeValueChange={handleAttributeValueChange}
                  handleAttributeSelect={handleAttributeSelect}
                />
              )}
            </div>
            <div className={styles.all_row}>
              <div className={styles.right_row}>
               
                <FormInputs formData={formData} handleChange={handleChange} />
              </div>
              <div className={styles.left_row}>
                
                <ImageUploader
                  formData={formData}
                  setFormData={setFormData}
                  imagePreviews={imagePreviews}
                  setImagePreviews={setImagePreviews}
                />
              </div>
            </div>

            {error && <p className={styles.textDanger}>{error}</p>}
            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? "در حال ارسال..." : "ثبت محصول"}
            </button>
          </form>
        </div>
      </div>
    )
  );
};

export default ProductFormModal;
