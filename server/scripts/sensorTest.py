#!/usr/bin/python
 
#import spidev
import os
import random
import subprocess
import time
import statistics
import sqlite3

# delay between measurements in session
delay = 0.2
# delay between measurements posted into database
sessionDelay = 60 #default: 600 (10 minutes)

# values under minThreshold are not representative and therefore filtered
minThreshold = 273 #100% humidity
maxThreshold = 1023 #0% humidity

# spidev
#spi = spidev.SpiDev()
#spi.open(0,0)
#spi.max_speed_hz=1000000
 
def readChannel(channel):
  #val = spi.xfer2([1,(8+channel)<<4,0])
  data = random.randint(minThreshold, maxThreshold)
  #data = ((val[1]&3) << 8) + val[2]
  return data

def convertToPercentage(value):
  percentage = abs((value - maxThreshold) / (minThreshold - maxThreshold)) * 100
  return int(round(percentage, 0))

def insertIntoDb(humidity):
  connection = sqlite3.connect("database.db")
  cursor = connection.cursor()

  sql = "INSERT INTO sensorLog(value) VALUES(" + str(humidity) + ")"
  cursor.execute(sql)
  connection.commit()

  connection.close()


if __name__ == "__main__":

  try:

      ## sensor data array
      measurements = []
      print("★ Starting humidity measurement")

      while (len(measurements) <= 10):
        # get sensor data
        val = readChannel(0)

        # filter invalid values
        if (val > minThreshold):
          # if data is valid, append
          measurements.append(val)
          print("★ Sensor measurement " + str(len(measurements)) + ": " + str(val))

        # wait time between next measurement
        time.sleep(delay)

      # calculate median
      median = statistics.median(measurements)
      print("★ Median of measurements: " + str(median))

      # convert to percent
      humidityPercentage = convertToPercentage(median)
      print("★ Humidity: " + str(humidityPercentage) + "%")

      # save to db
      insertIntoDb(humidityPercentage)
      print("★ Humidity saved to DB")

      # print("★ Measurement session complete. Next measurement in " + str(sessionDelay/60) + " minutes")
      # time.sleep(sessionDelay)


  except KeyboardInterrupt:
    print ("★ sensor.py closed")
