// CUSTOM HTML ELEMENT
// ******PLANNER******

class Planner extends HTMLElement {
    change = false // used to always identify if this plan already existed or will be created

    weekArr = []

    WEEKDAYS = [{ name: 'Monday', number: 1 }, { name: 'Tuesday', number: 2 },
                { name: 'Wednesday', number: 3 }, { name: 'Thursday', number: 4 },
                { name: 'Friday', number: 5 }, { name: 'Saturday', number: 6 }, { name: 'Sunday', number: 0 }]

    planObj = {
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
        sunDuration: 100,
        channels: []
    }

    constructor(planObj) {
        super()
        if (planObj) {
            this.planObj = planObj
            this.change = true
        }

        this.id = 'planner'
        this.createHeadline()
        this.createValves()
        this.createWeek()
        this.createSubmit()
        updateCheckBoxes(this)
    }

    createHeadline() {
        const button = document.createElement('button')
        button.id = 'closeButton'
        button.textContent = 'X'
        button.onclick = () => {
            resetPage()
        }
        this.appendChild(button)

        let headline = document.createElement('h1')
        if (this.change) {
            headline.textContent = 'Change your irrigation plan'
        } else {
            headline.textContent = 'Create an irrigation plan'
        }
        this.appendChild(headline)
    }

    createValves() {
        let question = document.createElement('h2')
        question.textContent = 'Which valves should be included?'
        this.appendChild(question)

        let valves = document.createElement('div')
        valves.style.width = '100%'
        valves.style.display = 'flex'
        valves.style.justifyContent = 'center'

        valveArr.forEach(element => {
            let check = document.createElement('input')
            check.id = element.name
            check.type = 'checkbox'
            valves.appendChild(check)

            let label = document.createElement('label')
            label.id = element.name + 'Lbl'
            label.htmlFor = element.name
            label.textContent = element.name
            label.style.margin = '2px'
            label.style.width = '25%'
            label.style.maxWidth = '80px'
            valves.appendChild(label)
        });

        this.appendChild(valves)
    }

