/*
// For testing purposes
const workStats = {
  '12/05/2025': { workSessionsCompleted: 1, totalWorkDuration: 1 },
  '13/05/2025': { workSessionsCompleted: 2, totalWorkDuration: 5 },
  '14/05/2025': { workSessionsCompleted: 3, totalWorkDuration: 8 }
};
*/

const chartDiv = document.getElementById('chartDiv');
const chartModalBody = document.getElementById('chartModalBody');
const noWorkStatsMessage = document.getElementById('noWorkStatsMessage');

$('#chartModal').on('shown.bs.modal', function () {
  const workStats = getWorkStatsFromLocalStorage();
  if (workStats !== null) {
    // Create a new canvas element for the chart
    noWorkStatsMessage.style.display = 'none';
    $('div#chartDiv').append('<canvas id="workChart"></canvas>');
    let ctx = document.getElementById('workChart').getContext('2d');
    createChart(workStats, ctx);
  } else {
    console.log('No work stats found in localStorage.');
    noWorkStatsMessage.style.display = 'block';
  }
});

$('#chartModal').on('hidden.bs.modal', function () {
  $('canvas#workChart').remove(); // Remove the chart canvas
  noWorkStatsMessage.style.display = 'none';
  // ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
});

const getWorkStatsFromLocalStorage = () => {
  const workStats = JSON.parse(localStorage.getItem('workStats'));
  return workStats;
};

const createChart = (workStats, ctx) => {
  const dates = Object.keys(workStats).slice(-5); // Get the last 5 dates
  const durations = Object.values(workStats)
    .map((stats) => Math.round((stats.totalWorkDuration / 60) * 100) / 100)
    .slice(-5); // Get the last 5 total work durations in minutes

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
