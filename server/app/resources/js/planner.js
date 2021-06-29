class Planner extends HTMLElement {
    planObj = {
        //Hier von allen Plans die höchste ID finden und + 1
        planID: getLastPlanID(),
        planName: "New Plan",
        monday: null,
        monDuration: 100,
        tuesday: null,
        tueDuration: 100,
        wednesday: null,
        wedDuration: 100,
        thursday: null,
        thuDuration: 100,
        friday: null,
        friDuration: 100,
        saturday: null,
        satDuration: 100,
        sunday: null,
        sunDuration: 100
    }

    //Boolean to see if plan already existed or will be created
    change = false
    //Contains all day-divs for easy access
    weekArr = []

    constructor(planObj) {
        super()
        if (planObj) {
            this.planObj = planObj
            this.change = true
        }

        this.id = 'planner'
        this.createHeadline()
        this.createValves([{name: 'Valve 1'},{name: 'Valve 2'}])
        this.createWeek()
        this.createSubmit()
    }

    createHeadline(){
        let headline = document.createElement('h1')
        if (this.change) {
            headline.textContent = 'Change your irrigation plan'
        } else {
            headline.textContent = 'Create an irrigation plan'
        }

        this.appendChild(headline)
    }

    createValves(arr){
        let valvesArr = arr
        let question = document.createElement('h2')
        question.textContent = 'Which valves should be included?'
        this.appendChild(question)
        let valves = document.createElement('div')
        valves.style.width = '100%'
        valves.style.display = 'flex'
        valves.style.justifyContent = 'center'

        valvesArr.forEach(element => {
            let check = document.createElement('input')
            check.id = element.name
            check.type = 'checkbox'
            valves.appendChild(check)
        
            let label = document.createElement('label')
            label.id = element.name + 'Lbl'
            label.htmlFor = element.name
            label.textContent = element.name
            label.style.margin = '2px'
            valves.appendChild(label)

        });

        this.appendChild(valves)
    }

    createWeek(){
        let div = document.createElement('div')
        div.style.width = this.width

        let question = document.createElement('h2')
        question.textContent = 'On which days do you want to irrigate?'
        div.appendChild(question)

        let weekdiv = document.createElement('div')
        weekdiv.style.height = 'fit-content'
        weekdiv.style.display = 'flex'
        weekdiv.style.justifyContent = 'center'

        const WEEKDAYS = [{name: 'Monday', number: 1},{name: 'Tuesday', number: 2},{name: 'Wednesday', number: 3},{name: 'Thursday', number: 4},{name: 'Friday', number: 5},{name: 'Saturday', number: 6},{name: 'Sunday', number: 0}]

        WEEKDAYS.forEach(element => {
            let day = document.createElement('div')
            day.style.width = `88px`
            day.style.height = 'fit-content'
            day.style.justifyContent = 'center'

            let check = document.createElement('input')
            check.id = element.name
            check.type='checkbox'
            check.onchange = this.toggleInputs
            day.appendChild(check)

            let label = document.createElement('label')
            label.id = element.name + 'Lbl'
            label.htmlFor = element.name
            label.textContent = element.name
            day.appendChild(label)
            
            let start = document.createElement('span')
            start.textContent = 'Start at:'
            day.appendChild(start)

            let time = document.createElement('input')
            time.type = 'time'
            time.value = '13:00'
            time.disabled = true
            day.appendChild(time)
        
            let durationLbl = document.createElement('span')
            durationLbl.textContent = 'Duration in s:'
            day.appendChild(durationLbl)

            let duration = document.createElement('input')
            duration.type = 'number'
            duration.valueAsNumber = 100
            duration.min = 1
            duration.disabled = true
            day.appendChild(duration)

            this.weekArr.push(day)
            weekdiv.appendChild(day)
        })

        div.appendChild(weekdiv)
        this.appendChild(div)
    }

    createSubmit(){
        let div = document.createElement('div')
        div.id = 'submitWrapper'


        let submitBtn = document.createElement('button')
        submitBtn.id = 'submitBtn'

        //Only adds a delete button if there is already a plan existing, otherwise just give the option to save a plan
        if (this.change){
            submitBtn.textContent = 'Change Plan'
            submitBtn.onclick = changePlan
            div.appendChild(submitBtn)

            let deleteBtn = document.createElement('button')
            deleteBtn.id = 'deleteBtn'
            deleteBtn.textContent = 'Delete Plan'
            deleteBtn.onclick = deletePlan
            div.appendChild(deleteBtn)
        } else {
            submitBtn.textContent = 'Save Plan'
            submitBtn.onclick = createPlan
            div.appendChild(submitBtn)
        }

        this.appendChild(div)
    }

    toggleInputs(element) {
        let time = element.srcElement.parentNode.children[3]
        if(time && time.disabled === true){
            time.disabled = false
        } else if (time) {
            time.disabled = true
        }

        let duration = element.srcElement.parentNode.children[5]
        if(duration && duration.disabled === true){
            duration.disabled = false
        } else if (time) {
            duration.disabled = true
        }
    }
}

