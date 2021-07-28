const socket = io.connect("http://localhost:80")
//const socket = io.connect("http://192.168.0.147:80")
//Edit IP suitable

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

function getHumidity(){
    socket.emit('getHumidity')
}

// Helper functions to manipulate HTML node structure

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

function removeAllChildNodesInverted(parent) {
    while(parent.lastChild) {
        if(parent.lastChild.id != 'addTile'){
        parent.removeChild(parent.lastChild)
        } else {
            break
        }
    }
}




