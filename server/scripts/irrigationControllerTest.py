# ! /usr/bin/python

#import RPi.GPIO as GPIO
import time
import argparse
import sys
import sqlite3


# Arguments
parser = argparse.ArgumentParser(description='Plant watering')
parser.add_argument("--c", required=True, type=str, choices=["1", "2", "3", "1+2", "1+3", "2+3"],
                    help="This string decides which Relay Channel(s) are opened")
parser.add_argument("--d", required=True, type=int,
                    help="This int decides for how many seconds the Relay Channel(s) are opened")

args = parser.parse_args()
channel = args.c
duration = args.d

#print("Channel(s) " + channel + " watering for " + duration + " seconds")

# Relay Channels
Relay_Ch1 = 26
Relay_Ch2 = 20
Relay_Ch3 = 21

#DB Connection
connection = sqlite3.connect("database.db")
cursor = connection.cursor()

#GPIO.setwarnings(False)
#GPIO.setmode(GPIO.BCM)

#GPIO.setup(Relay_Ch1, GPIO.OUT)
#GPIO.setup(Relay_Ch2, GPIO.OUT)
#GPIO.setup(Relay_Ch3, GPIO.OUT)

print("★ Relay Module is set up")

# Logic
try:
    if "1" in channel:
        #GPIO.output(Relay_Ch1, GPIO.LOW)
        sql = "UPDATE channels SET active = 1 WHERE channelID = 1"
        cursor.execute(sql)
        connection.commit()
        print("★ Channel 1 opened")

    if "2" in channel:
        #GPIO.output(Relay_Ch2, GPIO.LOW)
        sql = "UPDATE channels SET active = 1 WHERE channelID = 2"
        cursor.execute(sql)
        connection.commit()
        print("★ Channel 2 opened")

    if "3" in channel:
        #GPIO.output(Relay_Ch3, GPIO.LOW)
        sql = "UPDATE channels SET active = 1 WHERE channelID = 3"
        cursor.execute(sql)
        connection.commit()
        print("★ Channel 3 opened")

    time.sleep(duration)

    if "1" in channel:
        #GPIO.output(Relay_Ch1, GPIO.HIGH)
        sql = "UPDATE channels SET active = 0 WHERE channelID = 1"
        cursor.execute(sql)
        connection.commit()
        print("★ Channel 1 closed")

    if "2" in channel:
        #GPIO.output(Relay_Ch2, GPIO.HIGH)
        sql = "UPDATE channels SET active = 0 WHERE channelID = 2"
        cursor.execute(sql)
        connection.commit()
        print("★ Channel 2 closed")

    if "3" in channel:
        #GPIO.output(Relay_Ch3, GPIO.HIGH)
        sql = "UPDATE channels SET active = 0 WHERE channelID = 3"
        cursor.execute(sql)
        connection.commit()
        print("★ Channel 3 closed")
     
     
    connection.close()
     
except:
    print("★ except")
    #GPIO.cleanup()
