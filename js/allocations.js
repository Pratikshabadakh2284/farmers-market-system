const ALLOCATION_API = "/api/allocations";


window.initAllocations = function () {

    loadAllocationVendors();

    loadAvailableStalls();

    loadAllocations();

};


async function loadAllocationVendors() {

    try {

        const response = await fetch(
            ALLOCATION_API + "/vendors"
        );

        const vendors = await response.json();

        let html = "";


        if (!vendors || vendors.length === 0) {

            html = `
                <option value="" disabled selected>
                    No vendors found
                </option>
            `;

        } else {

            html = `
                <option value="">
                    Select Vendor
                </option>
            `;


            vendors.forEach(vendor => {

                html += `
                    <option value="${vendor.VendorID}">
                        ${vendor.VendorName}
                    </option>
                `;

            });

        }


        document.getElementById(
            "vendor"
        ).innerHTML = html;


    } catch (error) {

        console.error(
            "Vendor loading error:",
            error
        );

    }

}



async function loadAvailableStalls() {

    try {

        const response = await fetch(
            ALLOCATION_API + "/availableStalls"
        );

        const stalls = await response.json();

        let html = "";


        if (!stalls || stalls.length === 0) {

            html = `
                <option value="" disabled selected>
                    No available stalls found
                </option>
            `;

        } else {

            html = `
                <option value="">
                    Select Stall
                </option>
            `;


            stalls.forEach(stall => {

                html += `
                    <option value="${stall.StallID}">
                        ${stall.StallNumber}
                        (${stall.LocationZone})
                    </option>
                `;

            });

        }


        document.getElementById(
            "stall"
        ).innerHTML = html;


    } catch (error) {

        console.error(
            "Stall loading error:",
            error
        );

    }

}



async function loadAllocations() {

    try {

        const response = await fetch(
            ALLOCATION_API + "/getAllAllocations"
        );

        const allocations = await response.json();


        if (!response.ok) {

            throw new Error(
                allocations.message ||
                "Unable to load allocations."
            );

        }


        renderAllocations(allocations);


    } catch (error) {

        console.error(
            "Allocation loading error:",
            error
        );


        document.getElementById(
            "allocationTable"
        ).innerHTML = renderMessageRow(
            "Unable to load allocations."
        );

    }

}



function renderAllocations(allocations) {

    let rows = "";


    if (
        !allocations ||
        allocations.length === 0
    ) {

        rows = renderMessageRow(
            "No allocations found."
        );

    } else {

        allocations.forEach(allocation => {

            rows += `

                <tr>

                    <td>
                        ${allocation.AllocationID}
                    </td>

                    <td>
                        ${allocation.VendorName}
                    </td>

                    <td>
                        ${allocation.StallNumber}
                    </td>

                    <td>
                        ${allocation.LocationZone}
                    </td>

                    <td>
                        ${formatMarketDate(
                            allocation.MarketDate
                        )}
                    </td>

                    <td>

                        <button
                            type="button"
                            class="delete-btn"
                            onclick="deleteAllocation(${allocation.AllocationID})"
                        >
                            Delete
                        </button>

                    </td>

                </tr>

            `;

        });

    }


    document.getElementById(
        "allocationTable"
    ).innerHTML = rows;

}



async function addAllocation() {

    const vendorSelect =
        document.getElementById("vendor");

    const stallSelect =
        document.getElementById("stall");

    const dateInput =
        document.getElementById("allocationDate");


    const allocation = {

        VendorID: vendorSelect.value,

        StallID: stallSelect.value,

        MarketDate: dateInput.value

    };


    if (!validateAllocation(allocation)) {

        return;

    }


    try {

        const response = await fetch(
            ALLOCATION_API + "/addAllocation",
            {

                method: "POST",

                headers: {

                    "Content-Type":
                        "application/json"

                },

                body: JSON.stringify(
                    allocation
                )

            }
        );


        const result =
            await response.json();


        if (!response.ok) {

            alert(
                result.message ||
                "Unable to create allocation."
            );

            return;

        }


        alert(result.message);


        clearAllocationForm();


        await loadAllocations();

        await loadAvailableStalls();

        await loadAllocationVendors();


    } catch (error) {

        console.error(
            "Allocation error:",
            error
        );


        alert(
            "Unable to connect to the server."
        );

    }

}



function validateAllocation(allocation) {

    if (!allocation.VendorID) {

        alert(
            "Please select a vendor."
        );


        document.getElementById(
            "vendor"
        ).focus();


        return false;

    }


    if (!allocation.StallID) {

        alert(
            "Please select an available stall."
        );


        document.getElementById(
            "stall"
        ).focus();


        return false;

    }


    if (!allocation.MarketDate) {

        alert(
            "Please select a market date."
        );


        document.getElementById(
            "allocationDate"
        ).focus();


        return false;

    }


    const marketDate =
        new Date(
            allocation.MarketDate +
            "T00:00:00"
        );


    const today = new Date();


    today.setHours(
        0,
        0,
        0,
        0
    );


    if (marketDate < today) {

        alert(
            "Market date cannot be in the past."
        );


        document.getElementById(
            "allocationDate"
        ).focus();


        return false;

    }


    return true;

}



function clearAllocationForm() {

    document.getElementById(
        "vendor"
    ).value = "";


    document.getElementById(
        "stall"
    ).value = "";


    document.getElementById(
        "allocationDate"
    ).value = "";

}



async function deleteAllocation(id) {

    if (
        !confirm(
            "Delete this allocation?"
        )
    ) {

        return;

    }


    try {

        const response = await fetch(
            ALLOCATION_API +
            "/deleteAllocation/" +
            id,
            {

                method: "DELETE"

            }
        );


        const result =
            await response.json();


        if (!response.ok) {

            alert(
                result.message ||
                "Unable to delete allocation."
            );

            return;

        }


        alert(result.message);


        await loadAllocations();

        await loadAvailableStalls();

        await loadAllocationVendors();


    } catch (error) {

        console.error(error);


        alert(
            "Unable to connect to the server."
        );

    }

}



async function searchAllocation() {

    const text =
        document.getElementById(
            "search"
        ).value.trim();


    if (text === "") {

        await loadAllocations();

        return;

    }


    try {

        const response = await fetch(
            ALLOCATION_API +
            "/searchAllocation/" +
            encodeURIComponent(text)
        );


        const allocations =
            await response.json();


        if (!response.ok) {

            throw new Error(
                allocations.message ||
                "Unable to search allocations."
            );

        }


        renderAllocations(
            allocations
        );


    } catch (error) {

        console.error(
            "Allocation search error:",
            error
        );

    }

}



function formatMarketDate(value) {

    if (!value) {

        return "";

    }


    return String(value)
        .substring(0, 10);

}