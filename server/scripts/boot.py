#! /usr/bin/env python
# /etc/init.d/boot.py

### BEGIN INIT INFO

# Provides:          boot.py

# Required-Start:    $remote_fs $syslog

# Required-Stop:     $remote_fs $syslog

# Default-Start:     2 3 4 5

# Default-Stop:      0 1 6

# Short-Description: Start daemon at boot time

# Description:       Enable service provided by daemon.

### END INIT INFO
import os, sys, sqlite3, sys, subprocess, time
from os.path import abspath

pathname = abspath('../app.js')
pathname2 = abspath('../')
#pathname3 = abspath('sensor.py')
#pathname4 = abspath('startSensor.sh')

# Does db exist?
if os.path.exists("database.db"):
    subprocess.run(['clear'], shell=True)
    print("★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★.")
    print("★★★★★★★★★★Welcome to HydroPi★★★★★★★★★★★.")
    print("★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★.")
    print("★")
    print("★")
    print("★")
    print("★ Found existing db!")
    print("★")
    print("★ Starting server ...")
    time.sleep(2)
    #subprocess.run(['sudo bash ' + pathname4], shell=True)
    subprocess.run(['sudo node ' + pathname], shell=True)
else:
    # Connect to new db
    connection = sqlite3.connect("database.db")

    # get a cursor to navigate
    cursor = connection.cursor()

    # generate tables
    sql = "CREATE TABLE channels(" \
          "channelID INTEGER PRIMARY KEY, " \
          "name TEXT NOT NULL, " \
          "active INTEGER)"
    cursor.execute(sql)

    sql2 = "CREATE TABLE sensorLog(" \
          "logTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP PRIMARY KEY, " \
          "value INTEGER)"
    cursor.execute(sql2)

    sql3 = "CREATE TABLE irrigationPlans(" \
          "planID INTEGER PRIMARY KEY, " \
          "planName TEXT, " \
          "monday TEXT, " \
          "monDuration INTEGER," \
          "tuesday TEXT, " \
          "tueDuration INTEGER," \
          "wednesday TEXT, " \
          "wedDuration INTEGER," \
          "thursday TEXT, " \
          "thuDuration INTEGER," \
          "friday TEXT, " \
          "friDuration INTEGER," \
          "saturday TEXT, " \
          "satDuration INTEGER," \
          "sunday TEXT, " \
          "sunDuration INTEGER)"
    cursor.execute(sql3)

    sql4 = "CREATE TABLE irrigationLog(" \
          "logID INTEGER PRIMARY KEY, " \
          "logTimeStart TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL, " \
          "logTimeEnd TIMESTAMP DEFAULT CURRENT_TIMESTAMP)"
    cursor.execute(sql4)

    sql5 = "CREATE TABLE planXChannel(" \
          "channelID INTEGER," \
          "planID INTEGER," \
          "FOREIGN KEY(channelID) REFERENCES channels(channelID), " \
          "FOREIGN KEY(planID) REFERENCES irrigationPlans(planID))"
    cursor.execute(sql5)

    print("Preparing HydroPi for your RaspberryPi ...")
    subprocess.run(['sudo apt install nodejs'], shell=True)
    subprocess.run(['sudo apt install npm'], shell=True)
    subprocess.run(['sudo raspi-config nonint do_spi 0'], shell=True)
    subprocess.run(['sudo python3 setupSpidev.py install'], shell=True)

    print("Preparing modules ... ")
    subprocess.run(['sudo npm install --prefix ' + pathname2 + ' express'], shell=True)
    subprocess.run(['sudo npm install --prefix ' + pathname2 + ' socket.io'], shell=True)
    subprocess.run(['sudo npm install --prefix ' + pathname2 + ' cron-job-manager'], shell=True)
    subprocess.run(['sudo npm install --prefix ' + pathname2 + ' node-cron'], shell=True)
    subprocess.run(['sudo npm install --prefix ' + pathname2 + ' python-shell'], shell=True)
    subprocess.run(['sudo npm install --prefix ' + pathname2 + ' sqlite3'], shell=True)
    subprocess.run(['sudo npm install --prefix ' + pathname2 + ' knex'], shell=True)

    print("Done installing modules.")
    time.sleep(2)
    subprocess.run(['clear'], shell=True)
    inputs = 0
    print("★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★.")
    print("★★★★★★★★★★Welcome to HydroPi★★★★★★★★★★★.")
    print("★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★.")
    print("★")
    print("★")
    print("★")
    print("★")
    print("★ How many gadgets would you like to connect?")
    print("★")
    inputs = input("★ Enter your amount(1-3): ")
    print("★")
    print("★ You successfully connected " + inputs + " gadgets.")
    print("★")
    countName = 1  
    for x in range(int(inputs)):
        # Datensatz erzeugen
        sql6 = "INSERT INTO channels(name, active) VALUES(" + str(countName) + ", 0)"
        cursor.execute(sql6)
        connection.commit()
        countName += 1
    print("★ Prepared the database.")
    print("★ ")
    print("★ Starting NodeJS server ...")
    #subprocess.run(['sudo bash ' + pathname4], shell=True)
    subprocess.run(['sudo node ' + pathname], shell=True)


    # Verbindung beenden
    connection.close()
