import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  TimeScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import {
  CandlestickController,
  CandlestickElement,
} from "chartjs-chart-financial";
import "chartjs-adapter-date-fns"; // Required for date handling
import { Chart } from "react-chartjs-2";

// Register necessary components for the chart
ChartJS.register(
  CategoryScale,
  LinearScale,
  TimeScale,
  CandlestickController,
  CandlestickElement,
  Title,
  Tooltip,
  Legend
);

const CandleStickChart = ({ chartData }) => {
  console.log(chartData);
  const sortedLabels = chartData.labels.sort();
  const uniqueLabels = [...new Set(sortedLabels)];
  console.log(uniqueLabels);
  const ohlcData = uniqueLabels.map((label, index) => {
    const dataPoints = chartData.labels
      .map((item, idx) =>
        item === label ? chartData.datasets[0].data[idx] : null
      )
      .filter((val) => val !== null);

    console.log("datapoints " + dataPoints);

    return {
      x: label,
      o: dataPoints[0],
      h: Math.max(...dataPoints),
      l: Math.min(...dataPoints),
      c: dataPoints[dataPoints.length - 1],
    };
  });

  const candlestickData = {
    labels: uniqueLabels,
    datasets: [
      {
        label: "OHLC Data",
        data: ohlcData,
        // [
        //   { x: "15:12", o: 40, h: 76, l: 40, c: 16 },
        //   { x: "15:13", o: 63, h: 97, l: 39, c: 39 },
        //   { x: "15:18", o: 81, h: 92, l: 36, c: 57 },
        //   { x: "15:20", o: 29, h: 57, l: 29, c: 57 },
        //   { x: "15:21", o: 76, h: 97, l: 6, c: 64 },
        // ]
        borderColor: "#0077e4",
        backgroundColor: "rgba(120, 119, 228, 0.5)",
        barThickness: 30,
        barPercentage: 0.7,
      },
    ],
  };

  // const candlestickData = {
  //   labels: chartData.labels.map((item) => item.toString()),
  //   datasets: [
  //     {
  //       label: "OHLC Data",
  //       data: chartData.labels.map((label, index) => ({
  //         x: label.toString(),
  //         o: chartData.datasets[0].data[index],
  //         h: Math.max(
  //           chartData.datasets[0].data[index],
  //           chartData.datasets[0].data[index] + 50
  //         ),
  //         l: Math.min(
  //           chartData.datasets[0].data[index],
  //           chartData.datasets[0].data[index] - 50
  //         ),
  //         c: chartData.datasets[0].data[index] - 20,
  //       })),
  //       borderColor: "#0077e4",
  //       backgroundColor: "rgba(120, 119, 228, 0.5)",
  //     },
  //   ],
  // };

  const candlestickOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      title: {
        display: true,
        text: "Candlestick Chart (Users Data)",
      },
      tooltip: {
        enabled: false, // Disable the default tooltip
        external: function (context) {
          // Get the tooltip element or create it if it doesn't exist
          let tooltipEl = document.getElementById("chartjs-tooltip");
          if (!tooltipEl) {
            tooltipEl = document.createElement("div");
            tooltipEl.id = "chartjs-tooltip";
            tooltipEl.style.position = "absolute";
            tooltipEl.style.pointerEvents = "none";
            tooltipEl.style.backgroundColor = "rgba(0, 119, 228, 0.9)";
            tooltipEl.style.color = "#fff";
            tooltipEl.style.borderRadius = "8px";
            tooltipEl.style.padding = "10px";
            tooltipEl.style.fontSize = "14px";
            tooltipEl.style.textAlign = "left"; // Better alignment for multiple lines
            tooltipEl.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
            document.body.appendChild(tooltipEl);
          }

          // Hide if no tooltip is active
          const tooltipModel = context.tooltip;
          if (tooltipModel.opacity === 0) {
            tooltipEl.style.opacity = 0;
            return;
          }

          // Set tooltip content
          if (tooltipModel.body) {
            const dataPoint = tooltipModel.dataPoints[0].raw; // Raw data (OHLC data)
            const { o, h, l, c, x } = dataPoint; // Extract OHLC and label values

            tooltipEl.innerHTML = `
      <div style="font-size: 16px; font-weight: bold;">Closing: ${c}</div>
      <div style="font-size: 14px;">
        Open: ${o} <br/>
        High: ${h} <br/>
        Low: ${l} <br/>
        Date: ${x}
      </div>
    `;
          }

          // Adjust tooltip dimensions dynamically
          tooltipEl.style.width = "auto"; // Automatically adjust width based on content
          tooltipEl.style.height = "auto"; // Automatically adjust height based on content

          // Position the tooltip
          const { offsetLeft, offsetTop } = context.chart.canvas;
          tooltipEl.style.left = offsetLeft + tooltipModel.caretX + "px";
          tooltipEl.style.top = offsetTop + tooltipModel.caretY + "px";
          tooltipEl.style.opacity = 1;
        },
      },
    },
    scales: {
      x: {
        type: "category",
        title: {
          display: true,
          text: "Year",
        },
        ticks: {
          color: "white",
        },
      },
      y: {
        title: {
          display: true,
          text: "Temperature",
        },
        ticks: {
          color: "white",
          padding: 20,
        },
        position: "right",
        min: 0,
        max: 100,
      },
    },
  };

  return (
    <Chart
      type="candlestick"
      data={candlestickData}
      options={candlestickOptions}
    />
  );
};

export default CandleStickChart;
