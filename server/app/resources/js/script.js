const socket = io.connect("http://localhost:80")
//const socket = io.connect("http://192.168.0.147:80")
//Edit IP suitable

function createIrrigationPlan(data) {
    //Use this object to send data to the server
    socket.emit("createPlan", data);
   // document.getElementsById('testBtn').disabled = true
}


/* socket.on("fetchData", function(data) {
    console.log("kOMMT AN")
    parsing = JSON.parse(data)
}); */

function getDBTable(nameOfTable) {

    //Use this object to send data to the server

    var data = {

        tableName: nameOfTable

    }

    socket.emit("requestData", data);

   // document.getElementsById('testBtn').disabled = true
}

function test () {
    socket.emit("updateChannels", {channelID: 2, name: 'Custom Name', active: 1})
}
 






