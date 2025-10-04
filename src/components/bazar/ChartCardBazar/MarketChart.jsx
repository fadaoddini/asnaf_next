// MarketChart.js
import React, { useState, useMemo } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import moment from "moment-jalaali";
import styles from "./MarketChart.module.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// تابع برای فرمت‌دهی عددی
const formatNumber = (number, unit) => {
  if (number === null || number === undefined) return "داده موجود نیست";
  return new Intl.NumberFormat("fa-IR").format(number) + (unit ? ` ${unit}` : "");
};

const MarketChart = ({ data }) => {
  const [timeRange, setTimeRange] = useState("7");

  const getFilteredData = (range) => {
    const now = moment();
    return data.filter((item) => {
      const date = moment(item.date, "YYYY-MM-DD");
      return now.diff(date, "days") <= range;
    });
  };

  const filteredData = useMemo(
    () => getFilteredData(timeRange === "7" ? 7 : 30),
    [timeRange, data]
  );

  const dates = filteredData.map((item) =>
    moment(item.date).format("jYYYY/jMM/jDD")
  );

  const maxSellPrices = filteredData.map((item) => item.maxPriceSell ?? null);
  const minSellPrices = filteredData.map((item) => item.minPriceSell ?? null);
  const maxBuyPrices = filteredData.map((item) => item.maxPriceBuy ?? null);
  const minBuyPrices = filteredData.map((item) => item.minPriceBuy ?? null);
  const volumes = filteredData.map((item) => item.volume ?? null);

  const chartColors = {
    redColor: "#ec7063",
    redColorDark: "#8B3A3A",
    greenColor: "#738A4A",
    greenColorDark: "#556B2F",
    blueColor: "#D0A791",
  };

  const dataChart = {
    labels: dates,
    datasets: [
      {
        label: "بالاترین قیمت فروش",
        data: maxSellPrices,
        borderColor: chartColors.redColor,
        backgroundColor: "rgba(255, 0, 0, 0.2)",
        fill: true,
      },
      {
        label: "پایین‌ترین قیمت فروش",
        data: minSellPrices,
        borderColor: chartColors.redColorDark,
        backgroundColor: "rgba(255, 0, 0, 0.2)",
        fill: true,
      },
      {
        label: "بالاترین قیمت خرید",
        data: maxBuyPrices,
        borderColor: chartColors.greenColor,
        backgroundColor: "rgba(0, 255, 0, 0.2)",
        fill: true,
      },
      {
        label: "پایین‌ترین قیمت خرید",
        data: minBuyPrices,
        backgroundColor: chartColors.greenColorDark,
        borderColor: chartColors.greenColorDark,
        borderWidth: 2,
        pointRadius: 4,
        pointStyle: "rect",
        showLine: true,
        type: "scatter",
      },
      {
        type: "bar",
        label: "حجم بازار",
        data: volumes,
        backgroundColor: chartColors.blueColor,
        borderColor: chartColors.blueColor,
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: {
            family: "IranSans", // فونت legend
            size: 12,
            weight: "bold",
          },
          color: "#333",
        },
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            const unit = tooltipItem.dataset.label === "حجم بازار" ? "کیلوگرم" : "تومان";
            const value = formatNumber(tooltipItem.raw, unit); // استفاده از تابع فرمت‌دهی با واحد مناسب
            return `${tooltipItem.dataset.label}: ${value}`;
          },
        },
        bodyFont: {
          family: "IranSans", // فونت body tooltip
          size: 12,
        },
        titleFont: {
          family: "IranSans", // فونت title tooltip
          size: 14,
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "تاریخ",
          font: {
            family: "IranSans", // فونت عنوان محور X
            size: 14,
          },
        },
        ticks: {
          font: {
            family: "IranSans", // فونت اعداد محور X
            size: 12,
          },
        },
      },
      y: {
        title: {
          display: true,
          text: "قیمت / حجم",
          font: {
            family: "IranSans", // فونت عنوان محور Y
            size: 14,
          },
        },
        ticks: {
          font: {
            family: "IranSans", // فونت اعداد محور Y
            size: 12,
          },
        },
      },
    },
    spanGaps: true,
  };

  return (
    <div className={styles.chartContainer}>
      <div className={styles.buttonContainer}>
        <button onClick={() => setTimeRange("7")} className={timeRange === "7" ? styles.active : ""}>
          7 روز گذشته
        </button>
        <button onClick={() => setTimeRange("30")} className={timeRange === "30" ? styles.active : ""}>
          30 روز گذشته
        </button>
      </div>
      <Line data={dataChart} options={options} />
    </div>
  );
};

export default MarketChart;
