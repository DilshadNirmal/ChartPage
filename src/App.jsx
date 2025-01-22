import { useState } from "react";
import { Data } from "./utils/Data";
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";

import { AiOutlineAreaChart } from "react-icons/ai";
import { MdOutlineCandlestickChart } from "react-icons/md";
import { FaCamera } from "react-icons/fa6";
import AreaChart from "./components/AreaChart";
import CandleStickChart from "./components/CandleStickChart";
import { useEffect } from "react";
import axios from "axios";
Chart.register(CategoryScale);

function App() {
  const [isSelected, setIsSelected] = useState(true); // For chart type toggle
  const [timeRange, setTimeRange] = useState("3 Months"); // For selected time range

  // Filter data dynamically based on the selected range
  const filterData = () => {
    if (!chartData) return { labels: [], datasets: [] };

    const now = new Date();
    const filteredData = chartData.filter((data) => {
      const timeDiff = now - data.time;
      switch (timeRange) {
        case "1 Day":
          return timeDiff <= 24 * 60 * 60 * 1000;
        case "3 Days":
          return timeDiff <= 3 * 24 * 60 * 60 * 1000;
        case "1 Week":
          return timeDiff <= 7 * 24 * 60 * 60 * 1000;
        case "1 Month":
          return timeDiff <= 4 * 7 * 24 * 60 * 60 * 1000;
        case "3 Months":
          return timeDiff <= 3 * 4 * 7 * 24 * 60 * 60 * 1000;
        default:
          return true;
      }
    });

    const labels = filteredData.map((data) => {
      switch (timeRange) {
        case "3 Days":
          return `${data.time.toLocaleDateString()} ${data.time.toLocaleTimeString(
            [],
            { hour: "2-digit", minute: "2-digit", hour12: false }
          )}`;
        case "1 Week":
          return data.time.toLocaleDateString();
        case "1 Month":
          return data.time.toLocaleDateString();
        case "3 Months":
          return data.time.toLocaleDateString();
        default:
          return data.time.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          });
      }
    });

    const temperatures = filteredData.map((data) => data.temperature);

    return {
      labels,
      datasets: [
        {
          label: "Temperature (°C)",
          data: temperatures,
          // backgroundColor: "rgba(0, 119, 228, 0.8)",
          // borderColor: "#0077e4",
          borderWidth: 4,
          tension: 0.3,
          fill: true,
        },
      ],
    };
  };

  const [chartData, setChartData] = useState();
  //   {
  //   labels: filteredData.map((data) => data.year),
  //   datasets: [
  //     {
  //       label: "Users Gained",
  //       data: filteredData.map((data) => data.userGain),
  //       backgroundColor: "rgba(0, 119, 228, 0.8)",
  //       borderColor: "#0077e4",
  //       borderWidth: 4,
  //       tension: 0.3,
  //       fill: true,
  //     },
  //   ],
  // }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Chart Area",
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
            tooltipEl.style.width = "130px"; // Fixed width
            tooltipEl.style.height = "65px"; // Fixed height
            tooltipEl.style.padding = "10px";
            tooltipEl.style.fontSize = "14px";
            tooltipEl.style.textAlign = "center";
            tooltipEl.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
            document.body.appendChild(tooltipEl);
          }

          // Hide if no tooltip is active
          const tooltipModel = context.tooltip;
          console.log(tooltipModel);
          if (tooltipModel.opacity === 0) {
            tooltipEl.style.opacity = 0;
            return;
          }

          // Set tooltip content
          if (tooltipModel.body) {
            const title = tooltipModel.dataPoints[0].raw;
            const bodyLines = tooltipModel.title || [];

            let innerHtml = `<div style="font-size: 18px; font-weight: bold;">${title}</div>`;
            bodyLines.forEach((body) => {
              innerHtml += `<div style="font-size: 12px; margin-top: 5px;">${body}</div>`;
            });

            tooltipEl.innerHTML = innerHtml;
          }

          // Position the tooltip
          const { offsetLeft, offsetTop } = context.chart.canvas;
          tooltipEl.style.left = offsetLeft + tooltipModel.caretX + "px";
          tooltipEl.style.top = offsetTop + tooltipModel.caretY + "px";
          tooltipEl.style.opacity = 1;
        },
      },
    },
  };

  const getData = async () => {
    const response = await axios.get(
      "http://localhost:4030/api/all-sensor-values/"
    );

    const formattedData = response.data.collection1.map((data) => ({
      temperature: parseFloat(data.value),
      time: new Date(data.createdAt),
    }));

    // console.log(formattedData);

    setChartData(formattedData);
  };

  useEffect(() => {
    // setChartData({
    //   labels: filteredData.map((data) => data.year),
    //   datasets: [
    //     {
    //       label: "Users Gained",
    //       data: filteredData.map((data) => data.userGain),
    //       backgroundColor: "rgba(0, 119, 228, 0.8)",
    //       borderColor: "#0077e4",
    //       borderWidth: 4,
    //       tension: 0.3,
    //       fill: true,
    //     },
    //   ],
    // });

    getData();
  }, []);

  const chartDataFiltered = filterData();

  return (
    <>
      <div className="flex items-center justify-between px-10 mx-5 my-5">
        <div className="flex items-center justify-around gap-10 w-8/12">
          <h2 className="text-4xl font-medium mr-8">CBTA1</h2>
          <p className="text-xl">
            Max Value<span className="text-accent font-medium ml-5">930 C</span>
          </p>
          <p className="text-xl">
            Min Value<span className="text-accent font-medium ml-5">618 C</span>
          </p>
          <p className="text-xl">
            Avg Value<span className="text-accent font-medium ml-5">820 C</span>
          </p>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 border p-1 border-accent rounded-md">
            <button
              onClick={() => setIsSelected(true)}
              className={`${isSelected ? "bg-accent" : ""}  p-2 rounded`}
            >
              <AiOutlineAreaChart className="text-2xl" />
            </button>
            <button
              onClick={() => setIsSelected(false)}
              className={`${isSelected ? "" : "bg-accent"} p-2 rounded`}
            >
              <MdOutlineCandlestickChart className="text-2xl" />
            </button>
          </div>
          <button className="border border-accent p-2 rounded-md">
            <FaCamera className="text-xl" />
          </button>
          <button className="p-2 px-3 text-lg font-medium bg-accent rounded-md">
            Export
          </button>
        </div>
      </div>

      {/* chart here */}
      <div className="w-11/12 h-[450px] px-6 py-3 mx-auto">
        {isSelected ? (
          <AreaChart
            key="area"
            chartData={chartDataFiltered}
            options={options}
          />
        ) : (
          <CandleStickChart
            key="candlestick"
            chartData={chartDataFiltered}
            options={options}
          />
        )}
      </div>

      {/* button to visualize days-wise */}
      <div className="w-3/4 mx-auto flex items-center justify-between mt-6">
        {["1 Day", "3 Days", "1 Week", "1 Month", "3 Months"].map(
          (range, index) => (
            <button
              key={index}
              onClick={() => setTimeRange(range)}
              className={`border border-accent p-4 rounded-md text-2xl capitalize ${
                timeRange === range ? "bg-accent" : ""
              }`}
            >
              {range}
            </button>
          )
        )}
      </div>
    </>
  );
}

export default App;
