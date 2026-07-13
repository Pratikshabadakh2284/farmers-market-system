const api = "/api/stalls";

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

    if (data?.length === 0) {
        html = renderMessageRow("No stalls found.");
    } else {
        data?.forEach(stall => {
            html += `
            <tr>
                <td>${stall.StallID}</td>
                <td>${stall.StallNumber}</td>
                <td>${stall.LocationZone}</td>
                <td>₹ ${stall.RentalFee}</td>
                <td>${stall.Status}</td>
               <td class="action-cell">
    <div class="action-buttons">
        <button
            type="button"
            class="edit-btn"
            onclick="editStall(${stall.StallID})">
            Edit
        </button>

        <button
            type="button"
            class="delete-btn"
            onclick="deleteStall(${stall.StallID})">
            Delete
        </button>
    </div>
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

    if (!validateStall(stall)) return;

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
    document.getElementById("saveStallBtn").style.display = "none";
    document.getElementById("updateStallBtn").style.display = "inline-block";
    document.getElementById("cancelStallBtn").style.display = "inline-block";

    document.getElementById("stallForm").scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

    document.getElementById("StallNumber").focus();
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
    document.getElementById("LocationZone").value = "";
    document.getElementById("RentalFee").value = "";
    document.getElementById("Status").value = "Available";

    document.getElementById("saveStallBtn").style.display = "inline-block";

    document.getElementById("updateStallBtn").style.display = "none";

    document.getElementById("cancelStallBtn").style.display = "none";

    document.getElementById("StallNumber").focus();
}

function validateStall(stall) {
    const stallNumberRegex = /^[A-Za-z0-9-]{2,10}$/;
    const rentalFee = Number(stall.RentalFee);

    if (!stall.StallNumber) {
        alert("Stall number is required.");
        return false;
    }

    if (!stallNumberRegex.test(stall.StallNumber)) {
        alert("Stall number must be 2–10 characters and contain only letters, numbers, or hyphens.");
        return false;
    }

    if (!stall.LocationZone) {
        alert("Please select a location zone.");
        return false;
    }

    if (isNaN(rentalFee) || rentalFee < 100 || rentalFee > 10000) {
        alert("Rental fee must be between ₹100 and ₹10,000.");
        document.getElementById("RentalFee").focus();
        return false;
    }

    if (!["Available", "Occupied"].includes(stall.Status)) {
        alert("Please select a valid stall status.");
        return false;
    }

    return true;
}