import os, sys, sqlite3, sys, subprocess, time
from os.path import abspath
filename = abspath('../app.js')
print(filename)





# directory = os.path.HydroPi(__file__)
# filename = os.path.join(directory, '/server/scripts/')
# Existenz feststellen
if os.path.exists("database.db"):
    print("Found existing db")
    sys.exit(0)
else:
    print("Installing HydroPi for your RaspberryPi ...")
    subprocess.run(['sudo apt install nodejs'], shell=True)
    subprocess.run(['sudo apt install npm'], shell=True)
    print("Preparing modules ... ")
    subprocess.run(['sudo npm install express'], shell=True)
    subprocess.run(['sudo npm install socket.io'], shell=True)
    subprocess.run(['sudo npm install cron-job-manager'], shell=True)
    subprocess.run(['sudo npm install node-cron'], shell=True)
    subprocess.run(['sudo npm install python-shell'], shell=True)


# Verbindung zur Datenbank erzeugen
connection = sqlite3.connect("databse.db")

# Datensatz-Cursor erzeugen
cursor = connection.cursor()

# Datenbanktabelle erzeugen
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
      "monday TIMESTAMP DEFAULT CURRENT_TIMESTAMP, " \
      "monDuration INTEGER," \
      "tuesday TIMESTAMP DEFAULT CURRENT_TIMESTAMP, " \
      "tueDuration INTEGER," \
      "wednesday TIMESTAMP DEFAULT CURRENT_TIMESTAMP, " \
      "wedDuration INTEGER," \
      "thursday TIMESTAMP DEFAULT CURRENT_TIMESTAMP, " \
      "thuDuration INTEGER," \
      "friday TIMESTAMP DEFAULT CURRENT_TIMESTAMP, " \
      "friDuration INTEGER," \
      "saturday TIMESTAMP DEFAULT CURRENT_TIMESTAMP, " \
      "satDuration INTEGER," \
      "sunday TIMESTAMP DEFAULT CURRENT_TIMESTAMP, " \
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


# Datensatz erzeugen
sql6 = "INSERT INTO channels VALUES('new', 0)"
cursor.execute(sql6)
connection.commit()

# # Datensatz erzeugen
# sql = "INSERT INTO personen VALUES('Schmitz', " \
#       "'Peter', 81343, 3750, '12.04.1958')"
# cursor.execute(sql)
# connection.commit()
#
# # Datensatz erzeugen
# sql = "INSERT INTO personen VALUES('Mertens', " \
#       "'Julia', 2297, 3621.5, '30.12.1959')"
# cursor.execute(sql)
# connection.commit()

# Verbindung beenden
connection.close()