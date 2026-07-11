const test = require("node:test");
const assert = require("node:assert");

const {
    validateStall
} = require("../utils/validation");


test("Valid stall should pass validation", () => {

    const stall = {
        StallNumber: "A01",
        LocationZone: "North",
        RentalFee: 500,
        Status: "Available"
    };

    const result = validateStall(stall);

    assert.strictEqual(result.valid, true);

});


test("Stall number is required", () => {

    const stall = {
        StallNumber: "",
        LocationZone: "North",
        RentalFee: 500,
        Status: "Available"
    };

    const result = validateStall(stall);

    assert.strictEqual(result.valid, false);

});


test("Invalid stall number should fail validation", () => {

    const stall = {
        StallNumber: "@",
        LocationZone: "North",
        RentalFee: 500,
        Status: "Available"
    };

    const result = validateStall(stall);

    assert.strictEqual(result.valid, false);

});


test("Rental fee below 100 should fail validation", () => {

    const stall = {
        StallNumber: "A01",
        LocationZone: "North",
        RentalFee: 50,
        Status: "Available"
    };

    const result = validateStall(stall);

    assert.strictEqual(result.valid, false);

    assert.strictEqual(
        result.message,
        "Rental fee must be between ₹100 and ₹10,000."
    );

});


test("Rental fee above 10000 should fail validation", () => {

    const stall = {
        StallNumber: "A01",
        LocationZone: "North",
        RentalFee: 15000,
        Status: "Available"
    };

    const result = validateStall(stall);

    assert.strictEqual(result.valid, false);

});


test("Invalid location zone should fail validation", () => {

    const stall = {
        StallNumber: "A01",
        LocationZone: "Unknown",
        RentalFee: 500,
        Status: "Available"
    };

    const result = validateStall(stall);

    assert.strictEqual(result.valid, false);

});


test("Invalid stall status should fail validation", () => {

    const stall = {
        StallNumber: "A01",
        LocationZone: "North",
        RentalFee: 500,
        Status: "Broken"
    };

    const result = validateStall(stall);

    assert.strictEqual(result.valid, false);

});