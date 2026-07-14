const STALL_API =
    "/api/stalls";


window.initStalls =
    function () {

        loadStalls();


        const stallForm =
            document.getElementById(
                "stallForm"
            );


        stallForm.onsubmit =
            function (e) {

                e.preventDefault();


                const id =
                    document.getElementById(
                        "StallID"
                    ).value;


                if (id) {

                    updateStall();

                } else {

                    addStall();

                }

            };

    };



async function loadStalls() {

    const response =
        await fetch(
            STALL_API +
            "/getAllStalls"
        );


    const stalls =
        await response.json();


    renderStalls(stalls);

}



function renderStalls(stalls) {

    let rows = "";


    if (
        !stalls ||
        stalls.length === 0
    ) {

        rows =
            renderMessageRow(
                "No stalls found."
            );

    } else {

        stalls.forEach(stall => {

            rows += `

                <tr>

                    <td>
                        ${stall.StallID}
                    </td>

                    <td>
                        ${stall.StallNumber}
                    </td>

                    <td>
                        ${stall.LocationZone}
                    </td>

                    <td>
                        ₹ ${stall.RentalFee}
                    </td>

                    <td>

                        <span
                            class="${
                                stall.Status ===
                                "Available"
                                    ? "available"
                                    : "occupied"
                            }"
                        >

                            ${stall.Status}

                        </span>

                    </td>

                    <td>

                        <button
                            type="button"
                            class="edit-btn"
                            onclick="editStall(${stall.StallID})"
                        >

                            Edit

                        </button>


                        <button
                            type="button"
                            class="delete-btn"
                            onclick="deleteStall(${stall.StallID})"
                        >

                            Delete

                        </button>

                    </td>

                </tr>

            `;

        });

    }


    document.getElementById(
        "stallTable"
    ).innerHTML = rows;

}



function getStallData() {

    return {

        StallNumber:
            document.getElementById(
                "StallNumber"
            ).value.trim(),

        LocationZone:
            document.getElementById(
                "LocationZone"
            ).value,

        RentalFee:
            document.getElementById(
                "RentalFee"
            ).value,

        Status:
            document.getElementById(
                "Status"
            ).value

    };

}



async function addStall() {

    const stall =
        getStallData();


    if (
        !validateStall(stall)
    ) {

        return;

    }


    const response =
        await fetch(
            STALL_API +
            "/addStall",
            {

                method: "POST",

                headers: {

                    "Content-Type":
                        "application/json"

                },

                body:
                    JSON.stringify(stall)

            }
        );


    const result =
        await response.json();


    alert(result.message);


    if (!response.ok) {

        return;

    }


    clearStallForm();


    await loadStalls();

}



async function editStall(id) {

    const response =
        await fetch(
            STALL_API +
            "/getStall/" +
            id
        );


    const stall =
        await response.json();


    document.getElementById(
        "StallID"
    ).value =
        stall.StallID;


    document.getElementById(
        "StallNumber"
    ).value =
        stall.StallNumber;


    document.getElementById(
        "LocationZone"
    ).value =
        stall.LocationZone;


    document.getElementById(
        "RentalFee"
    ).value =
        stall.RentalFee;


    document.getElementById(
        "Status"
    ).value =
        stall.Status;


    document.getElementById(
        "saveBtn"
    ).style.display =
        "none";


    document.getElementById(
        "updateBtn"
    ).style.display =
        "inline-block";


    const cancelButton =
        document.getElementById(
            "cancelStallBtn"
        );


    if (cancelButton) {

        cancelButton.style.display =
            "inline-block";

    }


    document.getElementById(
        "stallForm"
    ).scrollIntoView({

        behavior: "smooth",

        block: "start"

    });


    document.getElementById(
        "StallNumber"
    ).focus();

}



async function updateStall() {

    const id =
        document.getElementById(
            "StallID"
        ).value;


    const stall =
        getStallData();


    if (
        !validateStall(stall)
    ) {

        return;

    }


    const response =
        await fetch(
            STALL_API +
            "/updateStall/" +
            id,
            {

                method: "PUT",

                headers: {

                    "Content-Type":
                        "application/json"

                },

                body:
                    JSON.stringify(stall)

            }
        );


    const result =
        await response.json();


    alert(result.message);


    if (!response.ok) {

        return;

    }


    clearStallForm();


    await loadStalls();

}



async function deleteStall(id) {

    if (
        !confirm(
            "Delete this stall?"
        )
    ) {

        return;

    }


    const response =
        await fetch(
            STALL_API +
            "/deleteStall/" +
            id,
            {

                method: "DELETE"

            }
        );


    const result =
        await response.json();


    alert(result.message);


    if (!response.ok) {

        return;

    }


    await loadStalls();

}



async function searchStall() {

    const text =
        document.getElementById(
            "search"
        ).value.trim();


    if (text === "") {

        await loadStalls();

        return;

    }


    const response =
        await fetch(
            STALL_API +
            "/searchStall/" +
            encodeURIComponent(text)
        );


    const stalls =
        await response.json();


    renderStalls(stalls);

}



function clearStallForm() {

    document.getElementById(
        "StallID"
    ).value = "";


    document.getElementById(
        "StallNumber"
    ).value = "";


    document.getElementById(
        "LocationZone"
    ).value =
        "North";


    document.getElementById(
        "RentalFee"
    ).value = "";


    document.getElementById(
        "Status"
    ).value =
        "Available";


    document.getElementById(
        "saveBtn"
    ).style.display =
        "inline-block";


    document.getElementById(
        "updateBtn"
    ).style.display =
        "none";


    const cancelButton =
        document.getElementById(
            "cancelStallBtn"
        );


    if (cancelButton) {

        cancelButton.style.display =
            "none";

    }

}



function validateStall(stall) {

    const rentalFee =
        Number(stall.RentalFee);


    const stallNumberRegex =
        /^[A-Za-z0-9-]+$/;


    if (!stall.StallNumber.trim()) {

        alert(
            "Stall number is required."
        );

        document
            .getElementById("StallNumber")
            .focus();

        return false;

    }


    if (
        !stallNumberRegex.test(
            stall.StallNumber
        )
    ) {

        alert(
            "Stall number can contain only letters, numbers and hyphens."
        );

        document
            .getElementById("StallNumber")
            .focus();

        return false;

    }


    if (
        stall.RentalFee === "" ||
        !Number.isFinite(rentalFee)
    ) {

        alert(
            "Please enter a valid rental fee."
        );

        document
            .getElementById("RentalFee")
            .focus();

        return false;

    }


    if (rentalFee < 100) {

        alert(
            "Rental fee must be at least ₹100."
        );

        document
            .getElementById("RentalFee")
            .focus();

        return false;

    }


    if (rentalFee > 100000) {

        alert(
            "Rental fee cannot exceed ₹100000."
        );

        document
            .getElementById("RentalFee")
            .focus();

        return false;

    }


    const validZones = [
        "North",
        "South",
        "East",
        "West"
    ];


    if (
        !validZones.includes(
            stall.LocationZone
        )
    ) {

        alert(
            "Please select a valid location zone."
        );

        return false;

    }


    const validStatuses = [
        "Available",
        "Occupied"
    ];


    if (
        !validStatuses.includes(
            stall.Status
        )
    ) {

        alert(
            "Please select a valid stall status."
        );

        return false;

    }


    return true;

}