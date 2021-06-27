class Planner extends HTMLElement {
    change = false

    weekArr = []

    constructor(change) {
        super()
        this.change = change
        this.id = 'planner'
        this.style.backgroundColor = 'black'
        this.style.color = 'black'
        this.style.gridArea = 'planner'
        this.style.borderTop = 'solid'
        this.style.borderLeft = 'solid'
        this.style.borderWidth = '1px'
        this.style.borderColor = 'white'
        this.style.minWidth = '500px'
        this.style.backgroundRepeat = 'repeat-y'
        this.style.height = '100%'

        this.createHeadline()
        this.createValves([{name: 'Valve 1'},{name: 'Valve 2'}])
        this.createWeek()
        this.createSubmit()
    }

    createHeadline(){
        let headline = document.createElement('h1')
        headline.style.color = 'white'
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
        question.style.color = 'white'
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
        question.style.color = 'white'
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

    createSubmit(){
        let div = document.createElement('div')
        div.id = 'submitWrapper'
        div.style.display = 'flex'
        div.style.alignItems = 'center'
        div.style.justifyContent = 'center'
        div.style.height = '75px'

        let submitBtn = document.createElement('button')
        submitBtn.style.border = 'none'
        submitBtn.style.textAlign = 'center'
        submitBtn.style.textDecoration = 'none'
        submitBtn.style.padding = '15px 32px'
        submitBtn.style.display = 'inline-block'
        submitBtn.style.margin = '5px'

        if (this.change){
            submitBtn.textContent = 'Change Plan'
            submitBtn.onclick = changePlan
            div.appendChild(submitBtn)

            let deleteBtn = document.createElement('button')
            deleteBtn.textContent = 'Delete Plan'
            deleteBtn.style.color = 'red'
            deleteBtn.style.borderColor = 'red'
            deleteBtn.style.backgroundColor = 'black'
            deleteBtn.style.padding = '15px 32px'
            deleteBtn.style.display = 'inline-block'
            deleteBtn.style.margin = '5px'
            deleteBtn.style.textAlign = 'center'
            deleteBtn.onclick = deletePlan
            div.appendChild(deleteBtn)

        } else {
            submitBtn.textContent = 'Save Plan'
            submitBtn.onclick = createPlan
            div.appendChild(submitBtn)
        }

        this.appendChild(div)
    }
}

window.customElements.define('my-planner', Planner)

function plan(change) {
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
    
    //adding a new grid item and stretching it over the template areas
    planner = new Planner(change)

    const container = document.getElementById('grid-container')
    container.appendChild(planner)
    container.style.gridTemplateAreas = '"clock clock" "irrigation planner"'
}

function createPlan() {
    console.log('Plan will be saved')
    window.location.reload()
}

function changePlan(){
    console.log('Plan will be updated')
    window.location.reload()
}

function deletePlan(){
    let confirmation = window.confirm('Do you really want to delete this plan?')
    if (confirmation){
        console.log('Plan will be deleted')
        window.location.reload()
    } else {
        console.log("Plan won't be deleted")
    }
    
}


