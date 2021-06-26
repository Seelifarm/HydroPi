"use strict"

const socket = io.connect("http://localhost:80")
//Edit IP suitable

function sendDataToServer(data) {
    //Use this object to send data to the server
    socket.emit("sendMessage", data);
    document.getElementsById('testBtn').disabled = true
}

class Clock {
    constructor(element){
        this.element = element;
    }

    start() {
        this.update()

        setInterval(() => {
            this.update()
        }, 500)
    }

    update() {
        const parts = this.getTimeParts()
        const dateFormatted = `${parts.weekday}, ${parts.day.toString().padStart(2,"0")}.${parts.month.toString().padStart(2,"0")}.${parts.year.toString()}`
        const timeFormatted = `${parts.hour}:${parts.minutes.toString().padStart(2,"0")}`
        
        document.querySelector(".date").textContent = dateFormatted
        document.querySelector(".time").textContent = timeFormatted
    }

    getTimeParts(){
        const now = new Date()
        let weekday = ""

        switch (now.getDay()) {
            case 0:
                weekday = "Sunday"
                break;
            case 1:
                weekday = "Monday" 
                break;
            case 2:
                weekday = "Tuesday"
                break;
            case 3:
                weekday = "Wednesday" 
                break;
            case 4:
                weekday = "Thursday" 
                break;
            case 5:
                weekday = "Friday" 
                break;
            case 6:
                weekday = "Saturday" 
                break;
            default:
                weekday = "It is Wednesday my dudes"
                break;
        }

        return {
            hour: now.getHours(),
            minutes: now.getMinutes(),
            weekday: weekday,
            day: now.getDate(),
            month: now.getMonth(),
            year: now.getFullYear()
        }
    }
}

const clockElement = document.querySelector(".clock")
const clockObj = new Clock(clockElement)

clockObj.start()