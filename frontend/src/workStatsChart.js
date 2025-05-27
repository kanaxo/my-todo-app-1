// const workStats = {
//   '12/05/2025': { workSessionsCompleted: 1, totalWorkDuration: 1 },
//   '13/05/2025': { workSessionsCompleted: 2, totalWorkDuration: 5 },
//   '14/05/2025': { workSessionsCompleted: 3, totalWorkDuration: 8 }
// };

const ctx = document.getElementById('workChart').getContext('2d');
const chartDiv = document.getElementById('chartDiv');
const chartModalBody = document.getElementById('chartModalBody');
const noWorkStatsMessage = document.getElementById('noWorkStatsMessage');
$('#chartModal').on('shown.bs.modal', function () {
  // Clear any previous chart
  noWorkStatsMessage.style.display = 'none';
  chartDiv.style.display = 'none';
  // Clear the chart canvas
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  const workStats = getWorkStatsFromLocalStorage();
  if (workStats !== null) {
    chartDiv.style.display = 'block';
    createChart(workStats);
  } else {
    console.error('No work stats found in localStorage.');
    noWorkStatsMessage.style.display = 'block';
  }
});

const getWorkStatsFromLocalStorage = () => {
  const workStats = JSON.parse(localStorage.getItem('workStats'));
  return workStats;
};

const createChart = (workStats) => {
  const dates = Object.keys(workStats);
  const durations = Object.values(workStats).map(
    (stats) => Math.round((stats.totalWorkDuration / 60) * 100) / 100
  );
  console.log(durations);
  // Set up the chart data
  const chartData = {
    labels: dates, // X-axis labels (dates)
    datasets: [
      {
        label: 'Total Work Duration (in minutes)',
        data: durations, // Y-axis data (total work duration)
        backgroundColor: 'rgba(75, 192, 192, 0.2)', // Color of the bars
        borderColor: 'rgba(75, 192, 192, 1)', // Border color of the bars
        borderWidth: 1 // Border width
      }
    ]
  };

  // Create the chart
  const workChart = new Chart(ctx, {
    type: 'bar', // Type of chart (bar chart)
    data: chartData,
    options: {
      scales: {
        y: {
          beginAtZero: true, // Ensures the Y-axis starts from 0
          title: {
            display: true,
            text: 'Total Work Duration (seconds)'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Date'
          }
        }
      }
    }
  });
};
