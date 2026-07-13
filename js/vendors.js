const API = "/api/vendors";

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
        rows = renderMessageRow("No vendors found.");
    } else {
        vendors.forEach(vendor => {
            rows += `
                <tr>
                    <td>${vendor.VendorID}</td>
                    <td>${vendor.VendorName}</td>
                    <td>${vendor.Phone}</td>
                    <td>${vendor.Email}</td>
                    <td>${vendor.ProductCategory}</td>
                   <td class="action-cell">
    <div class="action-buttons">
        <button
            type="button"
            class="edit-btn"
            onclick="editVendor(${vendor.VendorID})">
            Edit
        </button>

        <button
            type="button"
            class="delete-btn"
            onclick="deleteVendor(${vendor.VendorID})">
            Delete
        </button>
    </div>
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

    if (!validateVendor(vendor)) return;

    try {
        const response = await fetch(API + "/addVendor", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(vendor)
        });

        const result = await response.json();

        if (!response.ok) {
            alert(result.message || "Unable to add vendor.");
            return;
        }

        alert(result.message);
        clearForm();
        await loadVendors();

    } catch (error) {
        console.error(error);
        alert("Unable to connect to the server.");
    }
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
    document.getElementById("cancelVendorBtn").style.display = "inline-block";

    document.getElementById("vendorForm").scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

    document.getElementById("VendorName").focus();
}

async function updateVendor() {
    const id = document.getElementById("VendorID").value;

    if (!id) {
        alert("Please select a vendor to update.");
        return;
    }

    const vendor = {
        VendorName: document.getElementById("VendorName").value.trim(),
        Phone: document.getElementById("PhoneNumber").value.trim(),
        Email: document.getElementById("Email").value.trim(),
        ProductCategory: document.getElementById("ProductType").value.trim()
    };

    if (!validateVendor(vendor)) return;

    try {
        const response = await fetch(API + "/updateVendor/" + id, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(vendor)
        });

        const result = await response.json();

        if (!response.ok) {
            alert(result.message || "Unable to update vendor.");
            return;
        }

        alert(result.message);
        clearForm();
        await loadVendors();

    } catch (error) {
        console.error(error);
        alert("Unable to connect to the server.");
    }
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
    document.getElementById("cancelVendorBtn").style.display = "none";

    document.getElementById("VendorName").focus();
}

function validateVendor(vendor) {
    const phoneRegex = /^[0-9]{10}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!vendor.VendorName.trim()) {
        alert("Vendor name is required.");
        return false;
    }

    if (!phoneRegex.test(vendor.Phone)) {
        alert("Phone number must contain exactly 10 digits.");
        return false;
    }

    if (!emailRegex.test(vendor.Email)) {
        alert("Please enter a valid email address.");
        return false;
    }

    if (!vendor.ProductCategory.trim()) {
        alert("Product category is required.");
        return false;
    }

    return true;
}