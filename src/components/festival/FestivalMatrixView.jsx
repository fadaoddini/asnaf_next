// components/festival/FestivalMatrixView.jsx
import React, { useState } from 'react';
import styles from './festivalMatrix.module.css';

const FestivalMatrixView = ({ matrix, width, height, onRoomSelect }) => {
  const [selectedRoom, setSelectedRoom] = useState(null);

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
      return `موقعیت: (${colIndex}, ${rowIndex})\nوضعیت: خالی`;
    }
    
    const statusText = {
      0: 'آزاد - قابل رزرو',
      1: 'رزرو شده',
      2: 'قطعی شده',
      3: 'غیرقابل فروش'
    }[cell.status];
    
    return `غرفه: ${cell.name}\nموقعیت: (${colIndex}, ${rowIndex})\nوضعیت: ${statusText}\nقیمت: ${cell.price ? `${cell.price} تومان` : 'تعیین نشده'}`;
  };

  const handleCellClick = (cell, rowIndex, colIndex) => {
    if (!cell || cell.empty) {
      alert('این موقعیت خالی است و غرفه‌ای وجود ندارد.');
      return;
    }

    if (cell.status === 0) { // فقط غرفه‌های آزاد قابل رزرو هستند
      setSelectedRoom(cell);
      if (onRoomSelect) {
        onRoomSelect(cell);
      }
    } else if (cell.status === 1) {
      alert('این غرفه قبلاً رزرو شده است.');
    } else if (cell.status === 2) {
      alert('این غرفه به صورت قطعی فروخته شده است.');
    } else if (cell.status === 3) {
      alert('این غرفه غیرقابل فروش می‌باشد.');
    }
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
              style={{
                cursor: cell && !cell.empty && cell.status === 0 ? 'pointer' : 'not-allowed'
              }}
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
          <span>آزاد - قابل رزرو</span>
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
        <div className={styles.legendItem}>
          <div className={`${styles.legendColor} ${styles.cellEmpty}`}></div>
          <span>راهرو</span>
        </div>
      </div>

      {selectedRoom && (
        <div className={styles.selectedRoomInfo}>
          <h4>غرفه انتخاب شده:</h4>
          <p><strong>نام:</strong> {selectedRoom.name}</p>
          <p><strong>موقعیت:</strong> ({selectedRoom.w_i}, {selectedRoom.h_i})</p>
          <p><strong>متراژ:</strong> {selectedRoom.metraj || 'تعیین نشده'}</p>
          <p><strong>قیمت:</strong> {selectedRoom.price ? `${selectedRoom.price} تومان` : 'تعیین نشده'}</p>
          <p><strong>توضیحات:</strong> {selectedRoom.description || 'ندارد'}</p>
        </div>
      )}
    </div>
  );
};

export default FestivalMatrixView;