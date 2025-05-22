import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Box, useTheme } from '@mui/material';

// Register ChartJS components
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

const PerformanceChart = ({ data }) => {
  const theme = useTheme();
  
  if (!data || !data.labels || !data.datasets || data.datasets.length === 0) {
    return (
      <Box 
        sx={{ 
          height: '100%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          color: 'text.secondary'
        }}
      >
        No data available
      </Box>
    );
  }
  
  // Ensure datasets have data arrays
  const validData = {
    labels: data.labels,
    datasets: data.datasets.map(dataset => ({
      ...dataset,
      data: dataset.data || []
    }))
  };
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          boxWidth: 6,
          font: {
            family: theme.typography.fontFamily,
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: theme.palette.text.primary,
        bodyColor: theme.palette.text.secondary,
        borderColor: theme.palette.divider,
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        usePointStyle: true,
        titleFont: {
          family: theme.typography.fontFamily,
          size: 14,
          weight: 'bold'
        },
        bodyFont: {
          family: theme.typography.fontFamily,
          size: 12
        },
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              if (context.dataset.label === 'Average SGPA') {
                label += context.parsed.y.toFixed(2);
              } else {
                label += context.parsed.y + '%';
              }
            }
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        min: validData.datasets[0].data.length > 0 ? 
          Math.min(...validData.datasets[0].data) > 2 ? 
            Math.min(...validData.datasets[0].data) - 2 : 0 
          : 0,
        max: 10,
        grid: {
          color: theme.palette.divider,
          drawBorder: false
        },
        ticks: {
          font: {
            family: theme.typography.fontFamily,
            size: 11
          }
        }
      },
      y1: {
        position: 'right',
        beginAtZero: false,
        min: 50,
        max: 100,
        grid: {
          display: false
        },
        ticks: {
          font: {
            family: theme.typography.fontFamily,
            size: 11
          },
          callback: function(value) {
            return value + '%';
          }
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            family: theme.typography.fontFamily,
            size: 11
          }
        }
      }
    },
    elements: {
      line: {
        tension: 0.4
      },
      point: {
        radius: 4,
        hoverRadius: 6
      }
    }
  };

  // Modify the data to use the right y-axis for pass percentage
  const chartData = {
    labels: validData.labels,
    datasets: [
      {
        ...validData.datasets[0],
        borderWidth: 2,
        pointBackgroundColor: theme.palette.background.paper
      },
      validData.datasets.length > 1 ? {
        ...validData.datasets[1],
        borderWidth: 2,
        pointBackgroundColor: theme.palette.background.paper,
        yAxisID: 'y1'
      } : null
    ].filter(Boolean) // Remove null entries
  };

  return (
    <Box sx={{ height: '100%', width: '100%', position: 'relative' }}>
      <Line data={chartData} options={options} />
    </Box>
  );
};

export default PerformanceChart;