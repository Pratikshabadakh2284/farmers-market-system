const SECTION_PAGES = {

    dashboard: "/html/dashboard-content.html",

    vendors: "/html/vendors.html",

    stalls: "/html/stalls.html",

    allocations: "/html/allocations.html",

    reports: "/html/reports.html"

};



async function loadSidebar() {

    try {

        const response = await fetch(
            "/html/sidebar.html"
        );


        if (!response.ok) {

            throw new Error(
                "Unable to load sidebar."
            );

        }


        const sidebarHTML =
            await response.text();


        document.getElementById(
            "sidebar-container"
        ).innerHTML = sidebarHTML;


        await showSection(
            null,
            "dashboard"
        );


    } catch (error) {

        console.error(
            "Sidebar loading error:",
            error
        );

    }

}



async function showSection(
    event,
    sectionName
) {

    if (event) {

        event.preventDefault();

    }


    const page =
        SECTION_PAGES[sectionName];


    if (!page) {

        return;

    }


    try {

        const response =
            await fetch(page);


        if (!response.ok) {

            throw new Error(
                "Unable to load section."
            );

        }


        const html =
            await response.text();


        const parser =
            new DOMParser();


        const pageDocument =
            parser.parseFromString(
                html,
                "text/html"
            );


        const main =
            pageDocument.querySelector(
                ".main"
            );


        if (!main) {

            throw new Error(
                ".main section not found."
            );

        }


        document.getElementById(
            "main-content"
        ).innerHTML =
            main.outerHTML;


        initialiseSection(
            sectionName
        );


        setActiveSection(
            sectionName
        );


    } catch (error) {

        console.error(
            "Section loading error:",
            error
        );


        document.getElementById(
            "main-content"
        ).innerHTML = `

            <div class="main">

                <p class="error-message">

                    Unable to load ${sectionName}.

                </p>

            </div>

        `;

    }

}



function initialiseSection(
    sectionName
) {

    if (
        sectionName === "dashboard" &&
        typeof window.initDashboard === "function"
    ) {

        window.initDashboard();

        return;

    }


    if (
        sectionName === "vendors" &&
        typeof window.initVendors === "function"
    ) {

        window.initVendors();

        return;

    }


    if (
        sectionName === "stalls" &&
        typeof window.initStalls === "function"
    ) {

        window.initStalls();

        return;

    }


    if (
        sectionName === "allocations" &&
        typeof window.initAllocations === "function"
    ) {

        window.initAllocations();

        return;

    }


    if (
        sectionName === "reports" &&
        typeof window.initReports === "function"
    ) {

        window.initReports();

    }

}



function setActiveSection(
    sectionName
) {

    const links =
        document.querySelectorAll(
            ".sidebar a[data-section]"
        );


    links.forEach(link => {

        link.classList.remove(
            "active"
        );


        if (
            link.dataset.section ===
            sectionName
        ) {

            link.classList.add(
                "active"
            );

        }

    });

}



function logout() {

    const answer = confirm(
        "Are you sure you want to logout?"
    );


    if (!answer) {

        return;

    }


    localStorage.clear();

    sessionStorage.clear();


    window.location.replace(
        "/html/login.html"
    );

}



function renderMessageRow(
    message,
    colspan = 6
) {

    return `

        <tr>

            <td
                colspan="${colspan}"
                class="table-message"
            >

                ${message}

            </td>

        </tr>

    `;

}



document.addEventListener(
    "DOMContentLoaded",
    loadSidebar
);