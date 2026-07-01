const API = "http://localhost:3000/api/vendors";

window.onload = function () {
    loadVendors();
};

// =========================
// LOAD ALL VENDORS
// =========================

async function loadVendors() {

    try {

        const response = await fetch(API + "/getAllVendors");   

        const vendors = await response.json();

        const table = document.getElementById("vendorTable");

        if (vendors.length === 0) {

            table.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align:center; color:red; font-weight:bold;">
                        No records found.
                    </td>
                </tr>
            `;

            return;
        }

        let rows = "";

        vendors.forEach(vendor => {

            rows += `
                <tr>
                    <td>${vendor.VendorID}</td>
                    <td>${vendor.VendorName}</td>
                    <td>${vendor.Phone}</td>
                    <td>${vendor.Email}</td>
                    <td>${vendor.ProductCategory}</td>
                    <td>
                        <button onclick="editVendor(${vendor.VendorID})">Edit</button>
                        <button onclick="deleteVendor(${vendor.VendorID})">Delete</button>
                    </td>
                </tr>
            `;

        });

        table.innerHTML = rows;

    }

    catch (err) {

        console.log(err);

    }

}



// =========================
// ADD VENDOR
// =========================

async function addVendor() {

    const vendor = {

        VendorName: document.getElementById("vendorName").value,

        Phone: document.getElementById("phone").value,

        Email: document.getElementById("email").value,

        ProductCategory: document.getElementById("category").value

    };


    if (

        vendor.VendorName == "" ||

        vendor.Phone == "" ||

        vendor.Email == "" ||

        vendor.ProductCategory == ""

    ) {

        alert("Please fill all fields.");

        return;

    }

    await fetch(API + "/addVendor", {

        method: "POST",

        headers: {

            "Content-Type": "application/json"

        },

        body: JSON.stringify(vendor)

    });

    clearForm();

    loadVendors();

}



// =========================
// LOAD ONE VENDOR
// =========================

async function editVendor(id) {

    const response = await fetch(API + "/getVendor/" + id);

    const vendor = await response.json();

    document.getElementById("vendorId").value = vendor.VendorID;

    document.getElementById("vendorName").value = vendor.VendorName;

    document.getElementById("phone").value = vendor.Phone;

    document.getElementById("email").value = vendor.Email;

    document.getElementById("category").value = vendor.ProductCategory;

}



// =========================
// UPDATE VENDOR
// =========================

async function updateVendor() {

    const id = document.getElementById("vendorId").value;

    if (id == "") {

        alert("Select a vendor first.");

        return;

    }

    const vendor = {

        VendorName: document.getElementById("vendorName").value,

        Phone: document.getElementById("phone").value,

        Email: document.getElementById("email").value,

        ProductCategory: document.getElementById("category").value

    };

    await fetch(API + "/updateVendor/" + id, {

        method: "PUT",

        headers: {

            "Content-Type": "application/json"

        },

        body: JSON.stringify(vendor)

    });

    clearForm();

    loadVendors();

}



// =========================
// DELETE VENDOR
// =========================

async function deleteVendor(id) {

    const answer = confirm("Delete this vendor?");

    if (!answer) return;

    await fetch(API + "/deleteVendor/" + id, {

        method: "DELETE"

    });

    loadVendors();

}



// =========================
// SEARCH
// =========================

async function searchVendor() {

    const search = document.getElementById("search").value;

    if (search == "") {

        loadVendors();

        return;

    }

    const response = await fetch(API + "/searchVendor/" + search);

    const vendors = await response.json();

    let rows = "";

    vendors.forEach(vendor => {

        rows += `

        <tr>

            <td>${vendor.VendorID}</td>

            <td>${vendor.VendorName}</td>

            <td>${vendor.Phone}</td>

            <td>${vendor.Email}</td>

            <td>${vendor.ProductCategory}</td>

            <td>

                <button onclick="editVendor(${vendor.VendorID})">

                    Edit

                </button>

                <button onclick="deleteVendor(${vendor.VendorID})">

                    Delete

                </button>

            </td>

        </tr>

        `;

    });

    document.getElementById("vendorTable").innerHTML = rows;

}



// =========================
// CLEAR FORM
// =========================

function clearForm() {

    document.getElementById("vendorId").value = "";

    document.getElementById("vendorName").value = "";

    document.getElementById("phone").value = "";

    document.getElementById("email").value = "";

    document.getElementById("category").value = "";

}