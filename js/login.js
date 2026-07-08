const form = document.getElementById("loginForm");

form.addEventListener("submit", async function (e) {

    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const message = document.getElementById("message");

    message.innerHTML = "";

    try {

        const response = await fetch("/api/auth/login", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                username,
                password
            })

        });

        const data = await response.json();

        if (response.ok) {

            localStorage.setItem("role", data.role);
            localStorage.setItem("username", data.username);
            localStorage.setItem("vendorID", data.vendorID);

            if (data.role === "Farmer") {

                window.location.href = "/html/farmer.html";

            } else {

    message.innerHTML = data.message;
    message.className = "error-message";

    // Clear the fields
    document.getElementById("username").value = "";
    document.getElementById("password").value = "";

    // Focus back on username
    document.getElementById("username").focus();

}

        } else {

            message.innerHTML = data.message;
            message.className = "error-message";

        }

    } catch (err) {

        message.innerHTML = "Unable to connect to server.";
        message.className = "error-message";

        console.log(err);

    }

});