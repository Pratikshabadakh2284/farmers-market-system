async function downloadCSV(apiUrl, filename) {
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (!Array.isArray(data) || data.length === 0) {
        alert("No records found.");
        return;
    }

    const headers = Object.keys(data[0]);

    const rows = data.map(row =>
        headers.map(header => `"${row[header] ?? ""}"`).join(",")
    );

    const csv = [headers.join(","), ...rows].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
}

function exportVendors() {
    downloadCSV("/api/vendors/getAllVendors", "vendors_report.csv");
}

function exportStalls() {
    downloadCSV("/api/stalls/getAllStalls", "stalls_report.csv");
}

function exportAllocations() {
    downloadCSV("/api/allocations/getAllAllocations", "allocations_report.csv");
}