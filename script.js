// Event handler manager

window.onload = function () {
    document.getElementById('btn-1').addEventListener('click', genSunData)
    document.getElementById('btn-2').addEventListener('click', genTempData)
    document.getElementById('btn-3').addEventListener('click', genOverview)
};


// ---------------------------------------------
// First question
// ---------------------------------------------

async function genSunData() {
    const dataList = await fetchList("http://api.weatherapi.com/v1/current.json?key=<YOUR_API_KEY>&q=<city>");
    const sortedEntries = logicFilter(dataList, "cloud");
    generateDataMenu(sortedEntries, "cloud", "");

}


// Sort entries based on 'cloud' parameter using bubblesort

function logicFilter(entries, key) {
    for (var i = 0; i < entries.length; i++) {
        for (var j = 0; j < (entries.length - i - 1); j++) {
            if (entries[j][key] > entries[j + 1][key]) {
                var temp = entries[j]
                entries[j] = entries[j + 1]
                entries[j + 1] = temp
            }
        }
    }
    return entries;
}

async function fetchList(query) {
    let totalList = [];
    for (const element of dataset) {
        const quer = query.replace("<city>", element.city);
        const result = await fetchData(quer);
        const merged = {
            ...result.current,
            locationName: result.location.name
        };

        totalList.push(merged);
    }

    return totalList;
}
function generateDataMenu(entries, highlight, extraKey) {
    const holder = document.getElementById('holder');
    holder.innerHTML = "";

    entries.forEach((element, i) => {
        let newDiv = "";
        for (const [key, value] of Object.entries(element)) {
            newDiv += `
                <div class="w-11/12 h-8 flex justify-between">
                    <div>${key}</div>
                    <div>${value}</div>
                </div>`;
        }

        const fullDiv = `
        <div class="w-full my-4 bg-green-200 p-4 h-fit">
            <div class="flex justify-between font-bold border-b mb-10">
                <p>${element.locationName}</p>
                <p>${highlight}: ${element[highlight]}</p>
<p>${extraKey ? element[extraKey] : ""}</p> 
                <button class="details" data-index="${i}">Expand</button>
            </div>
            <div class="hidden" id="detailpage-${i}">
                ${newDiv}
            </div>
        </div>`;

        holder.innerHTML += fullDiv;
    });

    document.querySelectorAll('.details').forEach(element => {
        element.addEventListener('click', (e) => {
            const container = e.target.closest("div").parentElement;
            const detailPage = container.querySelector(`[id^="detailpage"]`);

            detailPage.classList.toggle("hidden");
            detailPage.classList.toggle("block");
        });
    });
}




// ---------------------------------------------
// Second question
// ---------------------------------------------

Date.prototype.subtractDays = function (days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() - days);
    return date;
}


function formatDate(inputDate) {
    const dateObj = new Date(inputDate);
    return dateObj.toISOString().slice(0, 10);
}

async function genTempData() {
    const daysInPast = 6;
    const city = "ede-3326974";

    const date = new Date();
    let totalList = [];
    let totalTemp = 0;
    for (let index = 0; index < daysInPast; index++) {
        const yyyyMMdd = formatDate(date.subtractDays(index));
        console.log(yyyyMMdd);
        const result = await fetchData(`http://api.weatherapi.com/v1/history.json?key=<YOUR_API_KEY>&q=${city}&dt=${yyyyMMdd}`);
        const merged = {
            ...result.forecast,
            locationName: result.location.name,
            avgTemp: result.forecast.forecastday[0].day.avgtemp_c,
            date: yyyyMMdd //
        };

        totalList.push(merged);
        totalTemp += result.forecast.forecastday[0].day.avgtemp_c;
    }
generateDataMenu(totalList, "avgTemp", "date");  
alert(`Average temperature for ${city} is ${totalTemp / daysInPast}`)
}


// ---------------------------------------------
// Third question
// ---------------------------------------------


async function genOverview(){
        const dataList = await fetchList("http://api.weatherapi.com/v1/current.json?key=<YOUR_API_KEY>&q=<city>");
 let sortedBucket = []; 

    dataList.forEach(city => {
        const status = city.condition?.text ?? "Unknown";
        let found = false;

        for (let i = 0; i < sortedBucket.length; i++) {
            if (sortedBucket[i][0] === status) {
                sortedBucket[i][1]++;   
                found = true;
                break;                  
            }
        }

        if (!found) {
            sortedBucket.push([status, 1]); // add only once if not found
        }
    });
        console.log(sortedBucket);


         const holder = document.getElementById('holder');
    holder.innerHTML = "";

    sortedBucket.forEach((element, i) => {
        let newDiv = "";

        const fullDiv = `
        <div class="w-full my-4 bg-green-200 p-4 h-fit">
            <div class="flex justify-between font-bold border-b mb-10">
                <p>${element[0]}</p>
                <p>${element[1]}</p>
            </div>

        </div>`;

        holder.innerHTML += fullDiv;
    });
}


async function fetchData(query) {
    query = query.replace("<YOUR_API_KEY>", key)
    try {
        const response = await fetch(query);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
    }
}


