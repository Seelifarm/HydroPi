"use strict"



const http = require('http')

const express = require('express')

const fs = require('fs')

const path = require('path')

const port = 80

const app = express()

const nodeCron = require('node-cron')

const db = require("./db/entities")

var CronJobManager = require('cron-job-manager')

let {PythonShell} = require('python-shell')

var socket = require('socket.io')
const { weekdays } = require('moment')
const { duration } = require('tarn/dist/utils')
const { SSL_OP_EPHEMERAL_RSA } = require('constants')

var server = http.createServer(app)

var io = socket(server);

var manager = new CronJobManager()

var htmlPath = path.join(__dirname, 'app')

app.use(express.static(htmlPath))



var counter = 0

var clients = {}

io.sockets.on("connection", function(Socket){

  console.log("★ New connection found and registered with ID: " + Socket.id);

  clients[Socket.id] = Socket;

  Socket.on("sendMessage", function(data){

    console.log("★ " + data)

    //Use data to fill tje job with variables

    manager.add(counter.toString(),'0 * * * * *', function() {

      //use python-shell to execute script

        console.log("★ A Cron Job is running every minute")

    });

    manager.start(counter.toString())

    console.log("★ Started a cron job")

    counter++

    console.log("★ Logging this counter: " + counter)

  });



  //DB interfaces for table irrigationPlans
  Socket.on("createPlan", async function(data){
    let pXC = data.channels

    delete data.channels;

    await db.insertEntity('irrigationPlans', data)

    let arr = [] 

    pXC.forEach(async element => {
      arr.push(element.channelID)
      await db.insertEntity('planXChannel', element)
    })

    let valvesString = arr.join('+')
    scheduleCronForPlan(data, valvesString ,"create")
  });

  Socket.on("updatePlan", async function(data){

    // delete old pXC
    await db.deleteEntity('planXChannel', 'planID', data.planID)
   

    arr = [] 
    // insert new pXC
    data.channels.forEach(async element => {
      arr.push(element.channelID)
      await db.insertEntity('planXChannel', element)
    })

    let valvesString = arr.join('+')

    await db.updateEntity('irrigationPlans', 'planID', data.planID, data)
    scheduleCronForPlan(data, "update", valvesString)
  });

  Socket.on("deletePlan", async function(data){
    await db.deleteEntity('irrigationPlans', 'planID', data.planID)
    await db.deleteEntity('planXChannel', 'planID', data.planID)
    scheduleCronForPlan(data, "" , "delete")
  });

  //DB update interface for channels
  Socket.on("updateChannels", async function(data){
    await db.updateEntity('channels', 'channelID', data.channelID, data)
  });

  //DB interfaces for table planXChannel (TODO: delete, done in plan methods)
  Socket.on("createPXC", async function(data){
    await db.insertEntity('planXChannel', data)
  });

  Socket.on("updatePXC", async function(data){
    await db.updateEntity('planXChannel', 'planID', data.planID, data)
  });

  Socket.on("deletePXCByPID", async function(data){
    await db.deleteEntity('planXChannel', 'planID', data.planID)
  });

  Socket.on("deleteSpecificInPXC", async function(data){
    await db.deleteSpecificEntity('planXChannel', 'planID', data.planID, 'channelID', data.channelID)
  });

  //Data to client as JSON
  Socket.on("requestData", async function(data){
    // send a message to the destination
    switch (data.tableName) {
      case 'channels':
        Socket.emit("fetchChannels" , JSON.stringify(await db.getAllEntities(data.tableName)));
        break;
      case 'irrigationPlans':
        Socket.emit("fetchIrrigationPlans" , JSON.stringify(await db.getAllEntities(data.tableName)));
        break;
      case 'planXChannel':
        Socket.emit("fetchPlanXChannel" , JSON.stringify(await db.getAllEntities(data.tableName)));
        break;
      case 'sensorLog':
        Socket.emit("fetchSensorLog" , JSON.stringify(await db.getAllEntities(data.tableName)));
        break;
      case 'irrigationLog':
        Socket.emit("fetchIrrigationLog" , JSON.stringify(await db.getAllEntities(data.tableName)));
        break;
      default:
        break;
    }
  });

  Socket.on('getSpecificPXCByPID', async function(data) { 
    Socket.emit('fetchSpecificPXC', JSON.stringify(await db.getEntity('planXChannel', 'planID', data.planID))) })
});



// Manager for creating/updating/deleting cronjobs for irrigation plans
async function scheduleCronForPlan(data, valvesString ,action){

  // only needed for create/update

  let weekdays = [data.monday, data.tuesday, data.wednesday, data.thursday, data.friday, data.saturday, data.sunday]

  weekdays.forEach(function(day, index) {

    let cronID = data.planID
    // only needed for create/update
    var duration 

    switch (index) {
      case 0:
        cronID += "-Mon"
        duration = data.monDuration
        break;
      case 1:
        cronID += "-Tue"
        duration = data.tueDuration
        break;
      case 2:
        cronID += "-Wed"
        duration = data.wedDuration
        break;
      case 3:
        cronID += "-Thu"
        duration = data.thuDuration
        break;
      case 4:
        cronID += "-Fri"
        duration = data.friDuration
        break;
      case 5:
        cronID += "-Sat"
        duration = data.satDuration
        break;  
      case 6:
        cronID += "-Sun"
        duration = data.sunDuration
        break;    
      default:
        console.log("Invalid ID")
        break;
    }

    //if != null
    if(day){

      switch (action) {
        case "create":
          manager.add(cronID, day, function() {
            createCronJob(valvesString, duration)
          })
          manager.start(cronID);
          break;
        case "update":
          manager.update(cronID, day, function() {
            createCronJob(valvesString, duration)
          })
          break;
        case "delete":
          manager.deleteJob(cronID);
          break;
        default:
          console.log("Invalid action. Choose from: create, update, delete")
          break;
      }

    } else {
      if(action == "update" && manager.exists(cronID)){
        manager.deleteJob(cronID)
      }
    }
  })
}

/* 
function getValvesForPlan(data){
  //Get all used valves in this plan as [channelID, channelID, ...]
  let valves = data
  if(valves.length != 0){
    for (let index = 0; index < valves.length; index++) {
      valves[index] = valves[index].channelID.stringify
    }
    console.log('Valves: '+ valves)
  } else {
    console.log('planXChannel Data seems to be empty')
  }
  
  var valvesString = valves.join('+')
  console.log(valvesString)
  return valvesString
} */



// Cronjob
function createCronJob(valvesString, duration) {
  console.log(`${manager.listCrons}`)

  let options = {
    mode: 'text',
    pythonPath: 'python3',
    pythonOptions: ['-u'], // get print results in real-time
    scriptPath: '../scripts',
    args: ['--c='+"'"+ valvesString +"'", '--d='+duration]
  };

  PythonShell.run('irrigationController.py', options, function (err, results) {
    if (err) throw err;
    // results is an array consisting of messages collected during execution
    console.log('results: %j', results);
  });

}

  
// Database

app.use(express.urlencoded({extended: false}));

app.use(express.json());

server.listen(port, error => {

  if (error) {

      console.log('★ Something went wrong ', error)

  } else {

      console.log('★ Server is listening on port ' + port)

  }

})