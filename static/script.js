// Filter table rows
$('#filterType').on('change', function () {
    let value = $(this).val().toLowerCase();
    $('#eventTable tbody tr').filter(function () {
        $(this).toggle(
            value === "all" || $(this).find('td:eq(1)').text().toLowerCase().includes(value)
        );
    });
});

// Export visible rows to CSV
function downloadCSV() {
    let csv = 'ID,Event Type,Temperature,Timestamp\n';
    $('#eventTable tbody tr:visible').each(function () {
        $(this).find('td').each(function (i, td) {
            csv += $(td).text() + (i < 3 ? ',' : '');
        });
        csv += '\n';
    });
    let blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    let url = URL.createObjectURL(blob);
    let link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "smartlock_events.csv");
    link.click();
}

// Chart
const ctx = document.getElementById('tempChart').getContext('2d');
new Chart(ctx, {
    type: 'line',
    data: {
        labels: tempData.labels,
        datasets: [{
            label: 'Temperature (°C)',
            data: tempData.temps,
            borderColor: 'red',
            tension: 0.3,
            fill: false
        }]
    },
    options: {
        responsive: true,
        scales: {
            x: {
                title: { display: true, text: 'Timestamp' }
            },
            y: {
                title: { display: true, text: 'Temperature (°C)' }
            }
        }
    }
});
document.addEventListener("DOMContentLoaded", function () {
    const filter = document.getElementById("eventFilter");
    const table = document.getElementById("eventTable");
  
    if (filter && table) {
      filter.addEventListener("change", () => {
        const selected = filter.value.toLowerCase();
        const rows = table.querySelectorAll("tbody tr");
  
        rows.forEach(row => {
          const eventCell = row.querySelector("td:nth-child(2)");
          if (!eventCell) return;
  
          const eventText = eventCell.textContent.trim().toLowerCase();
          const show = selected === "all" || eventText === selected;
          row.style.display = show ? "" : "none";
        });
      });
    }
  });
  

