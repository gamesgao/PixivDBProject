#!/usr/bin/env node

/**
 * Module dependencies.
 */

var app = require('./app');
var http = require('http');
var db = require('./mongoDB')
var NN = require('./dataProcess');
NN.init();
/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Create socket.io server.
 */

var io = require('socket.io')(server);

/**
 * Bind connection event.
 */

io.on('connection', function(socket) {
    console.log('a user connected');
    socket.on('disconnect', function() {
        console.log('user disconnected');
    });

    socket.on('senddata', function(jsonString) {
        console.log('receive data...');
        // console.log(jsonString);
        try {
            data = JSON.parse(jsonString);
            console.log(data);
            if (data.LOT != undefined && data.LAT != undefined && data.PM != undefined && data.TIME != undefined) {
                db.insert(data);
            } else {
                console.log("receive error data!");
            }
        } catch (err) {
            console.log(err);
        }
    })

    socket.on('requireData', function(index) {
        console.log('requiring data~~~');
        var Data = [];
        var speed = 50;
        db.find({}, index * speed, speed, function(err, result) {
            // console.log(result);
            // console.log(index);
            if (result == undefined) {
                console.log('Error');
            } else if (result.length == 0) {
                console.log('Load finished');
            } else {
                result.forEach(function(e) {
                        if (e.LOT != undefined && e.LAT != undefined && e.PM != undefined && e.TIME != undefined) {
                            // console.log(e.LOT);
                            Data.push({
                                "type": "Feature",
                                "geometry": {
                                    "type": "Point",
                            "coordinates": [e.LOT+Math.random()*0.0001, e.LAT+Math.random()*0.0001]
                                },
                                "properties": {
                                    "size": e.PM,
                                    "description": '<strong>PM2.5</strong><p>LOT:' + e.LOT.toString() + '</p><p>LAT:' + e.LAT.toString() + '</p><p>time:' + Date(e.TIME).toString() + '</p><p>PM2.5:'+ e.PM.toString() + '</p>'
                                }
                            })
                        }
                    })
                    // console.log(Data);

                socket.emit('dataArrive', JSON.stringify(Data));
            }
        });
    })
});

server.listen(port);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}


module.exports = server;
