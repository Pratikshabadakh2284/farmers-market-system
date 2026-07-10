const API = "http://localhost:3000/api/vendors";

window.onload = function () {
    loadVendors();

    document.getElementById("vendorForm").onsubmit = function (e) {
        e.preventDefault();

        const id = document.getElementById("VendorID").value;

        if (id) {
            updateVendor();
        } else {
            addVendor();
        }
    };
};

async function loadVendors() {
    const response = await fetch(API + "/getAllVendors");
    const vendors = await response.json();
    renderVendors(vendors);
}

function renderVendors(vendors) {
    let rows = "";

    if (vendors.length === 0) {
        rows = `
            <tr>
                <td colspan="6" style="text-align:center;color:red;font-weight:bold;">
                    No records found.
                </td>
            </tr>`;
    } else {
        vendors.forEach(vendor => {
            rows += `
                <tr>
                    <td>${vendor.VendorID}</td>
                    <td>${vendor.VendorName}</td>
                    <td>${vendor.Phone}</td>
                    <td>${vendor.Email}</td>
                    <td>${vendor.ProductCategory}</td>
                    <td>
                        <button type="button" onclick="editVendor(${vendor.VendorID})">Edit</button>
                        <button type="button" onclick="deleteVendor(${vendor.VendorID})">Delete</button>
                    </td>
                </tr>`;
        });
    }

    document.getElementById("vendorTable").innerHTML = rows;
}

async function addVendor() {
    const vendor = {
        VendorName: document.getElementById("VendorName").value.trim(),
        Phone: document.getElementById("PhoneNumber").value.trim(),
        Email: document.getElementById("Email").value.trim(),
        ProductCategory: document.getElementById("ProductType").value.trim()
    };

    if (!vendor.VendorName || !vendor.Phone || !vendor.Email || !vendor.ProductCategory) {
        alert("Please fill all fields.");
        return;
    }

    const response = await fetch(API + "/addVendor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(vendor)
    });

    const result = await response.json();
    alert(result.message);

    clearForm();
    loadVendors();
}

async function editVendor(id) {
    const response = await fetch(API + "/getVendor/" + id);
    const vendor = await response.json();

    document.getElementById("VendorID").value = vendor.VendorID;
    document.getElementById("VendorName").value = vendor.VendorName;
    document.getElementById("PhoneNumber").value = vendor.Phone;
    document.getElementById("Email").value = vendor.Email;
    document.getElementById("ProductType").value = vendor.ProductCategory;
    document.getElementById("saveBtn").style.display = "none";
    document.getElementById("updateBtn").style.display = "inline-block";
}

async function updateVendor() {
    const id = document.getElementById("VendorID").value;

    const vendor = {
        VendorName: document.getElementById("VendorName").value.trim(),
        Phone: document.getElementById("PhoneNumber").value.trim(),
        Email: document.getElementById("Email").value.trim(),
        ProductCategory: document.getElementById("ProductType").value.trim()
    };

    const response = await fetch(API + "/updateVendor/" + id, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(vendor)
    });

    const result = await response.json();
    alert(result.message);

    clearForm();
    loadVendors();
}

async function deleteVendor(id) {
    if (!confirm("Delete this vendor?")) return;

    const response = await fetch(API + "/deleteVendor/" + id, {
        method: "DELETE"
    });

    const result = await response.json();
    alert(result.message);

    loadVendors();
}

async function searchVendor() {
    const search = document.getElementById("search").value.trim();

    if (search === "") {
        loadVendors();
        return;
    }

    const response = await fetch(API + "/searchVendor/" + search);
    const vendors = await response.json();

    renderVendors(vendors);
}

function clearForm() {
    document.getElementById("VendorID").value = "";
    document.getElementById("VendorName").value = "";
    document.getElementById("PhoneNumber").value = "";
    document.getElementById("Email").value = "";
    document.getElementById("ProductType").value = "";

    document.getElementById("saveBtn").style.display = "inline-block";
    document.getElementById("updateBtn").style.display = "none";
}