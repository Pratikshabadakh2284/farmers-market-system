const API = "http://localhost:3000/api/allocations";

/* ===========================
   PAGE LOAD
=========================== */

window.onload = () => {

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

    let html = '<option value="">Select Vendor</option>';

    vendors.forEach(v => {

        html += `
            <option value="${v.VendorID}">
                ${v.VendorName}
            </option>
        `;

    });

    document.getElementById("vendor").innerHTML = html;

}


/* ===========================
   LOAD AVAILABLE STALLS
=========================== */

async function loadAvailableStalls() {

    const response = await fetch(API + "/availableStalls");

    const stalls = await response.json();

    let html = '<option value="">Select Stall</option>';

    stalls.forEach(s => {

        html += `
            <option value="${s.StallID}">
                ${s.StallNumber} (${s.LocationZone})
            </option>
        `;

    });

    document.getElementById("stall").innerHTML = html;

}


/* ===========================
   LOAD ALLOCATIONS
=========================== */

async function loadAllocations() {

    const response = await fetch(API + "/getAllAllocations");

    const data = await response.json();

    let html = "";

    if (data.length === 0) {

        html = `
            <tr>

                <td colspan="6">

                    No Allocations Found

                </td>

            </tr>
        `;

    }

    else {

        data.forEach(a => {

            html += `

            <tr>

                <td>${a.AllocationID}</td>

                <td>${a.VendorName}</td>

                <td>${a.StallNumber}</td>

                <td>${a.LocationZone}</td>

                <td>${a.MarketDate.substring(0,10)}</td>

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

        MarketDate: document.getElementById("marketDate").value

    };

    const response = await fetch(API + "/addAllocation", {

        method: "POST",

        headers: {

            "Content-Type": "application/json"

        },

        body: JSON.stringify(allocation)

    });

    const result = await response.json();

    alert(result.message);

    loadAllocations();

    loadAvailableStalls();

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

    if (data.length === 0) {

        html = `

            <tr>

                <td colspan="6">

                    No Records Found

                </td>

            </tr>

        `;

    }

    else {

        data.forEach(a => {

            html += `

            <tr>

                <td>${a.AllocationID}</td>

                <td>${a.VendorName}</td>

                <td>${a.StallNumber}</td>

                <td>${a.LocationZone}</td>

                <td>${a.MarketDate.substring(0,10)}</td>

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