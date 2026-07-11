const test = require("node:test");
const assert = require("node:assert");

const {
    validateVendor
} = require("../utils/validation");


test("Valid vendor should pass validation", () => {

    const vendor = {
        VendorName: "Green Valley Farm",
        Phone: "9876543210",
        Email: "greenvalley@gmail.com",
        ProductCategory: "Vegetables"
    };

    const result = validateVendor(vendor);

    assert.strictEqual(result.valid, true);

});


test("Vendor name is required", () => {

    const vendor = {
        VendorName: "",
        Phone: "9876543210",
        Email: "greenvalley@gmail.com",
        ProductCategory: "Vegetables"
    };

    const result = validateVendor(vendor);

    assert.strictEqual(result.valid, false);

    assert.strictEqual(
        result.message,
        "Vendor name is required."
    );

});


test("Vendor phone must contain exactly 10 digits", () => {

    const vendor = {
        VendorName: "Green Valley Farm",
        Phone: "12345",
        Email: "greenvalley@gmail.com",
        ProductCategory: "Vegetables"
    };

    const result = validateVendor(vendor);

    assert.strictEqual(result.valid, false);

    assert.strictEqual(
        result.message,
        "Phone number must contain exactly 10 digits."
    );

});


test("Vendor email must be valid", () => {

    const vendor = {
        VendorName: "Green Valley Farm",
        Phone: "9876543210",
        Email: "invalidemail",
        ProductCategory: "Vegetables"
    };

    const result = validateVendor(vendor);

    assert.strictEqual(result.valid, false);

    assert.strictEqual(
        result.message,
        "Please enter a valid email address."
    );

});


test("Vendor product category is required", () => {

    const vendor = {
        VendorName: "Green Valley Farm",
        Phone: "9876543210",
        Email: "greenvalley@gmail.com",
        ProductCategory: ""
    };

    const result = validateVendor(vendor);

    assert.strictEqual(result.valid, false);

    assert.strictEqual(
        result.message,
        "Product category is required."
    );

});