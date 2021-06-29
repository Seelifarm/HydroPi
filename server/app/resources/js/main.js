async function initializeIrrigationPlans() {
    let irrigationPlans = document.getElementById('irrigationPlans')
    getDBTable('irrigationPlans')

    let planArr 

    socket.on("fetchData", function(data) {
        planArr = JSON.parse(data)
        planArr.forEach(element => {
            let div = document.createElement('div')
            div.className = 'tiles irrigationTile'
            div.addEventListener('onclick', () => {
                plan(true)
                div.style.backgroundColor = 'white'
                div.style.borderColor = 'rgb(0, 153, 254)'
            })
            irrigationPlans.appendChild(div)
        });
        console.log(planArr)
    });
}

initializeIrrigationPlans()
