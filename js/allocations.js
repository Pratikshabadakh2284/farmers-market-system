async function loadDashboard() {

    const response = await fetch("http://localhost:3000/api/dashboard");

    const data = await response.json();

    document.getElementById("vendors").innerText = data.vendors;

    document.getElementById("stalls").innerText = data.stalls;

    document.getElementById("available").innerText = data.available;

    document.getElementById("occupied").innerText = data.occupied;

    document.getElementById("allocations").innerText = data.allocations;

}

loadDashboard();