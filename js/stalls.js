const api = "http://localhost:3000/api/stalls";

loadStalls();

async function loadStalls() {

    const response = await fetch(api);

    const data = await response.json();

    let html = "";

    if (data.length === 0) {

        html = `
        <tr>
            <td colspan="6">No Stall Found</td>
        </tr>
        `;

    } else {

        data.forEach(stall => {

            html += `
            <tr>

                <td>${stall.StallID}</td>

                <td>${stall.StallNumber}</td>

                <td>${stall.LocationZone}</td>

                <td>₹ ${stall.RentalFee}</td>

                <td>

                <span class="${stall.Status=="Available"?"available":"occupied"}">

                ${stall.Status}

                </span>

                </td>

                <td>

                <button class="edit-btn"

                onclick="editStall(${stall.StallID})">

                <i class="fa-solid fa-pen"></i>

                </button>

                <button class="delete-btn"

                onclick="deleteStall(${stall.StallID})">

                <i class="fa-solid fa-trash"></i>

                </button>

                </td>

            </tr>
            `;

        });

    }

    document.getElementById("stallTable").innerHTML = html;

}

async function searchStall(){

const text=document.getElementById("search").value;

if(text==""){

loadStalls();

return;

}

const response=await fetch(api+"/search/"+text);

const data=await response.json();

let html="";

if(data.length==0){

html=`
<tr>

<td colspan="6">

No Stall Found

</td>

</tr>

`;

}else{

data.forEach(stall=>{

html+=`

<tr>

<td>${stall.StallID}</td>

<td>${stall.StallNumber}</td>

<td>${stall.LocationZone}</td>

<td>₹ ${stall.RentalFee}</td>

<td>

<span class="${stall.Status=="Available"?"available":"occupied"}">

${stall.Status}

</span>

</td>

<td>

<button class="edit-btn"

onclick="editStall(${stall.StallID})">

<i class="fa-solid fa-pen"></i>

</button>

<button class="delete-btn"

onclick="deleteStall(${stall.StallID})">

<i class="fa-solid fa-trash"></i>

</button>

</td>

</tr>

`;

});

}

document.getElementById("stallTable").innerHTML=html;

}