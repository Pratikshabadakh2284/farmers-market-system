const test = require("node:test");
const assert = require("node:assert/strict");

const app = require("../server");
let server;
let baseURL;
let createdVendorID;


// START TEST SERVER

test.before(async () => {
    server = app.listen(0);
    await new Promise(resolve => {
        server.once("listening", resolve);
    });

    const address = server.address();
    baseURL = `http://localhost:${address.port}`;

});


test.after(async () => {

    if (server) {

        await new Promise(resolve => {
            server.close(resolve);
        });

    }

});

// CREATE VENDOR TEST

test("POST API should create a vendor", async () => {
    const testVendor = {
        VendorName: "Integration Test Farm",
        Phone: "9999999999",
        Email: "integration.test@example.com",
        ProductCategory: "Vegetables"
    };


    const response = await fetch(

        baseURL + "/api/vendors/addVendor",
        {
            method: "POST",
            headers: {

                "Content-Type": "application/json"
            },
            body: JSON.stringify(testVendor)

        }
    );

    const result = await response.json();
    assert.strictEqual(

        response.status,
        201
    );

    assert.strictEqual(

        result.message,
        "Vendor Added Successfully"

    );

});


// READ VENDOR TEST

test("GET API should return the created vendor", async () => {

    const response = await fetch(

        baseURL + "/api/vendors/getAllVendors"

    );

    const vendors = await response.json();

    assert.strictEqual(

        response.status,

        200

    );

    const vendor = vendors.find(

        item => item.Email ===
            "integration.test@example.com"

    );

    assert.ok(vendor);

    assert.strictEqual(

        vendor.VendorName,

        "Integration Test Farm"

    );

    createdVendorID = vendor.VendorID;

});



//UPDATE VENDOR TEST

test("PUT API should update the vendor", async () => {

    assert.ok(createdVendorID);

    const updatedVendor = {

        VendorName: "Updated Integration Farm",

        Phone: "9999999999",

        Email: "integration.test@example.com",

        ProductCategory: "Fruits"

    };

    const response = await fetch(

        baseURL +
        "/api/vendors/updateVendor/" +
        createdVendorID,
        {

            method: "PUT",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify(updatedVendor)

        }

    );

    const result = await response.json();

    assert.strictEqual(

        response.status,

        200

    );

    assert.strictEqual(

        result.message,

        "Vendor Updated Successfully"

    );

    const getResponse = await fetch(

        baseURL +
        "/api/vendors/getVendor/" +
        createdVendorID

    );

    const vendor = await getResponse.json();

    assert.strictEqual(
        vendor.VendorName,

        "Updated Integration Farm"
    );


    assert.strictEqual(

        vendor.ProductCategory,

        "Fruits"

    );

});


// DELETE VENDOR TEST

test("DELETE API should delete the test vendor", async () => {

    assert.ok(createdVendorID);

    const response = await fetch(

        baseURL +
        "/api/vendors/deleteVendor/" +
        createdVendorID,

        {
            method: "DELETE"
        }

    );


    const result = await response.json();


    assert.strictEqual(

        response.status,

        200

    );

    assert.strictEqual(

        result.message,
        "Vendor Deleted Successfully"

    );


    const getResponse = await fetch(

        baseURL +
        "/api/vendors/getVendor/" +
        createdVendorID

    );


    const vendor = await getResponse.json();

    assert.strictEqual(
        vendor,
        null
    );

});