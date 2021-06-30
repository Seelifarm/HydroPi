![HydroPi Logo](/server/app/resources/img/HP_Logo.png)
# HydroPi - Smarthome Bewässerung
This is a program for [Raspberry Pi](https://www.raspberrypi.org/) that enables the user to control valves via a web interface and create automated irrigation plans. <br>
Based on [Python](https://www.python.org/), JavaScript, HTML and CSS.

Attention: This repo is for DIY lovers and by far not a single-click application for your smart home gadget.

<br> 
Includes [NodeJS](https://nodejs.org/en/), [Express](https://expressjs.com/de/), [Knex.js](https://knexjs.org/), [Socket.io](https://socket.io/) and [SQLite3](https://www.sqlite.org/index.html). 
<br> 
<br>
created by @Seelifarm @B4ttlestriker @kv021 @Kohai-san


## Requirements
- Raspberry Pi (3 or newer)
  - Raspian or other similar Linux OS
  - Connection to the router
  - Installed Python3 `sudo apt install python3`
  - You should be the root user / admin
- Up to 3 (right now hard coded because of our relay limitation) 12V magnetic valves (or other 12V gadgets) connected to a relay (addressable by GPIO)
- humidity sensor connected on a MCP3008 to change from a analogue signal


## Installation Guide
* Clone the [HydroPi](https://github.com/Seelifarm/HydroPi) repository on your RaspberryPi (recommended via HTTP).
* Open Terminal and navigate to `PathToFolder/HydroPi/server/scripts/` and type `sudo python3 boot.py` to launch the installer.
* It will take some minutes to install all modules.
* Server will start running after its installation.
* Visit `localhost` on your browser (Chrome recommended).

## Controlls
* `sudo python3 PathToFolder/HydroPi/server/scripts/boot.py` - Start the server as intended.
* `Controll+C` - Stop the NodeJS server.


## Information
* Backend Logic at `app.js`
* Modules management at `boot.py`
* Valve Interface at `irrigationController.py`
* Sensor Logic at `sensor.py`


## Road Map for future updates
* Additional functionalities at the website (rename, additional sensors and valves)
  * rename functions
  * weather api implementation
  * customizable amount of sensors and valves
  * Design update
  * DB update
* Code Clean Up
  * More in-line comments
* Usage of frontend libraries
