"use strict"



const http = require('http')

const express = require('express')

const fs = require('fs')

const path = require('path')

const port = 80

const app = express()

const logger = require('./log/logger')(__filename.slice(__filename.lastIndexOf('/')+1))

const db = require('./db/entities')

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

  logger.http("New connection found and registered with ID: " + Socket.id);

  clients[Socket.id] = Socket;

  Socket.on("sendMessage", function(data){

    logger.http("" + data)

    //Use data to fill the job with variables

    manager.add(counter.toString(),'0 * * * * *', function() {

      //use python-shell to execute script

        logger.info("A Cron Job is running every minute")

    });

    manager.start(counter.toString())

    logger.info("Started a cron job")

    counter++

    logger.info("Logging this counter: " + counter)

  });



  //DB interfaces for table irrigationPlans

  Socket.on("createPlan", async function(data){
    logger.http(`Socket on: "createPlan", Client ID: ${Socket.id}, Data: ${JSON.stringify(data)}`);
    try {
      // extract channels from data(plan) to match db entity
      let pXC = data.channels;
      delete data.channels;
      // insert plan into db
      await db.insertEntity('irrigationPlans', data);
  
      // compose valvesString
      let arr = [];
      pXC.forEach(async element => {
        arr.push(element.channelID);
        //insert pXC into db (which channel(s) belong to which plan)
        await db.insertEntity('planXChannel', element);
      });
      let valvesString = arr.join('+');

      cron.createJobsFromIrrigationPlan(data, valvesString, runIrrigation);

    } catch (error) {
      logger.error(error);
    }
  });

  Socket.on("updatePlan", async function (data) {
    logger.http(`Socket on: "updatePlan", Client ID: ${Socket.id}, Data: ${JSON.stringify(data)}`);
    try {
      // delete old pXC
      await db.deleteEntity('planXChannel', 'planID', data.planID);

      // compose valvesString
      let arr = [];
      data.channels.forEach(async element => {
        arr.push(element.channelID);
        // insert new pXC
        await db.insertEntity('planXChannel', element);
      })
      let valvesString = arr.join('+');

      // delete channels from data(plan) to match db entity
      delete data.channels;

      await db.updateEntity('irrigationPlans', 'planID', data.planID, data);

      cron.updateJobsFromIrrigationPlan(data, valvesString, runIrrigation);

    } catch (error) {
      logger.error(error);
    }
  });

  Socket.on("deletePlan", async function(data){
    logger.http(`Socket on: "deletePlan", Client ID: ${Socket.id}, Data: ${JSON.stringify(data)}`);
    try {
      // delete entities
      await db.deleteEntity('irrigationPlans', 'planID', data.planID);
      await db.deleteEntity('planXChannel', 'planID', data.planID);
      
      cron.deleteJobsFromIrrigationPlan(data);

    } catch (error) {
      logger.error(error);
    }
  });



  //DB update interface for channels
  Socket.on("updateChannels", async function(data){
    logger.http(`Socket on: "updateChannels", Client ID: ${Socket.id}, Data: ${JSON.stringify(data)}`);
    try {
      await db.updateEntity('channels', 'channelID', data.channelID, data);
    } catch (error) {
      logger.error(error);
    }
  });



  //DB interfaces for table planXChannel
  Socket.on("createPXC", async function(data){
    logger.http(`Socket on: "createPXC", Client ID: ${Socket.id}, Data: ${JSON.stringify(data)}`);
    try {
      await db.insertEntity('planXChannel', data);
    } catch (error) {
      logger.error(error);
    }
  });

  Socket.on("updatePXC", async function(data){
    logger.http(`Socket on: "updatePXC", Client ID: ${Socket.id}, Data: ${JSON.stringify(data)}`);
    try {
      await db.updateEntity('planXChannel', 'planID', data.planID, data);
    } catch (error) {
      logger.error(error);
    }
  });

  Socket.on("deletePXCByPID", async function(data){
    logger.http(`Socket on: "deletePXCByPID", Client ID: ${Socket.id}, Data: ${JSON.stringify(data)}`);
    try {
      await db.deleteEntity('planXChannel', 'planID', data.planID);
    } catch (error) {
      logger.error(error);
    }
  });

  Socket.on("deleteSpecificInPXC", async function(data){
    logger.http(`Socket on: "deleteSpecificInPXC", Client ID: ${Socket.id}, Data: ${JSON.stringify(data)}`);
    try {
      await db.deleteSpecificEntity('planXChannel', 'planID', data.planID, 'channelID', data.channelID);
    } catch (error) {
      logger.error(error);
    }
  });



  //Data to client as JSON
  Socket.on("requestData", async function (data) {
    logger.http(`Socket on: "requestData", Client ID: ${Socket.id}, Data: ${JSON.stringify(data)}`);
    try {
      let requestedData;
      switch (data.tableName) {
        case 'channels':
          requestedData = JSON.stringify(await db.getAllEntities(data.tableName));
          Socket.emit("fetchChannels", requestedData);
          logger.http(`Socket emit: "fetchChannels", Client ID: ${Socket.id}, Data: ${requestedData}`);
          break;
        case 'irrigationPlans':
          requestedData = JSON.stringify(await db.getAllEntities(data.tableName));
          Socket.emit("fetchIrrigationPlans", requestedData);
          logger.http(`Socket emit: "fetchIrrigationPlans", Client ID: ${Socket.id}, Data: ${requestedData}`);
          break;
        case 'planXChannel':
          requestedData = JSON.stringify(await db.getAllEntities(data.tableName));
          Socket.emit("fetchPlanXChannel", requestedData);
          logger.http(`Socket emit: "fetchPlanXChannel", Client ID: ${Socket.id}, Data: ${requestedData}`);
          break;
        case 'sensorLog':
          requestedData = JSON.stringify(await db.getAllEntities(data.tableName));
          Socket.emit("fetchSensorLog", requestedData);
          logger.http(`Socket emit: "fetchSensorLog", Client ID: ${Socket.id}, Data: ${requestedData}`);
          break;
        case 'irrigationLog':
          requestedData = JSON.stringify(await db.getAllEntities(data.tableName));
          Socket.emit("fetchIrrigationLog", requestedData);
          logger.http(`Socket emit: "fetchIrrigationLog", Client ID: ${Socket.id}, Data: ${requestedData}`);
          break;
        default:
          throw `Invalid tableName: ${data.tableName}`;
      }
    } catch (error) {
      logger.error(error);
    }
  });

  Socket.on('getSpecificPXCByPID', async function (data) {
    logger.http(`Socket on: "getSpecificPXCByPID", Client ID: ${Socket.id}, Data: ${JSON.stringify(data)}`);
    try {
      const requestedData = JSON.stringify(await db.getEntity('planXChannel', 'planID', data.planID));
      Socket.emit('fetchSpecificPXC', requestedData);
      logger.http(`Socket emit: "fetchSpecificPXC", Client ID: ${Socket.id}, Data: ${requestedData}`);
    } catch (error) {
      logger.error(error);
    }
  });

  Socket.on('getHumidity', async function () {
    logger.http(`Socket on: "getHumidity", Client ID: ${Socket.id}, Data: null`);
    try {
      const humidity = await db.getLastEntity('sensorLog', 'logTime');
      const humidityValue = humidity[0].value.toString() + "%";
      Socket.emit("fetchHumidity", humidityValue);
      logger.http(`Socket emit: "fetchHumidity", Client ID: ${Socket.id}, Data: ${humidityValue}`);
    } catch (error) {
      logger.error(error);
    }
  });

});





