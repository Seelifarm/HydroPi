// GLOBAL VARIABLES

let planArr

let valveArr

let humidityStr 

let activeValveArr //used after a plan gets selected

let selectedTile //used to change back the border color after a different tile gets selected

// INITIALIZATION

getDBTable('irrigationPlans')
getDBTable('channels')
getHumidity()

// UI-METHODS

//Used to build and rebuild humidity-column | Used for initialization and on page reset or rather after planner gets dismissed
function buildHumidity(str) {
    const container = document.getElementById('grid-container')

    const humidity = document.createElement('div')
    humidity.id = 'humidity'

    const headline = document.createElement('h1')
    headline.textContent = 'Humidity'
    humidity.appendChild(headline)

    const humidityWrapper = document.createElement('div')
    humidityWrapper.id = 'humidityWrapper'

    const drop = document.createElement('img')
    drop.src = 'resources/img/drop.svg'
    drop.alt = 'DripDrop'
    drop.style.width = '70px'
    drop.style.padding = '1cm'
    humidityWrapper.appendChild(drop)

    const counter = document.createElement('span')
    counter.id = 'humidity-counter'
    counter.textContent = str
    humidityWrapper.appendChild(counter)

    humidity.appendChild(humidityWrapper)
    container.appendChild(humidity)
}

//Used to build and rebuild valves-column | Used for initialization and on page reset or rather after planner gets dismissed
function buildValves(arr) {
    const container = document.getElementById('grid-container')

    const valves = document.createElement('div')
    valves.id = 'valves'

    const headline = document.createElement('h1')
    headline.textContent = 'Valves'
    valves.appendChild(headline)

    const valveWrapper = document.createElement('div')
    valveWrapper.id = 'valveWrapper'

    if (arr) {
        arr.forEach(element => {
            let div = document.createElement('div')
            div.className = 'tiles valveTile'
            div.textContent = element.name
            if (element.active == 1) {
                div.style.backgroundImage = "url('resources/img/valve_active.svg')"
                div.style.borderColor = 'rgb(0, 153, 254)'
            } else {
                div.style.backgroundImage = "url('resources/img/valve.svg')"
                div.style.borderColor = 'white'
            }
            valveWrapper.appendChild(div)
        })
    }

    valves.appendChild(valveWrapper)
    container.appendChild(valves)
}

// used upon clicking on irrigationTiles: switches UI grid colums, passes planObj to constructor if already existing 
function plan(planObj) {
    if (selectedTile) {
        selectedTile.style.borderColor = 'white'
    }

    //Remove any underlaying elements
    let humidity = document.getElementById('humidity')
    if (humidity) {
        humidity.remove()
    }

    let valves = document.getElementById('valves')
    if (valves) {
        valves.remove()
    }

    let planner = document.getElementById('planner')
    if (planner) {
        planner.remove()
    }

    //Adds a new custom HTML-Element as grid item and changes the template areas accordingly
    planner = new Planner(planObj)

    const container = document.getElementById('grid-container')

    const width = document.documentElement.clientWidth
    if (width > 1200) {
        container.style.gridTemplateAreas = '"clock clock" "irrigation planner"'
    } else {
        container.style.gridTemplateAreas = '"clock" "planner" "irrigation"'
    }

    container.appendChild(planner)
}

// used to switch UI back from planner to humidity and valves
function resetPage() {
    let planner = document.getElementById('planner')
    if (planner) {
        planner.remove()
    }

    let container = document.getElementById('grid-container')
    getDBTable('irrigationPlans')
    buildHumidity(humidityStr)
    buildValves(valveArr)

    const width = document.documentElement.clientWidth
    if (width > 1200) {
        container.style.gridTemplateAreas = '"clock clock" "irrigation humidity" "irrigation valves"'
    } else {
        container.style.gridTemplateAreas = '"clock" "irrigation" "humidity" "valves"'
    }
}

// UI-HELPER-FUNCTIONS

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

function removeAllChildNodesInverted(parent) {
    while (parent.lastChild) {
        if (parent.lastChild.id != 'addTile') {
            parent.removeChild(parent.lastChild)
        } else {
            break
        }
    }
}
