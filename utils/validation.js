function validateVendor(vendor) {
    const phoneRegex = /^[0-9]{10}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!vendor.VendorName || !vendor.VendorName.trim()) {
        return {
            valid: false,
            message: "Vendor name is required."
        };
    }

    if (!phoneRegex.test(vendor.Phone)) {
        return {
            valid: false,
            message: "Phone number must contain exactly 10 digits."
        };
    }

    if (!emailRegex.test(vendor.Email)) {
        return {
            valid: false,
            message: "Please enter a valid email address."
        };
    }

    if (!vendor.ProductCategory || !vendor.ProductCategory.trim()) {
        return {
            valid: false,
            message: "Product category is required."
        };
    }

    return {
        valid: true
    };
}


function validateStall(stall) {
    const stallNumberRegex = /^[A-Za-z0-9-]{2,10}$/;

    const rentalFee = Number(stall.RentalFee);

    if (!stall.StallNumber) {
        return {
            valid: false,
            message: "Stall number is required."
        };
    }

    if (!stallNumberRegex.test(stall.StallNumber)) {
        return {
            valid: false,
            message: "Invalid stall number."
        };
    }

    if (
        !Number.isFinite(rentalFee) ||
        rentalFee < 100 ||
        rentalFee > 10000
    ) {
        return {
            valid: false,
            message: "Rental fee must be between ₹100 and ₹10,000."
        };
    }

    if (
        !["North", "South", "East", "West"]
            .includes(stall.LocationZone)
    ) {
        return {
            valid: false,
            message: "Invalid location zone."
        };
    }

    if (
        !["Available", "Occupied"]
            .includes(stall.Status)
    ) {
        return {
            valid: false,
            message: "Invalid stall status."
        };
    }

    return {
        valid: true
    };
}


module.exports = {
    validateVendor,
    validateStall
};