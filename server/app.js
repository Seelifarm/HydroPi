"use strict"

const http = require('http')
const express = require('express')
const fs = require('fs')
const path = require('path')
const port = 80
const app = express()


var htmlPath = path.join(__dirname, 'app')

app.use(express.static(htmlPath))

var server = http.createServer(app)

server.listen(port, error => {
    if (error) {
        console.log('Something went wrong ', error)
    } else {
        console.log('Server is listening on port ' + port)
    }
})


/*
const server = http.createServer(function(req, res) {
    console.log(__dirname)
    fs.readFile('html/index.html', function(error,data){
        if (error) {
            res.writeHead(404)
            res.write('Error: File not found')
        } else {
            res.write(data)
        }
        res.end()
    })
})

server.listen(port, error => {
    if (error) {
        console.log('Something went wrong ', error)
    } else {
        console.log('Server is listening on port ' + port)
    }
})
*/