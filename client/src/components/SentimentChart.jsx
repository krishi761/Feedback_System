import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const SentimentChart = ({ sentimentData }) => {
  const labels = sentimentData?.labels || [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
  ];
  const data = {
    labels,
    datasets: [
      {
        label: "Positive",
        data: sentimentData?.positive || [],
        borderColor: "#2ECC71",
        backgroundColor: "rgba(46, 204, 113, 0.1)",
        fill: true,
        tension: 0.4,
      },
      {
        label: "Neutral",
        data: sentimentData?.neutral || [],
        borderColor: "#9B9B9B",
        backgroundColor: "rgba(155, 155, 155, 0.1)",
        fill: true,
        tension: 0.4,
      },
      {
        label: "Negative",
        data: sentimentData?.negative || [],
        borderColor: "#E74C3C",
        backgroundColor: "rgba(231, 76, 60, 0.1)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: { beginAtZero: true, grid: { display: false } },
      x: { grid: { display: false } },
    },
  };

  return <Line data={data} options={options} />;
};

export default SentimentChart;
