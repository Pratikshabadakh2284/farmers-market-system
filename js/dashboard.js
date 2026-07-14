const DASHBOARD_API =
    "/api/dashboard";



window.initDashboard = function () {

    loadDashboard();

};



async function loadDashboard() {

    try {

        const response =
            await fetch(
                DASHBOARD_API
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Unable to load dashboard."
            );

        }


        setDashboardValue(
            "totalVendors",
            data.vendors
        );


        setDashboardValue(
            "totalStalls",
            data.stalls
        );


        setDashboardValue(
            "availableStalls",
            data.available
        );


        setDashboardValue(
            "occupiedStalls",
            data.occupied
        );


        setDashboardValue(
            "totalAllocations",
            data.allocations
        );


    } catch (error) {

        console.error(
            "Dashboard loading error:",
            error
        );

    }

}



function setDashboardValue(
    id,
    value
) {

    const element =
        document.getElementById(id);


    if (element) {

        element.textContent =
            value ?? 0;

    }

}