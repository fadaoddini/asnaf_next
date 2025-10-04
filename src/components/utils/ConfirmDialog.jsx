import React from "react";
import styles from "./ConfirmDialog.module.css";

const ConfirmDialog = ({
  message,
  onConfirm,
  onCancel,
  confirmText = "تأیید",
  cancelText = "لغو",
  isOpen,
}) => {
  if (!isOpen) return null; // نمایش ندادن دیالوگ در صورت باز نبودن

  return (
    <div className={styles.overlay}>
      <div className={styles.dialog}>
        <p className={styles.message}>{message}</p>
        <div className={styles.buttonContainer}>
         
          <button className={styles.cancelButton} onClick={onCancel}>
            {cancelText}
          </button>
          <button className={styles.confirmButton} onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
