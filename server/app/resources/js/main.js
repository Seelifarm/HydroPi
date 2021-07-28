let planArr 

// So i can get all Valves in the Planner with their proper ID's 
let valveArr 

// So i can get all Valves that are included in the selected Plan
let activeValveArr

// So i can deselect it once you click on something else
let selectedTile

let humidityStr
  
//Initialization
getDBTable('irrigationPlans')
getDBTable('channels')
getHumidity()

socket.on("fetchIrrigationPlans", function(data) {
    let irrigationPlans = document.getElementById('irrigationPlanWrapper')
    removeAllChildNodesInverted(irrigationPlans)
    planArr = JSON.parse(data)
    planArr.forEach(async element => {
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

socket.on('fetchChannels', data => {
    valveArr = JSON.parse(data)
    buildValves(valveArr)
})

socket.on('fetchHumidity', data => {
    humidityStr = data
    let humidity = document.getElementById('humidity-counter')
    if(humidity){
        humidity.textContent = data
    }
})

socket.on('fetchIrrigation', data => {
    const index = parseInt(data[0]) - 1
    
    const valveWrapper = document.getElementById('valveWrapper')
    
    let valve 

    if(data.includes('opened')){
        if (valveWrapper){
            valve = valveWrapper.children[index]
            valve.style.backgroundImage = "url('resources/img/valve_active.svg')"
            valve.style.borderColor = 'rgb(0, 153, 254)'
        }

        valveArr[index].active = 1
        
    } else if(data.includes('closed')){
        if (valveWrapper){
            valve = valveWrapper.children[index]
            valve.style.backgroundImage = "url('resources/img/valve.svg')"
            valve.style.borderColor = 'white'
        }
        
        valveArr[index].active = 0
    }
})

function buildHumidity(str){
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

function buildValves(arr){
    const container = document.getElementById('grid-container')

    const valves = document.createElement('div')
    valves.id = 'valves'

    const headline = document.createElement('h1')
    headline.textContent = 'Valves'
    valves.appendChild(headline)

    const valveWrapper = document.createElement('div')
    valveWrapper.id = 'valveWrapper'

    if(arr){
        arr.forEach( element => {
            let div = document.createElement('div')
            div.className = 'tiles valveTile'
            div.textContent = element.name
            if(element.active == 1){
                div.style.backgroundImage = "url('resources/img/valve_active.svg')"
                div.style.borderColor = 'rgb(0, 153, 254)'
            }else {
                div.style.backgroundImage = "url('resources/img/valve.svg')"
                div.style.borderColor = 'white'
            }
            valveWrapper.appendChild(div)
        })
    }
    
    valves.appendChild(valveWrapper)
    container.appendChild(valves)
}
