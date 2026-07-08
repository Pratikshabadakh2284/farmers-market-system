
async function loadDashboard() {

    try {

        if (!localStorage.getItem("role")) {

    window.location.href = "/";

}
        const response = await fetch("http://localhost:3000/api/dashboard");

        const data = await response.json();

        console.log(data);

        document.getElementById("vendors").innerHTML = data.vendors;

        document.getElementById("stalls").innerHTML = data.stalls;

        document.getElementById("available").innerHTML = data.available;

        document.getElementById("occupied").innerHTML = data.occupied;

        document.getElementById("allocations").innerHTML = data.allocations;

    }

    catch (err) {

        console.error(err);

    }

}

loadDashboard();