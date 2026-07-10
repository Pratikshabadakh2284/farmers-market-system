document.addEventListener("DOMContentLoaded", function () {

    localStorage.clear();

    const form = document.getElementById("loginForm");

    form.addEventListener("submit", async function (e) {
        e.preventDefault();

        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value.trim();
        const message = document.getElementById("message");

        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem("username", data.username);
                localStorage.setItem("role", data.role);

                window.location.href = "/html/index.html";
            } else {
                message.innerHTML = data.message;
                document.getElementById("username").value = "";
                document.getElementById("password").value = "";
            }

        } catch (err) {
            message.innerHTML = "Server connection failed.";
            console.log(err);
        }
    });

});