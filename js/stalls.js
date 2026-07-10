const api = "http://localhost:3000/api/stalls";

window.onload = function () {
    loadStalls();

    document.getElementById("stallForm").onsubmit = function (e) {
        e.preventDefault();

        const id = document.getElementById("StallID").value;

        if (id) {
            updateStall();
        } else {
            addStall();
        }
    };
};

async function loadStalls() {
    const response = await fetch(api + "/getAllStalls");
    const data = await response.json();
    renderStalls(data);
}

function renderStalls(data) {
    let html = "";

    if (data.length === 0) {
        html = `<tr><td colspan="6">No Stall Found</td></tr>`;
    } else {
        data.forEach(stall => {
            html += `
            <tr>
                <td>${stall.StallID}</td>
                <td>${stall.StallNumber}</td>
                <td>${stall.LocationZone}</td>
                <td>₹ ${stall.RentalFee}</td>
                <td>${stall.Status}</td>
                <td>
                    <button type="button" onclick="editStall(${stall.StallID})">Edit</button>
                    <button type="button" onclick="deleteStall(${stall.StallID})">Delete</button>
                </td>
            </tr>`;
        });
    }

    document.getElementById("stallTable").innerHTML = html;
}

async function addStall() {
    const stall = {
        StallNumber: document.getElementById("StallNumber").value.trim(),
        LocationZone: document.getElementById("LocationZone").value,
        RentalFee: document.getElementById("RentalFee").value,
        Status: document.getElementById("Status").value
    };

    const response = await fetch(api + "/addStall", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(stall)
    });

    const result = await response.json();
    alert(result.message);

    clearStallForm();
    loadStalls();
}

async function editStall(id) {
    const response = await fetch(api + "/getStall/" + id);
    const stall = await response.json();

    document.getElementById("StallID").value = stall.StallID;
    document.getElementById("StallNumber").value = stall.StallNumber;
    document.getElementById("LocationZone").value = stall.LocationZone;
    document.getElementById("RentalFee").value = stall.RentalFee;
    document.getElementById("Status").value = stall.Status;
}

async function updateStall() {
    const id = document.getElementById("StallID").value;

    const stall = {
        StallNumber: document.getElementById("StallNumber").value.trim(),
        LocationZone: document.getElementById("LocationZone").value,
        RentalFee: document.getElementById("RentalFee").value,
        Status: document.getElementById("Status").value
    };

    const response = await fetch(api + "/updateStall/" + id, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(stall)
    });

    const result = await response.json();
    alert(result.message);

    clearStallForm();
    loadStalls();
}

async function deleteStall(id) {
    if (!confirm("Delete this stall?")) return;

    const response = await fetch(api + "/deleteStall/" + id, {
        method: "DELETE"
    });

    const result = await response.json();
    alert(result.message);

    loadStalls();
}

async function searchStall() {
    const text = document.getElementById("search").value.trim();

    if (text === "") {
        loadStalls();
        return;
    }

    const response = await fetch(api + "/searchStall/" + text);
    const data = await response.json();

    renderStalls(data);
}

function clearStallForm() {
    document.getElementById("StallID").value = "";
    document.getElementById("StallNumber").value = "";
    document.getElementById("LocationZone").value = "North";
    document.getElementById("RentalFee").value = "";
    document.getElementById("Status").value = "Available";
}