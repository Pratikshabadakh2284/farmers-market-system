async function loadDashboard(){

const response=await fetch("/api/dashboard");

const data=await response.json();

document.getElementById("vendors").innerHTML=data.vendors;

document.getElementById("stalls").innerHTML=data.stalls;

document.getElementById("occupied").innerHTML=data.occupied;

document.getElementById("available").innerHTML=data.available;

}

loadDashboard();