    createWeek() {
        let div = document.createElement('div')
        div.style.width = this.width

        let question = document.createElement('h2')
        question.textContent = 'On which days do you want to irrigate?'
        div.appendChild(question)

        let weekdiv = document.createElement('div')
        weekdiv.id = 'week'
        weekdiv.style.height = 'fit-content'
        weekdiv.style.display = 'flex'
        weekdiv.style.justifyContent = 'center'

        this.WEEKDAYS.forEach(element => {
            let day = document.createElement('div')

            let check = document.createElement('input')
            check.id = element.name
            check.type = 'checkbox'
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

    createSubmit() {
        let div = document.createElement('div')
        div.id = 'submitWrapper'

        let submitBtn = document.createElement('button')
        submitBtn.id = 'submitBtn'

        //Only adds a delete button if there is already a plan existing, otherwise just give the option to save a plan
        if (this.change) {
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

    // used to enable or disable inputs after checking a day-checkbox
    toggleInputs(element) {
        let time = element.srcElement.parentNode.children[3]
        if (time && time.disabled === true) {
            time.disabled = false
        } else if (time) {
            time.disabled = true
        }

        let duration = element.srcElement.parentNode.children[5]
        if (duration && duration.disabled === true) {
            duration.disabled = false
        } else if (time) {
            duration.disabled = true
        }
    }
}

window.customElements.define('my-planner', Planner)

// HELPER-FUNCTIONS

// used to set a new planID in planObject
function getLastPlanID() {
    if (planArr.length != 0) {
        return planArr[planArr.length - 1].planID + 1
    } else {
        return 0
    }
}

// used to get time in the correct cronjob format
function convertTime(arr) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i][0] === '0') {
            arr[i] = arr[i].slice(1)
        }
    }
    return arr
}

//used to fill inputs from cronjob format
function convertTimeReversed(str) {
    if (str.length == 1) {
        return '0' + str
    } else return str
}

// DATA-UI METHODS

//used to fill planObject with User-Inputs
function readData() {
    let planObj = document.getElementById('planner').planObj
    let arr = document.getElementById('planner').weekArr
    let time

    if (arr[0].children[0].checked) {
        time = convertTime(arr[0].children[3].value.split(':'))
        planObj.monday = `0 ${time[1]} ${time[0]} * * 1`
        planObj.monDuration = arr[0].children[5].valueAsNumber
    } else {
        planObj.monday = null
        planObj.monDuration = 0
    }

    if (arr[1].children[0].checked) {
        time = convertTime(arr[1].children[3].value.split(':'))
        planObj.tuesday = `0 ${time[1]} ${time[0]} * * 2`
        planObj.tueDuration = arr[1].children[5].valueAsNumber
    } else {
        planObj.tuesday = null
        planObj.tueDuration = 0
    }

    if (arr[2].children[0].checked) {
        time = convertTime(arr[2].children[3].value.split(':'))
        planObj.wednesday = `0 ${time[1]} ${time[0]} * * 3`
        planObj.wedDuration = arr[2].children[5].valueAsNumber
    } else {
        planObj.wednesday = null
        planObj.wedDuration = 0
    }

    if (arr[3].children[0].checked) {
        time = convertTime(arr[3].children[3].value.split(':'))
        planObj.thursday = `0 ${time[1]} ${time[0]} * * 4`
        planObj.thuDuration = arr[3].children[5].valueAsNumber
    } else {
        planObj.thursday = null
        planObj.thuDuration = 0
    }

    if (arr[4].children[0].checked) {
        time = convertTime(arr[4].children[3].value.split(':'))
        planObj.friday = `0 ${time[1]} ${time[0]} * * 5`
        planObj.friDuration = arr[4].children[5].valueAsNumber
    } else {
        planObj.friday = null
        planObj.friDuration = 0
    }

    if (arr[5].children[0].checked) {
        time = convertTime(arr[5].children[3].value.split(':'))
        planObj.saturday = `0 ${time[1]} ${time[0]} * * 6`
        planObj.satDuration = arr[5].children[5].valueAsNumber
    } else {
        planObj.saturday = null
        planObj.satDuration = 0
    }

    if (arr[6].children[0].checked) {
        time = convertTime(arr[6].children[3].value.split(':'))
        planObj.sunday = `0 ${time[1]} ${time[0]} * * 0`
        planObj.sunDuration = arr[6].children[5].valueAsNumber
    } else {
        planObj.sunday = null
        planObj.sunDuration = 0
    }

    return planObj
}

// used to fill UI with data of an already existing plan
function updateCheckBoxes(element) {

    let planObj = element.planObj
    let weekArr = element.weekArr
    let time
    if (element.change) {
        if (planObj.monday != null) {
            weekArr[0].children[0].checked = true
            time = planObj.monday.split(' ')
            weekArr[0].children[3].value = `${convertTimeReversed(time[2])}:${convertTimeReversed(time[1])}`
            weekArr[0].children[3].disabled = false
            weekArr[0].children[5].value = planObj.monDuration
            weekArr[0].children[5].disabled = false
        }

        if (planObj.tuesday != null) {
            weekArr[1].children[0].checked = true
            time = planObj.tuesday.split(' ')
            weekArr[1].children[3].value = `${convertTimeReversed(time[2])}:${convertTimeReversed(time[1])}`
            weekArr[1].children[3].disabled = false
            weekArr[1].children[5].value = planObj.tueDuration
            weekArr[1].children[5].disabled = false
        }

        if (planObj.wednesday != null) {
            weekArr[2].children[0].checked = true
            time = planObj.wednesday.split(' ')
            weekArr[2].children[3].value = `${convertTimeReversed(time[2])}:${convertTimeReversed(time[1])}`
            weekArr[2].children[3].disabled = false
            weekArr[2].children[5].value = planObj.wedDuration
            weekArr[2].children[5].disabled = false
        }

        if (planObj.thursday != null) {
            weekArr[3].children[0].checked = true
            time = planObj.thursday.split(' ')
            weekArr[3].children[3].value = `${convertTimeReversed(time[2])}:${convertTimeReversed(time[1])}`
            weekArr[3].children[3].disabled = false
            weekArr[3].children[5].value = planObj.thuDuration
            weekArr[3].children[5].disabled = false
        }

        if (planObj.friday != null) {
            weekArr[4].children[0].checked = true
            time = planObj.friday.split(' ')
            weekArr[4].children[3].value = `${convertTimeReversed(time[2])}:${convertTimeReversed(time[1])}`
            weekArr[4].children[3].disabled = false
            weekArr[4].children[5].value = planObj.friDuration
            weekArr[4].children[5].disabled = false
        }

        if (planObj.saturday != null) {
            weekArr[5].children[0].checked = true
            time = planObj.saturday.split(' ')
            console.log(convertTimeReversed(time[1]))
            weekArr[5].children[3].value = `${convertTimeReversed(time[2])}:${convertTimeReversed(time[1])}`
            weekArr[5].children[3].disabled = false
            weekArr[5].children[5].value = planObj.satDuration
            weekArr[5].children[5].disabled = false
        }

        if (planObj.sunday != null) {
            weekArr[6].children[0].checked = true
            time = planObj.sunday.split(' ')
            weekArr[6].children[3].value = `${convertTimeReversed(time[2])}:${convertTimeReversed(time[1])}:00`
            weekArr[6].children[3].disabled = false
            weekArr[6].children[5].value = planObj.sunDuration
            weekArr[6].children[5].disabled = false
        }
    }
}

// BUTTON-FUNCTIONS | EMITTING TO BACK-END

// creating a new plan
function createPlan() {
    let plan = readData()
    let channels = createPlanXChannel()

    if (channels.length > 2) {
        window.alert('A selection of three or more valves isn\'t possible due to safety issues')
    } else if (channels.length < 1) {
        window.alert('Please select one or two valves for your irrigation plan')
    } else {
        plan.channels = channels
        socket.emit('createPlan', plan)
        resetPage()
    }
}

// updating an existing plan
function changePlan() {
    const updatedPlan = readData()
    let channels = createPlanXChannel()
    if (channels.length > 2) {
        window.alert('A selection of three or more valves isn\'t possible due to safety issues')
    } else if (channels.length < 1) {
        window.alert('Please select one or two valves for your irrigation plan')
    } else {
        updatedPlan.channels = channels
        socket.emit('updatePlan', updatedPlan)
        resetPage()
    }
}

// deleting an existing plan
function deletePlan() {
    let confirmation = window.confirm('Do you really want to delete this plan?')
    if (confirmation) {
        console.log('Plan will be deleted')
        let plan = document.getElementById('planner').planObj
        socket.emit('deletePlan', plan)
    } else {
        console.log("Plan won't be deleted")
    }
    resetPage()
}

// used to create a planXchannel entry, will be handled by back-end
function createPlanXChannel() {
    let div = document.getElementById('planner').children[3]
    let planID = document.getElementById('planner').planObj.planID
    let arr = []
    for (let i = 0; i < valveArr.length; i++) {
        if (div.children[i * 2].checked) {
            let valve = { channelID: valveArr[i].channelID, planID: planID }
            arr.push(valve)
        }
    }
    return arr
}

