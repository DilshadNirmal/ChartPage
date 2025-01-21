import { useEffect, useRef } from "react";
import { Line } from "react-chartjs-2";
import Chart from "chart.js/auto";

const AreaChart = ({ chartData, options }) => {
  console.log(chartData);
  const chartRef = useRef(null);

  const preprocessChartData = (chartData) => {
    const uniqueLabels = [];
    const uniqueData = [];

    chartData.labels.forEach((label, idx) => {
      if (!uniqueLabels.includes(label)) {
        uniqueLabels.push(label);
        uniqueData.push(chartData.datasets[0].data[idx]);
      }
    });

    return {
      labels: uniqueLabels,
      datasets: [
        {
          ...chartData.datasets[0],
          data: uniqueData,
        },
      ],
    };
  };

  const processedData = preprocessChartData(chartData);

  useEffect(() => {
    const chart = chartRef.current;

    // Apply gradient for fill
    if (chart) {
      const ctx = chart.ctx;
      const gradient = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
      gradient.addColorStop(0, "rgba(15, 39, 60, 1)");
      gradient.addColorStop(1, "rgba(15, 39, 60, 0.2)");

      // Set the gradient as the background color for the first dataset
      chartData.backgroundColor = gradient;
      chart.update();
    }
  }, [processedData]);

  const interactionOptions = {
    mode: "index",
    intersect: false,
    axis: "x",
  };

  const tooltipPlugin = {
    id: "hoverline",
    beforeDraw: (chart) => {
      if (chart.tooltip._active && chart.tooltip._active.length) {
        const ctx = chart.ctx;
        const tooltip = chart.tooltip._active[0];
        const x = tooltip.element.x;

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(x, chart.scales.y.top);
        ctx.lineTo(x, chart.scales.y.bottom);
        ctx.lineWidth = 2;
        ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
        ctx.stroke();
        ctx.restore();
      }
    },
  };

  Chart.register(tooltipPlugin);

  // Plugin for horizontal dashed line
  const dangerLinePlugin = {
    id: "dangerLine",
    afterDraw: (chart) => {
      const ctx = chart.ctx;
      const yAxis = chart.scales.y;
      const xAxis = chart.scales.x;

      // Get the y-coordinate for value 800
      const yValue = yAxis.getPixelForValue(800);

      ctx.save();
      ctx.strokeStyle = "red";
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(xAxis.left, yValue);
      ctx.lineTo(xAxis.right, yValue);
      ctx.stroke();
      ctx.restore();
    },
  };

  Chart.register(dangerLinePlugin);

  return (
    <Line
      ref={chartRef}
      data={processedData}
      options={{
        ...options,
        plugins: {
          ...options.plugins,
        },
        scales: {
          x: {
            grid: {
              // color: "rgba(15, 39, 60, 1)",
              //borderDash: [5, 5], // Dashed x-axis
            },
            ticks: {
              color: "white",
              padding: 20,
            },
          },
          y: {
            grid: {
              // color: "rgba(15, 39, 60, 0.2)",
            },
            ticks: {
              color: "white",
              padding: 30,
            },
            position: "right",
          },
        },
      }}
    />
  );
};

export default AreaChart;
