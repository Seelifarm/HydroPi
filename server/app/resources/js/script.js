const socket = io.connect("http://localhost:80")
//Edit IP suitable

function createPlanByObjectServer(data) {
    //Use this object to send data to the server
    socket.emit("createPlan", data);
   // document.getElementsById('testBtn').disabled = true
}

function sendDataToServer2() {
    //Use this object to send data to the server
    var data = {
        tableName: "irrigationPlans"
    }
    socket.emit("requestData", data);
   // document.getElementsById('testBtn').disabled = true
}

function sendDataToServer3() {
    //Use this object to send data to the server
    var data = {
        planID: 8,
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
    socket.emit("createPlan", data);
   // document.getElementsById('testBtn').disabled = true
}



    socket.on("fetchData", function(data) {
        console.log("kOMMT AN")
        console.log(JSON.stringify(data))
    });


function getDBTable(nameOfTable) {

    //Use this object to send data to the server

    var data = {

        tableName: nameOfTable

    }

    socket.emit("requestData", data);

   // document.getElementsById('testBtn').disabled = true

}

function createIrrigationPlan(pID,mon,monD,tue,tueD,wed,wedD,thu,thuD,fri,friD,sat,satD,sun,sunD) {

    //Use this object to send data to the server

    var data = {

        planID: pID,

        monday: mon,

        monDuration: monD,

        tuesday: tue,

        tueDuration: tueD,

        wednesday: wed,

        wedDuration: wedD,

        thursday: thu,

        thuDuration: thuD,

        friday: fri,

        friDuration: friD,

        saturday: sat,

        satDuration: satD,

        sunday: sun,

        sunDuration: sunD

    }

    socket.emit("createPlan", data);

   // document.getElementsById('testBtn').disabled = true

}






