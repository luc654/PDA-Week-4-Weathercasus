// Event handler manager

window.onload = function() { 
    document.getElementById('btn-1').addEventListener('click', genSunData)
    document.getElementById('btn-2').addEventListener('click', genSunData)
};


// ---------------------------------------------
// First question
// ---------------------------------------------

async function genSunData(){
    const dataList = await fetchList("http://api.weatherapi.com/v1/current.json?key=<YOUR_API_KEY>&q=<city>");
    const sortedEntries = logicFilter(dataList);
    generateDataMenu(sortedEntries, "cloud");
    
}   


// Sort entries based on 'cloud' parameter using bubblesort

function logicFilter(entries){
    for (var i = 0; i < entries.length; i++) {
        for (var j = 0; j < (entries.length - i - 1); j++) {
            if (entries[j].cloud > entries[j + 1].cloud) {
                var temp = entries[j]
                entries[j] = entries[j + 1]
                entries[j + 1] = temp
            }
        }
    }
    return entries;
}

const arr = ["tilburg", "amsterdam", "rotterdam"];
async function fetchList(query){
let totalList = [];
for (const element of arr) {
    const quer = query.replace("<city>", element);
    const result = await fetchData(quer);
    const merged = {
        ...result.current,
        locationName: result.location.name
    };

    totalList.push(merged);
}

    return totalList;
}
function generateDataMenu(entries, highlight) {
    const holder = document.getElementById('holder');
    
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




async function fetchData(query){
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