window.customElements.define('my-planner', Planner)

function getLastPlanID() {
    if(planArr.length != 0){
        return planArr[planArr.length - 1].planID + 1
    } else {
        return 0
    }
}

function plan(planObj) {
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
    container.style.gridTemplateAreas = '"clock clock" "irrigation planner"'
    container.appendChild(planner)
}

function createPlan() {
    console.log('Plan will be saved')
    const newPlan = readData()
    console.log(newPlan)
    // Jtz ab zum Server als neuer Eintrag
}

function changePlan(){
    console.log('Plan will be updated')
    const updatedPlan = readData()
    console.log(updatedPlan)
}

function deletePlan(){
    let confirmation = window.confirm('Do you really want to delete this plan?')
    if (confirmation){
        console.log('Plan will be deleted')
        // Plan nach PK = planID löschen, sowohl aus irrigationPlans als auch planXChannel
    } else {
        console.log("Plan won't be deleted")
    }
    
}

function readData() {
    let planObj = document.getElementById('planner').planObj
    let arr = document.getElementById('planner').weekArr

    if(arr[0].children[0].checked) {
        // planObj.monday = 
        planObj.monDuration = arr[0].children[5].valueAsNumber
    } else {
        planObj.monday = null
        planObj.monDuration = 0
    }

    if(arr[1].children[0].checked) {
        // planObj.tuesday = 
        planObj.tueDuration = arr[1].children[5].valueAsNumber
    } else {
        planObj.tuesday = null
        planObj.tueDuration = 0
    }

    if(arr[2].children[0].checked) {
        // planObj.wednesday = 
        planObj.wedDuration = arr[2].children[5].valueAsNumber
    } else {
        planObj.wednesday = null
        planObj.wedDuration = 0
    }

    if(arr[3].children[0].checked) {
        // planObj.thursday = 
        planObj.thuDuration = arr[3].children[5].valueAsNumber
    } else {
        planObj.thursday = null
        planObj.thuDuration = 0
    }

    if(arr[4].children[0].checked) {
        // planObj.friday = 
        planObj.friDuration = arr[4].children[5].valueAsNumber
    } else {
        planObj.friday = null
        planObj.friDuration = 0
    }

    if(arr[5].children[0].checked) {
        // planObj.saturday = 
        planObj.satDuration = arr[5].children[5].valueAsNumber
    } else {
        planObj.saturday = null
        planObj.satDuration = 0
    }

    if(arr[6].children[0].checked) {
        // planObj.sunday = 
        planObj.sunDuration = arr[6].children[5].valueAsNumber
    } else {
        planObj.sunday = null
        planObj.sunDuration = 0
    }
    
    return planObj
}




