const VENDOR_API =
    "/api/vendors";



window.initVendors = function () {

    loadVendors();


    const vendorForm =
        document.getElementById(
            "vendorForm"
        );


    if (!vendorForm) {

        return;

    }


    vendorForm.onsubmit =
        function (e) {

            e.preventDefault();


            const id =
                document.getElementById(
                    "VendorID"
                ).value;


            if (id) {

                updateVendor();

            } else {

                addVendor();

            }

        };

};



async function loadVendors() {

    try {

        const response =
            await fetch(
                VENDOR_API +
                "/getAllVendors"
            );


        const vendors =
            await response.json();


        if (!response.ok) {

            throw new Error(
                vendors.message ||
                "Unable to load vendors."
            );

        }


        renderVendors(vendors);


    } catch (error) {

        console.error(
            "Vendor loading error:",
            error
        );


        document.getElementById(
            "vendorTable"
        ).innerHTML =
            renderMessageRow(
                "Unable to load vendors."
            );

    }

}



function renderVendors(vendors) {

    let rows = "";


    if (
        !vendors ||
        vendors.length === 0
    ) {

        rows =
            renderMessageRow(
                "No vendors found."
            );

    } else {

        vendors.forEach(vendor => {

            rows += `

                <tr>

                    <td>
                        ${vendor.VendorID}
                    </td>

                    <td>
                        ${vendor.VendorName}
                    </td>

                    <td>
                        ${vendor.Phone}
                    </td>

                    <td>
                        ${vendor.Email}
                    </td>

                    <td>
                        ${vendor.ProductCategory}
                    </td>

                    <td>

                        <button
                            type="button"
                            class="edit-btn"
                            onclick="editVendor(${vendor.VendorID})"
                        >

                            Edit

                        </button>


                        <button
                            type="button"
                            class="delete-btn"
                            onclick="deleteVendor(${vendor.VendorID})"
                        >

                            Delete

                        </button>

                    </td>

                </tr>

            `;

        });

    }


    document.getElementById(
        "vendorTable"
    ).innerHTML = rows;

}



async function addVendor() {

    const vendor = {

        VendorName:
            document.getElementById(
                "VendorName"
            ).value.trim(),

        Phone:
            document.getElementById(
                "PhoneNumber"
            ).value.trim(),

        Email:
            document.getElementById(
                "Email"
            ).value.trim(),

        ProductCategory:
            document.getElementById(
                "ProductType"
            ).value.trim()

    };


    if (
        !validateVendor(vendor)
    ) {

        return;

    }


    try {

        const response =
            await fetch(
                VENDOR_API +
                "/addVendor",
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify(
                            vendor
                        )

                }
            );


        const result =
            await response.json();


        if (!response.ok) {

            alert(
                result.message ||
                "Unable to add vendor."
            );

            return;

        }


        alert(result.message);


        clearForm();


        await loadVendors();


    } catch (error) {

        console.error(error);


        alert(
            "Unable to connect to the server."
        );

    }

}



async function editVendor(id) {

    const response =
        await fetch(
            VENDOR_API +
            "/getVendor/" +
            id
        );


    const vendor =
        await response.json();


    document.getElementById(
        "VendorID"
    ).value =
        vendor.VendorID;


    document.getElementById(
        "VendorName"
    ).value =
        vendor.VendorName;


    document.getElementById(
        "PhoneNumber"
    ).value =
        vendor.Phone;


    document.getElementById(
        "Email"
    ).value =
        vendor.Email;


    document.getElementById(
        "ProductType"
    ).value =
        vendor.ProductCategory;


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
            "cancelVendorBtn"
        );


    if (cancelButton) {

        cancelButton.style.display =
            "inline-block";

    }


    document.getElementById(
        "vendorForm"
    ).scrollIntoView({

        behavior: "smooth",

        block: "start"

    });


    document.getElementById(
        "VendorName"
    ).focus();

}



async function updateVendor() {

    const id =
        document.getElementById(
            "VendorID"
        ).value;


    if (!id) {

        alert(
            "Please select a vendor to update."
        );

        return;

    }


    const vendor = {

        VendorName:
            document.getElementById(
                "VendorName"
            ).value.trim(),

        Phone:
            document.getElementById(
                "PhoneNumber"
            ).value.trim(),

        Email:
            document.getElementById(
                "Email"
            ).value.trim(),

        ProductCategory:
            document.getElementById(
                "ProductType"
            ).value.trim()

    };


    if (
        !validateVendor(vendor)
    ) {

        return;

    }


    const response =
        await fetch(
            VENDOR_API +
            "/updateVendor/" +
            id,
            {

                method: "PUT",

                headers: {

                    "Content-Type":
                        "application/json"

                },

                body:
                    JSON.stringify(
                        vendor
                    )

            }
        );


    const result =
        await response.json();


    if (!response.ok) {

        alert(
            result.message ||
            "Unable to update vendor."
        );

        return;

    }


    alert(result.message);


    clearForm();


    await loadVendors();

}



async function deleteVendor(id) {

    if (
        !confirm(
            "Are you sure you want to delete this vendor?"
        )
    ) {

        return;

    }


    const response =
        await fetch(
            VENDOR_API +
            "/deleteVendor/" +
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
            "Unable to delete vendor."
        );

        return;

    }


    alert(result.message);


    await loadVendors();

}



async function searchVendor() {

    const search =
        document.getElementById(
            "search"
        ).value.trim();


    if (search === "") {

        await loadVendors();

        return;

    }


    const response =
        await fetch(
            VENDOR_API +
            "/searchVendor/" +
            encodeURIComponent(search)
        );


    const vendors =
        await response.json();


    renderVendors(vendors);

}



function clearForm() {

    document.getElementById(
        "VendorID"
    ).value = "";


    document.getElementById(
        "VendorName"
    ).value = "";


    document.getElementById(
        "PhoneNumber"
    ).value = "";


    document.getElementById(
        "Email"
    ).value = "";


    document.getElementById(
        "ProductType"
    ).value = "";


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
            "cancelVendorBtn"
        );


    if (cancelButton) {

        cancelButton.style.display =
            "none";

    }

}



function validateVendor(vendor) {

    const phoneRegex = /^[0-9]{10}$/;

    const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    if (!vendor.VendorName.trim()) {

        alert("Vendor name is required.");

        document
            .getElementById("VendorName")
            .focus();

        return false;

    }


    if (vendor.VendorName.length < 3) {

        alert(
            "Vendor name must contain at least 3 characters."
        );

        document
            .getElementById("VendorName")
            .focus();

        return false;

    }


    if (!phoneRegex.test(vendor.Phone)) {

        alert(
            "Phone number must contain exactly 10 digits."
        );

        document
            .getElementById("PhoneNumber")
            .focus();

        return false;

    }


    if (!emailRegex.test(vendor.Email)) {

        alert(
            "Please enter a valid email address."
        );

        document
            .getElementById("Email")
            .focus();

        return false;

    }


    if (!vendor.ProductCategory.trim()) {

        alert(
            "Product category is required."
        );

        document
            .getElementById("ProductType")
            .focus();

        return false;

    }


    return true;

}