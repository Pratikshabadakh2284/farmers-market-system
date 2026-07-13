async function loadSidebar() {
    try {
        const response = await fetch("/html/sidebar.html");

        if (!response.ok) {
            throw new Error("Unable to load sidebar.");
        }

        const sidebarHTML = await response.text();

        document.getElementById("sidebar-container").innerHTML = sidebarHTML;

        setActiveMenu();

    } catch (error) {
        console.error("Sidebar loading failed:", error);
    }
}

function setActiveMenu() {
    const currentPath = window.location.pathname;

    const menuLinks = document.querySelectorAll(".sidebar a");

    menuLinks.forEach(link => {
        const linkPath = link.getAttribute("href");

        if (linkPath === currentPath) {
            link.classList.add("active");
        }
    });
}

function logout() {

    const confirmLogout = confirm(
        "Are you sure you want to logout?"
    );

    if (!confirmLogout) {
        return;
    }

    localStorage.clear();
    sessionStorage.clear();

    window.location.replace("/");
}

function renderMessageRow(message, colspan = 6) {
    return `
        <tr>
            <td colspan="${colspan}" class="table-message">
                ${message}
            </td>
        </tr>
    `;
}

document.addEventListener("DOMContentLoaded", loadSidebar);