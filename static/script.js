// Filter table rows based on selected event type from dropdown
$('#filterType').on('change', function () {
    let value = $(this).val().toLowerCase(); // Get selected value in lowercase
    $('#eventTable tbody tr').filter(function () {
        // Show row if "all" is selected or if the event type (2nd column) matches
        $(this).toggle(
            value === "all" || $(this).find('td:eq(1)').text().toLowerCase().includes(value)
        );
    });
});

// Export only visible table rows to a CSV file
function downloadCSV() {
    let csv = 'ID,Event Type,Temperature,Timestamp\n'; // CSV header
    $('#eventTable tbody tr:visible').each(function () {
        // Loop through each visible row
        $(this).find('td').each(function (i, td) {
            // Add cell data to CSV, comma-separated
            csv += $(td).text() + (i < 3 ? ',' : '');
        });
        csv += '\n'; // New line after each row
    });

    // Create a Blob and trigger a download
    let blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    let url = URL.createObjectURL(blob);
    let link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "smartlock_events.csv");
    link.click(); // Start download
}

// Draw the temperature line chart using Chart.js
const ctx = document.getElementById('tempChart').getContext('2d');
new Chart(ctx, {
    type: 'line',
    data: {
        labels: tempData.labels, // X-axis (timestamps)
        datasets: [{
            label: 'Temperature (°C)',
            data: tempData.temps, // Y-axis (temperature)
            borderColor: 'red',
            tension: 0.3,
            fill: false
        }]
    },
    options: {
        responsive: true,
        scales: {
            x: {
                title: { display: true, text: 'Timestamp' } // Label for X-axis
            },
            y: {
                title: { display: true, text: 'Temperature (°C)' } // Label for Y-axis
            }
        }
    }
});

// Pure JavaScript filter for dropdown (for event filtering)
document.addEventListener("DOMContentLoaded", function () {
    const filter = document.getElementById("eventFilter");
    const table = document.getElementById("eventTable");

    if (filter && table) {
        filter.addEventListener("change", () => {
            const selected = filter.value.toLowerCase(); // Selected dropdown value
            const rows = table.querySelectorAll("tbody tr");

            rows.forEach(row => {
                const eventCell = row.querySelector("td:nth-child(2)"); // Event type column
                if (!eventCell) return;

                const eventText = eventCell.textContent.trim().toLowerCase();
                const show = selected === "all" || eventText === selected;
                row.style.display = show ? "" : "none"; // Show/hide row
            });
        });
    }
});
