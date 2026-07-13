const API = "/api/allocations";

/* ===========================
   PAGE LOAD
=========================== */

window.onload = () => {
    const today = new Date().toISOString().split("T")[0];

    document
        .getElementById("allocationDate")
        .setAttribute("min", today);

    loadVendors();
    loadAvailableStalls();
    loadAllocations();
};


/* ===========================
   LOAD VENDORS
=========================== */
async function loadVendors() {

    const response = await fetch(API + "/vendors");

    const vendors = await response.json();

    let html = "";

    if (vendors.length === 0) {

        html = `
            <option value="" disabled selected>
                No vendors found
            </option>
        `;

    } else {

        html = '<option value="">Select Vendor</option>';

        vendors.forEach(v => {

            html += `
                <option value="${v.VendorID}">
                    ${v.VendorName}
                </option>
            `;

        });

    }

    document.getElementById("vendor").innerHTML = html;

}


/* ===========================
   LOAD AVAILABLE STALLS
=========================== */

async function loadAvailableStalls() {

    const response = await fetch(API + "/availableStalls");

    const stalls = await response.json();

    let html = '<option value="">Select Stall</option>';

    if (stalls?.length === 0) {

        html = `
            <option value="" disabled selected>
                No available stalls found
            </option>
        `;

    } else {

        stalls?.forEach(s => {

            html += `
                <option value="${s.StallID}">
                    ${s.StallNumber} (${s.LocationZone})
                </option>
            `;

        });

    }

    document.getElementById("stall").innerHTML = html;
}


/* ===========================
   LOAD ALLOCATIONS
=========================== */

async function loadAllocations() {

    const response = await fetch(API + "/getAllAllocations");

    const data = await response.json();

    let html = "";

   if (data?.length === 0) {
    rows = renderMessageRow("No vendors found.");
   }

    else {

        data.forEach(a => {

            html += `

            <tr>

                <td>${a.AllocationID}</td>

                <td>${a.VendorName}</td>

                <td>${a.StallNumber}</td>

                <td>${a.LocationZone}</td>

                <td>${a.MarketDate.substring(0, 10)}</td>

                <td>

                    <button onclick="deleteAllocation(${a.AllocationID})">

                        Delete

                    </button>

                </td>

            </tr>

            `;

        });

    }

    document.getElementById("allocationTable").innerHTML = html;

}


/* ===========================
   ADD ALLOCATION
=========================== */

async function addAllocation() {
    const allocation = {
        VendorID: document.getElementById("vendor").value,
        StallID: document.getElementById("stall").value,
        MarketDate: document.getElementById("allocationDate").value
    };

    if (!validateAllocation(allocation)) {
        return;
    }

    try {
        const response = await fetch(API + "/addAllocation", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(allocation)
        });

        const result = await response.json();

        if (!response.ok) {
            alert(result.message || "Unable to create allocation.");
            return;
        }

        alert(result.message);

        clearAllocationForm();

        await loadAllocations();
        await loadAvailableStalls();

    } catch (error) {
        console.error(error);
        alert("Unable to connect to the server.");
    }
}

/* ===========================
   DELETE ALLOCATION
=========================== */

async function deleteAllocation(id) {

    if (!confirm("Delete this allocation?"))

        return;

    const response = await fetch(API + "/deleteAllocation/" + id, {

        method: "DELETE"

    });

    const result = await response.json();

    alert(result.message);

    loadAllocations();

    loadAvailableStalls();

}


/* ===========================
   SEARCH
=========================== */

async function searchAllocation() {

    const text = document.getElementById("search").value;

    if (text === "") {

        loadAllocations();

        return;

    }

    const response = await fetch(API + "/searchAllocation/" + text);

    const data = await response.json();

    let html = "";

    if (data?.length === 0) {
        rows = renderMessageRow("No vendors found.");
    }

    else {

        data.forEach(a => {

            html += `

            <tr>

                <td>${a.AllocationID}</td>

                <td>${a.VendorName}</td>

                <td>${a.StallNumber}</td>

                <td>${a.LocationZone}</td>

                <td>${a.MarketDate.substring(0, 10)}</td>

                <td>

                    <button onclick="deleteAllocation(${a.AllocationID})">

                        Delete

                    </button>

                </td>

            </tr>

            `;

        });

    }

    document.getElementById("allocationTable").innerHTML = html;

}

function validateAllocation(allocation) {
    if (!allocation.VendorID) {
        alert("Please select a vendor.");
        document.getElementById("vendor").focus();
        return false;
    }

    if (!allocation.StallID) {
        alert("Please select an available stall.");
        document.getElementById("stall").focus();
        return false;
    }

    if (!allocation.MarketDate) {
        alert("Please select a market date.");
        document.getElementById("allocationDate").focus();
        return false;
    }

    const selectedDate = new Date(
        allocation.MarketDate + "T00:00:00"
    );

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
        alert("Market date cannot be in the past.");
        document.getElementById("allocationDate").focus();
        return false;
    }

    return true;
}

function clearAllocationForm() {
    document.getElementById("vendor").value = "";
    document.getElementById("stall").value = "";
    document.getElementById("allocationDate").value = "";
}