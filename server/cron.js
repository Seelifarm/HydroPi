const CronJobManager = require('cron-job-manager');

manager = new CronJobManager();


function createJobsFromIrrigationPlan(plan, valvesString, runIrrigation) {

  // contains CronJob time as String '* * * * * *'
  const weekdays = [plan.monday, plan.tuesday, plan.wednesday, plan.thursday, plan.friday, plan.saturday, plan.sunday];
  // contains the irrigation duration as Number in seconds
  const durations = [plan.monDuration, plan.tueDuration, plan.wedDuration, plan.thuDuration, plan.friDuration, plan.satDuration, plan.sunDuration];

  weekdays.forEach(function (day, index) {
    //if != null 
    if (day) {

      // each day need it's own cronID, since CronJobs are scheduled separately by day
      const cronID = composeCronID(plan.planID, index);

      // setup CronJob
      manager.add(cronID, day, function () {
        console.info(`STARTING CronJob: ${cronID} (Time: '${day}', Valves: ${valvesString}, Duration: ${durations[index]})`);
        runIrrigation(valvesString, durations[index]);
      })

      // schedule CronJob
      manager.start(cronID);
      console.info(`Scheduled CronJob: ${cronID} (Time: '${day}', Valves: ${valvesString}, Duration: ${durations[index]})`);
      //console.log(`Current jobs: ${manager}`);
    }
  });
}


function deleteJobsFromIrrigationPlan(plan) {

  // contains CronJob time as String '* * * * * *'
  const weekdays = [plan.monday, plan.tuesday, plan.wednesday, plan.thursday, plan.friday, plan.saturday, plan.sunday];

  weekdays.forEach(function (day, index) {
    //if != null
    if (day) {

      // each day need it's own cronID, since CronJobs are scheduled separately by day
      const cronID = composeCronID(plan.planID, index);

      // remove CronJob
      manager.deleteJob(cronID)
      console.info(`Deleted CronJob: ${cronID}`);
    }
  });
}


function updateJobsFromIrrigationPlan(plan, valvesString, runIrrigation) {

  // contains CronJob time as String '* * * * * *'
  const weekdays = [plan.monday, plan.tuesday, plan.wednesday, plan.thursday, plan.friday, plan.saturday, plan.sunday];
  // contains the irrigation duration as Number in seconds
  const durations = [plan.monDuration, plan.tueDuration, plan.wedDuration, plan.thuDuration, plan.friDuration, plan.satDuration, plan.sunDuration];

  weekdays.forEach(function (day, index) {

    // each day need it's own cronID, since CronJobs are scheduled separately by day
    const cronID = composeCronID(plan.planID, index);

    //if != null 
    if (day) {

      // if CronJob already exists, update
      if (manager.exists(cronID)) {
        manager.update(cronID, durations[index])
        console.info(`Updated CronJob: ${cronID} (Time: '${day}', Valves: ${valvesString}, Duration: ${durations[index]})`);


        // else create new CronJob    
      } else {
        // setup CronJob
        manager.add(cronID, day, function () {
          console.info(`STARTING CronJob: ${cronID} (Time: '${day}', Valves: ${valvesString}, Duration: ${durations[index]})`);
          runIrrigation(valvesString, durations[index]);
        })

        // schedule CronJob
        manager.start(cronID);
        console.info(`Scheduled CronJob: ${cronID} (Time: '${day}', Valves: ${valvesString}, Duration: ${durations[index]})`);
      }
      // else if == null    
    } else {
      // if existed before, delete
      if (manager.exists(cronID)) {
        manager.deleteJob(cronID)
        console.info(`Deleted CronJob: ${cronID}`);
      }

    }
  });
}


// the ID is composed with the planID + "-Day" (by index) e.g "1-Mon", "1-Tue"...
function composeCronID(planID, index) {

  let cronID = planID;

  switch (index) {
    case 0:
      cronID += "-Mon";
      break;
    case 1:
      cronID += "-Tue";
      break;
    case 2:
      cronID += "-Wed";
      break;
    case 3:
      cronID += "-Thu";
      break;
    case 4:
      cronID += "-Fri";
      break;
    case 5:
      cronID += "-Sat";
      break;
    case 6:
      cronID += "-Sun";
      break;
    default:
      console.error("Invalid index, can't compose cronID");
      break;
  }

  return cronID;
}


function createJobForHumiditySensor(cronTime, runSensor) {

  manager.add('humiditySensor', cronTime, runSensor)

  manager.start('humiditySensor')
}


module.exports = {
  createJobsFromIrrigationPlan,
  deleteJobsFromIrrigationPlan,
  updateJobsFromIrrigationPlan,
  createJobForHumiditySensor
}




// combined method to avoid boilerplate, hard to read. still use?
/* async function scheduleCronForPlan(data, valvesString, action){

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
              runIrrigation(valvesString, duration)
            })
            manager.start(cronID);
            break;
          case "update":
            manager.update(cronID, day, function() {
              runIrrigation(valvesString, duration)
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
  } */