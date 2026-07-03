const API = "http://localhost:3000/api/stalls";

window.onload = loadStalls;

// =========================
// LOAD ALL
// =========================

async function loadStalls(){

const response=await fetch(API+"/getAllStalls");

const stalls=await response.json();

const table=document.getElementById("stallTable");

if(stalls.length===0){

table.innerHTML=`
<tr>
<td colspan="6" style="text-align:center;color:red">
No Stalls Found
</td>
</tr>
`;

return;

}

let rows="";

stalls.forEach(stall=>{

rows+=`

<tr>

<td>${stall.StallID}</td>

<td>${stall.StallNumber}</td>

<td>${stall.LocationZone}</td>

<td>$${stall.RentalFee}</td>

<td>${stall.Status}</td>

<td>

<button onclick="editStall(${stall.StallID})">

Edit

</button>

<button onclick="deleteStall(${stall.StallID})">

Delete

</button>

</td>

</tr>

`;

});

table.innerHTML=rows;

}

// =========================
// ADD
// =========================

async function addStall(){

const stall={

StallNumber:document.getElementById("stallNumber").value,

LocationZone:document.getElementById("locationZone").value,

RentalFee:document.getElementById("rentalFee").value,

Status:document.getElementById("status").value

};

await fetch(API+"/addStall",{

method:"POST",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify(stall)

});

clearForm();

loadStalls();

}

// =========================
// EDIT
// =========================

async function editStall(id){

const response=await fetch(API+"/getStall/"+id);

const stall=await response.json();

document.getElementById("stallId").value=stall.StallID;

document.getElementById("stallNumber").value=stall.StallNumber;

document.getElementById("locationZone").value=stall.LocationZone;

document.getElementById("rentalFee").value=stall.RentalFee;

document.getElementById("status").value=stall.Status;

}

// =========================
// UPDATE
// =========================

async function updateStall(){

const id=document.getElementById("stallId").value;

const stall={

StallNumber:document.getElementById("stallNumber").value,

LocationZone:document.getElementById("locationZone").value,

RentalFee:document.getElementById("rentalFee").value,

Status:document.getElementById("status").value

};

await fetch(API+"/updateStall/"+id,{

method:"PUT",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify(stall)

});

clearForm();

loadStalls();

}

// =========================
// DELETE
// =========================

async function deleteStall(id){

if(!confirm("Delete Stall?"))

return;

await fetch(API+"/deleteStall/"+id,{

method:"DELETE"

});

loadStalls();

}

// =========================
// SEARCH
// =========================

async function searchStall(){

const search=document.getElementById("search").value;

if(search===""){

loadStalls();

return;

}

const response=await fetch(API+"/searchStall/"+search);

const stalls=await response.json();

let rows="";

if(stalls.length===0){

document.getElementById("stallTable").innerHTML=`

<tr>

<td colspan="6">

No Stalls Found

</td>

</tr>

`;

return;

}

stalls.forEach(stall=>{

rows+=`

<tr>

<td>${stall.StallID}</td>

<td>${stall.StallNumber}</td>

<td>${stall.LocationZone}</td>

<td>$${stall.RentalFee}</td>

<td>${stall.Status}</td>

<td>

<button onclick="editStall(${stall.StallID})">

Edit

</button>

<button onclick="deleteStall(${stall.StallID})">

Delete

</button>

</td>

</tr>

`;

});

document.getElementById("stallTable").innerHTML=rows;

}

// =========================
// CLEAR
// =========================

function clearForm(){

document.getElementById("stallId").value="";

document.getElementById("stallNumber").value="";

document.getElementById("locationZone").value="";

document.getElementById("rentalFee").value="";

document.getElementById("status").value="Available";

}