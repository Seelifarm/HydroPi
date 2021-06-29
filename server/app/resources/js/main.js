let planArr 

// So i can get all Valves in the Planner with their proper ID's 
let valveArr 

// So i can deselect it once you click on something else
let selectedTile
  
getDBTable('irrigationPlans')

socket.on("fetchIrrigationPlans", function(data) {
    let irrigationPlans = document.getElementById('irrigationPlanWrapper')
    removeAllChildNodesInverted(irrigationPlans)
    planArr = JSON.parse(data)
    planArr.forEach(element => {
        let div = document.createElement('div')
        div.className = 'tiles irrigationTile'
        div.textContent = element.planName
        div.onclick = () => {
            plan(element)
            div.style.borderColor = 'rgb(0, 153, 254)'
            selectedTile = div
        }

        irrigationPlans.appendChild(div)
    });
});
    
getDBTable('channels')

socket.on('fetchChannels', data => {
    let valves = document.getElementById('valveWrapper')

    removeAllChildNodes(valves)

    valveArr = JSON.parse(data)
    valveArr.forEach(element => {
        let div = document.createElement('div')
        div.className = 'tiles valveTile'
        div.textContent = element.name

        valves.appendChild(div)
    })

})


function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

function removeAllChildNodesInverted(parent) {
    while(parent.lastChild) {
        if(parent.lastChild.id != 'addTile'){
        parent.removeChild(parent.lastChild)
        } else {
            break
        }
    }
}