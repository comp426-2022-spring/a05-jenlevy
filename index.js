// Place your server entry point code here
//from server.js in a04

//express
const express = require('express')
const app = express()
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('./public'));
//morgan
const morgan = require('morgan')
/*/ Use morgan for logging, use the command npx nodemon server.js

app.use(morgan('tiny'))
app.use(morgan('combined'))
app.use(morgan('common'))
app.use(morgan('short'))
app.use(morgan('dev'))

/*/
/*/example from class

app.use(fs.writeFile('./access.log', data,
{flag: 'a'}, (err, req, res, next) => {
    if(err){
        console.error(err)
    } else {
        console.log()
    }
}
)

)

/*/
const fs = require('fs')
const db = require('./src/services/database.js');
const Database = require('better-sqlite3');

// Store help text 
const helpText = (`
server.js [options]

--port	Set the port number for the server to listen on. Must be an integer
            between 1 and 65535.

--debug	If set to true, creates endlpoints /app/log/access/ which returns
            a JSON access log from the database and /app/error which throws 
            an error with the message "Error test successful." Defaults to 
            false.

--log		If set to false, no log files are written. Defaults to true.
            Logs are always written to database.

--help	Return this message and exit.
`)
const args = require('minimist')(process.argv.slice(2))
args["port", "debug", "log", "help"]
const port = args.port || 5000 || process.env.PORT
const debug = args.debug
const log = args.log
const help = args.help

console.log(args)


if (help === true ){
    console.log(helpText)
    process.exit(0)
}

const server = app.listen(port, () => {
    console.log('App listening on port %PORT%'.replace('%PORT%',port))
});

// one random coin flip
function coinFlip() {
    let flip = Math.random()
    var result = ""
    if (flip > 0.5){
      result = "heads"
    } else {
      result = "tails"
    }
    return result
}

//many random coin flips
function coinFlips(flips) {
    var flipArray = new Array(flips)

    for(var i = 0; i<flips; i++){
    var flip = Math.random()
    if (flip<0.5){
        flipArray[i] = "heads"
    } else {
        flipArray[i] = "tails"
    }
}
return flipArray

}

// flip a coin with a call to see if it matches the call
function flipACoin(call) {

    var result = ""
    var flip = ""
    var num = Math.random()
        
    if (num < 0.5){
        flip = "heads"
    } else {
        flip = "tails"
    }
        
    if (flip == call){
        result = "win"
    } else {
        result = "lose"
    }
        
    return {"call": call, "flip": flip, "result": result}
}

// an array that tallies the random coin flips
function countFlips(array) {
    
    var heads = 0
    var tails = 0
            
    for (var i = 0; i<array.length; i++){
        if (array[i] == "heads"){
            heads += 1
        } else{
            tails += 1
        }
    }
    return {"heads" : heads, "tails": tails}
}

app.use((req, res, next) => {
    // Your middleware goes here.
    let logdata = {
        remoteaddr: req.ip,
        remoteuser: req.user,
        time: Date.now(),
        method: req.method,
        url: req.url,
        protocol: req.protocol,
        httpversion: req.httpVersion,
        status: res.statusCode,
        referer: req.headers['referer'],
        useragent: req.headers['user-agent']
    }
    const stmt = db.prepare(`INSERT INTO accesslog (remoteaddr, remoteuser, time, method, url, protocol, httpversion, status, referer, useragent) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
    const info = stmt.run(String(logdata.remoteaddr), String(logdata.remoteuser), String(logdata.time), 
    String(logdata.method), String(logdata.url), String(logdata.protocol), String(logdata.httpversion), 
    String(logdata.status), String(logdata.referer), String(logdata.useragent))
    
    next();
})

// READ (HTTP method GET) at root endpoint /app/
app.get("/app/", (req, res) => {
    res.json({"message":"Your API works! (200)"});
	res.status(200);
});


if (debug == true){
    try{
    app.get("/app/log/access", (req, res, next) => {
    const stmt = db.prepare('SELECT * FROM accesslog');
    const stmtAll = stmt.all();
    res.status(200).json(stmtAll)
    });
} catch (e) {
    console.error(e)
}

    app.get('/app/error', (req,res) => {
        throw new Error("Error test successful.")
    })

}

if (log == true){
    // Use morgan for logging to files
// Create a write stream to append (flags: 'a') to a file
const accessLogObj = fs.createWriteStream('./access.log', { flags: 'a' })
// Set up the access logging middleware
app.use(morgan("combined", { stream: accessLogObj }))
} else {
    app.use(morgan("combined"))
}


//flip endpoint (one flip)
app.get('/app/flip', (req, res) => {
    
    const result = coinFlip()
    res.status(200).json({"flip": result})

    });

//post flip
app.post('/app/flip/coins/', (req, res, next) => {
    const flips = coinFlips(req.body.number)
    const count = countFlips(flips)
    res.status(200).json({"raw":flips,"summary":count})
})

//flips endpoint (many flips)
app.get('/app/flips/:number', (req, res) => {
    
    const results = coinFlips(req.params.number)
    const summary = countFlips(results)
    res.status(200).json({"raw": results, "summary": summary})

    });
//post call
app.post('/app/flip/call/', (req, res, next) => {
    const game = flipACoin(req.body.guess)
    res.status(200).json(game)
})
//consolidating heads or tails flip
app.get('/app/flip/call/:guess(heads|tails)/', (req, res) => {
    const game = flipACoin(req.params.geuss)
    var resStatusCode = 200
    res.status(200).json(flipACoin("heads"))
    });

    //default error message
app.get('app/error/', (req,res) => {
    res.status(404).send("Error test successful.")
}
)


process.on('SIGTERM', () => {
    server.close(() => {
        console.log('Server stopped')
    })
})