// PYTHON SCRIPT METHODS

// run sensor
function runSensor() {
  logger.warn('Starting sensor.py');

  let pyshell = new PythonShell('sensorTest.py');  // sensor.py (Testing: sensorTest.py) 

  // sends a message to the Python script via stdin
  // pyshell.send('hello');

  pyshell.on('message', function (message) {
    // received a message sent from the Python script (a simple "print" statement)
    if (message.includes('%')) {
      let humidityValue = message.substring(12);
      io.emit("fetchHumidity", humidityValue);
      logger.http(`Socket emit: "fetchHumidity", Client ID: BROADCAST, Data: ${humidityValue}`);
    }
    logger.warn(message);
  });

  // end the input stream and allow the process to exit
  pyshell.end(function (err, code, signal) {
    if (err) throw err;
    logger.warn('sensor.py exit code was: ' + code);
    logger.warn('sensor.py exit signal was: ' + signal);
    logger.warn('finished humidity measurement');
  });
}

// open valve(s)/relay(s) to irrigate plants
function runIrrigation(valvesString, duration) {
  logger.warn('Starting irrigationController.py');

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
      const data = message.slice(10);
      io.emit('fetchIrrigation', data);
      logger.http(`Socket emit: "fetchIrrigation", Client ID: BROADCAST, Data: ${data}`);
    }
    logger.warn(message);
  });

  // end the input stream and allow the process to exit
  pyshell.end(function (err, code, signal) {
    if (err) throw err;
    logger.warn('irrigationController.py exit code was: ' + code);
    logger.warn('irrigationController.py exit signal was: ' + signal);
    logger.warn('finished irrigation');
  });
}





// restore CronJobs from irrigationPlans in DB on (re)boot
async function restoreCronJobs() {
  logger.info("Restoring CronJobs for irrigationPlans")
  try {
    // get all irrigationPlans from db
    let plans = await db.getAllEntities("irrigationPlans");

    // get all planXChannel (valves)
    var pcMap = new Map();
    let pXC = await db.getAllEntities("planXChannel");
    pXC.forEach(x => {
      if (!pcMap.has(x.planID)) {
        pcMap.set(x.planID, []);
      }
      pcMap.get(x.planID).push(x.channelID);
    });

    //logger.info(pcMap)

    // create CronJob for each plan
    plans.forEach(plan => {
      let valvesString = pcMap.get(plan.planID).join('+');
      cron.createJobsFromIrrigationPlan(plan, valvesString, runIrrigation);
    });
  } catch (error) {
    logger.error(error);
  }
}





// INITIALIZATION

// show log level
logger.error('0') 
logger.warn('1') 
logger.info('2') 
logger.http('3') 
logger.verbose('4') 
logger.debug('5')  
logger.silly('6') 

// create a CronJob that runs the sensor.py every minute
cron.createJobForHumiditySensor('0 * * * * *', runSensor);

// restore all CronJobs from saved irrigationPlans
restoreCronJobs();






// START SERVER

app.use(express.urlencoded({ extended: false }));

app.use(express.json());

server.listen(port, error => {

  if (error) {

    logger.error('Something went wrong ', error);

  } else {

    logger.http('Server is listening on port ' + port);

  }

})