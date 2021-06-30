let planArr 

// So i can get all Valves in the Planner with their proper ID's 
let valveArr 

// So i can get all Valves that are included in the selected Plan
let activeValveArr

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
            if(selectedTile) {
                selectedTile.style.borderColor = 'white'
            }
            getActiveValves(element)
            plan(element)
            div.style.borderColor = 'rgb(0, 153, 254)'
            selectedTile = div
        }

        irrigationPlans.appendChild(div)
    });
});

function getActiveValves(planObj) {
    socket.emit('getSpecificPXCByPID', planObj)
}

socket.on('fetchSpecificPXC', data => {
    activeValveArr = JSON.parse(data)
    console.log(activeValveArr)
})

socket.on('fetchChannels', data => {
    let valves = document.getElementById('valveWrapper')

    removeAllChildNodes(valves)

    valveArr = JSON.parse(data)
    valveArr.forEach(element => {
        let div = document.createElement('div')
        div.className = 'tiles valveTile'
        div.textContent = element.name
        if(element.active == 1){
            div.style.backgroundImage = "url('resources/img/valve_active.svg')"
            div.style.borderColor = 'rgb(0, 153, 254)'
        } else {
            div.style.backgroundImage = "url('resources/img/valve.svg')"
            div.style.borderColor = 'white'
        }
        valves.appendChild(div)
    })
})

function updateChannels() {
    getDBTable('channels')
    setInterval(() => {
        if(document.getElementById('valveWrapper')){
            getDBTable('channels')
        }
    }, 1000)
}

updateChannels()

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
