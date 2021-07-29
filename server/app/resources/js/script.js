const socket = io.connect("http://localhost:80")
//const socket = io.connect("http://10.0.0.241:80")
//Edit IP suitable

// SOCKET-METHODS

// EMITTING TO BACK-END

function createIrrigationPlan(data) {
    socket.emit("createPlan", data);
}

function getDBTable(nameOfTable) {

    //Use this object to send data to the server
    var data = {
        tableName: nameOfTable
    }

    socket.emit("requestData", data);
}

function getActiveValves(planObj) {
    socket.emit('getSpecificPXCByPID', planObj)
}

function getHumidity() {
    socket.emit('getHumidity')
}

// RECEIVING FROM BACK-END

//On receiving all irrigation plans from DB, rebuilds all tiles in irrigationPlanWrapper
socket.on("fetchIrrigationPlans", function (data) {
    let irrigationPlans = document.getElementById('irrigationPlanWrapper')

    removeAllChildNodesInverted(irrigationPlans)

    planArr = JSON.parse(data)
    planArr.forEach(element => {

        let div = document.createElement('div')
        div.className = 'tiles irrigationTile'
        div.textContent = element.planName

        div.onclick = () => {

            if (selectedTile) {
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

//Gets fired when clicking on an existing plan and toggles the valve checkboxes
socket.on('fetchSpecificPXC', data => {
    activeValveArr = JSON.parse(data)

    let clear = document.getElementById('planner').children[2].getElementsByTagName('input')
    for (let index = 0; index < clear.length; index++) {
        clear[index].checked = false
    }

    activeValveArr.forEach(element => {
        document.getElementById(`${element.channelID}`).checked = true
    })
})

//Only used on initialization
socket.on('fetchChannels', data => {
    valveArr = JSON.parse(data)
    buildValves(valveArr)
})

//Updates data of humidityStr, if UI is visible also applies changes
socket.on('fetchHumidity', data => {
    humidityStr = data
    let humidity = document.getElementById('humidity-counter')
    if (humidity) {
        humidity.textContent = data
    }
})

//Updates data of valveArr to active-state. If UI is visible, also changes the appearance of the Tiles
socket.on('fetchIrrigation', data => {
    const index = parseInt(data[0]) - 1

    const valveWrapper = document.getElementById('valveWrapper')

    let valve

    if (data.includes('opened')) {
        if (valveWrapper) {
            valve = valveWrapper.children[index]
            valve.style.backgroundImage = "url('resources/img/valve_active.svg')"
            valve.style.borderColor = 'rgb(0, 153, 254)'
        }

        valveArr[index].active = 1

    } else if (data.includes('closed')) {
        if (valveWrapper) {
            valve = valveWrapper.children[index]
            valve.style.backgroundImage = "url('resources/img/valve.svg')"
            valve.style.borderColor = 'white'
        }

        valveArr[index].active = 0
    }
})





