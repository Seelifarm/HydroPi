"use strict"



const http = require('http')

const express = require('express')

const fs = require('fs')

const path = require('path')

const port = 80

const app = express()

const db = require("./db/entities")

const cron = require ("./cron")

let {PythonShell} = require('python-shell')

var socket = require('socket.io')
const { weekdays } = require('moment')
const { duration } = require('tarn/dist/utils')
const { SSL_OP_EPHEMERAL_RSA } = require('constants')
const { log } = require('console')

var server = http.createServer(app)

var io = socket(server);

var htmlPath = path.join(__dirname, 'app')

app.use(express.static(htmlPath))





// SOCKETS

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
    cron.createJobsFromIrrigationPlan(data, valvesString, runIrrigation);
  });

  Socket.on("updatePlan", async function(data){

    // delete old pXC
    await db.deleteEntity('planXChannel', 'planID', data.planID)
   

    let arr = [] 
    // insert new pXC
    data.channels.forEach(async element => {
      arr.push(element.channelID)
      await db.insertEntity('planXChannel', element)
    })

    delete data.channels;

    let valvesString = arr.join('+')

    await db.updateEntity('irrigationPlans', 'planID', data.planID, data)
    cron.updateJobsFromIrrigationPlan(data, valvesString, runIrrigation)
  });

  Socket.on("deletePlan", async function(data){
    await db.deleteEntity('irrigationPlans', 'planID', data.planID)
    await db.deleteEntity('planXChannel', 'planID', data.planID)
    cron.deleteJobsFromIrrigationPlan(data)
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

  Socket.on('getHumidity', async function() {
    const humidity = await db.getLastEntity('sensorLog', 'logTime')
    Socket.emit("fetchHumidity", humidity[0].value.toString() + "%")
  })
});





// PYTHON SCRIPT METHODS

// run sensor
function runSensor() {
  let pyshell = new PythonShell('sensorTest.py');  // sensor.py (Testing: sensorTest.py) 

  // sends a message to the Python script via stdin
  // pyshell.send('hello');

  pyshell.on('message', function (message) {
    // received a message sent from the Python script (a simple "print" statement)
    if (message.includes('%')) {
      let humidityValue = message.substring(12)
      io.emit("fetchHumidity", humidityValue);
    }
    console.log(message);
  });

  // end the input stream and allow the process to exit
  pyshell.end(function (err, code, signal) {
    if (err) throw err;
    console.log('★ The exit code was: ' + code);
    console.log('★ The exit signal was: ' + signal);
    console.log('★ finished humidity measurement')
  });
}

// open valve(s)/relay(s) to irrigate plants
function runIrrigation(valvesString, duration) {

  let options = {
    mode: 'text',
    pythonPath: 'python3',
    pythonOptions: ['-u'], // get print results in real-time
    scriptPath: '../scripts',
    args: ['--c=' + valvesString, '--d=' + duration]
  };

  let pyshell = new PythonShell('irrigationControllerTest.py', options);  // irrigationController.py (Testing: irrigationControllerTest.py)

  pyshell.on('message', function (message) {
    // received a message sent from the Python script (a simple "print" statement)
    if (message.includes('Channel')) {
      io.emit('fetchIrrigation', message.slice(10))
    }
    console.log(message);
  });

  // end the input stream and allow the process to exit
  pyshell.end(function (err, code, signal) {
    if (err) throw err;
    console.log('★ The exit code was: ' + code);
    console.log('★ The exit signal was: ' + signal);
    console.log('★ finished irrigation')
  });
}





// Method to restore CronJobs from irrigationPlans in DB on (re)boot
async function restoreCronJobs() {

  // get all irrigationPlans from db
  let plans = await db.getAllEntities("irrigationPlans")
  //console.log(plans)

  // get all planXChannel (valves)
  var pcMap = new Map()
  let pXC = await db.getAllEntities("planXChannel")
  pXC.forEach(x => {
    if (!pcMap.has(x.planID)) {
      pcMap.set(x.planID, [])
    }
    pcMap.get(x.planID).push(x.channelID)
  })

  //console.log(pcMap)

  // create CronJob for each plan
  plans.forEach(plan => {
    let valvesString = pcMap.get(plan.planID).join('+')
    cron.createJobsFromIrrigationPlan(plan, valvesString, runIrrigation)
  })
}





// INITIALIZATION

// create a CronJob that runs the sensor.py every minute
cron.createJobForHumiditySensor('0 * * * * *', runSensor)

// restore all CronJobs from saved irrigationPlans
restoreCronJobs()





// START SERVER

app.use(express.urlencoded({ extended: false }));

app.use(express.json());

server.listen(port, error => {

  if (error) {

    console.log('★ Something went wrong ', error)

  } else {

    console.log('★ Server is listening on port ' + port)

  }

})