import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import styles from "./ImageUploader.module.css";

const ImageUploader = ({
  formData,
  setFormData,
  imagePreviews,
  setImagePreviews,
}) => {
  const onDrop = useCallback(
    (acceptedFiles) => {
      const newImages = acceptedFiles.filter(
        (file) => !formData.images.some((img) => img.name === file.name)
      );

      if (newImages.length > 0) {
        const newImagePreviews = newImages.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        );
        setFormData((prevState) => ({
          ...prevState,
          images: [...prevState.images, ...newImages],
        }));
        setImagePreviews((prevPreviews) => [
          ...prevPreviews,
          ...newImagePreviews,
        ]);
      }
    },
    [formData, setFormData, setImagePreviews]
  );

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    onDrop,
  });

  const handleRemoveImage = (index, event) => {
    // جلوگیری از پخش شدن رویداد کلیک
    event.stopPropagation();

    // حذف Object URL
    URL.revokeObjectURL(imagePreviews[index].preview);

    const newImages = formData.images.filter((_, i) => i !== index);
    const newImagePreviews = imagePreviews.filter((_, i) => i !== index);

    setFormData((prevState) => ({
      ...prevState,
      images: newImages,
    }));
    setImagePreviews(newImagePreviews);
  };

  return (
    <div className={styles.form_group}>
      <label htmlFor="imageUploader" className={styles.label}>
        تصاویر محصول
      </label>
      <div {...getRootProps({ className: styles.dropzone })}>
        <input {...getInputProps()} id="imageUploader" />
        <div className={styles.add_image_icon}>+</div>
        <div className={styles.image_preview_list}>
          {imagePreviews.map((file, index) => (
            <div key={index} className={styles.image_list_item}>
              <img
                src={file.preview}
                alt={`Preview ${index}`}
                className={styles.image_preview}
              />
              <button
                type="button"
                className={styles.remove_button}
                onClick={(e) => handleRemoveImage(index, e)} // جلوگیری از باز شدن کادر آپلود هنگام کلیک بر روی دکمه حذف
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImageUploader;
