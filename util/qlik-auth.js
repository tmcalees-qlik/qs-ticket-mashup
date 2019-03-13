var https = require('https');
var cfg = require('./qlik-config');
var url = require('url');
var fs = require('fs');
var querystring = require("querystring");

module.exports = {
    // This module contains a single exported function named 'createTicket' that leverages the 
    // Qlik Sense /qps/ticket API to establish an authenticated channel between the mashup
    // application and the Qlik Sense server.
    createTicket: function(req, h, user, userDirectory, targetId) {

        var promise = new Promise(function(resolve, reject) {
           
            // Random value used to prevent cross-site scripting
            var XRFKEY = rand(16);

            // Configure parameters for the session request.  The
            // values for these parameters and be found in the 
            // config.js in the utils folder of the project.
            try {            
                var options = {
                    host: cfg.qlik.hostname,                                    // Qlik Sense hostname                    
                    port: cfg.qlik.qpsPort,                                     // Qlik Sense proxy service port
                    path: '/qps/ticket/ticket?xrfkey=' + XRFKEY,                // Path to Qlik Sense Proxy service ticket API
                    method: 'POST',                                             // HTTP method
                    headers: {
                        'X-qlik-xrfkey': XRFKEY,                                // HTTP header values
                        'Content-Type': 'application/json'
                    },
                    cert: fs.readFileSync(cfg.qlik.certificates.client),        // Qlik Sense SSL client certificate
                    key: fs.readFileSync(cfg.qlik.certificates.client_key),     // Qlik Sense SSL client certificate key
                    rejectUnauthorized: false,
                    agent: false
                };
            } catch (e) {
                console.log('Create Ticket: The following error has occured: ',e);
                reject('error', e);
            }

            console.log("Create Ticket: Request new Qlik Sense ticket ("+options.host.toString()+':'+options.port.toString()+options.path.toString()+")");
            
            //Send ticket request
            var ticketreq = https.request(options, function(ticketres) {
                console.log("Create Ticket: Status code return from Qlik Sense ticket request ("+ticketres.statusCode+")");

                ticketres.on('data', function(d) {
                    //Parse ticket response                                    
                    if (ticketres.statusCode != 201) {
                        var authError = {};
                        authError.message = "Create Ticket: Ticket create failed, invalid response code (" + ticketres.statusCode + ")";
                        authError.response = d.toString();
                        authError.ticket = options.path.toString();
                        authError.request = jsonrequest;                        
                        reject(authError);
                    } else {
                        // Get the ticket returned by Qlik Sense
                        var ticket = JSON.parse(d.toString());
                        console.log("Create Ticket: Ticket create succeeded, Qlik Sense reponse: ", d.toString());
                        resolve(ticket);                        
                    }
                });
            });

            //Send JSON request for ticket
            var jsonrequest = JSON.stringify({ 'userDirectory': userDirectory.toString(), 'UserId': user.toString(), 'Attributes': [], 'targetId': targetId.toString() });
            console.log("Create Ticket: JSON request sent to Qlik Sense: ", jsonrequest);

            ticketreq.write(jsonrequest);
            ticketreq.end();

            ticketreq.on('error', function(e) {
                console.log("Create Ticket: Error processing Qlik Sense ticket request (", e, ")");
                console.log('Error' + e);
                reject(e);
            });
        });
        return promise;
    }

};

//Supporting functions
function rand(length, current) {
    current = current ? current : '';
    return length ? rand(--length, "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz".charAt(Math.floor(Math.random() * 60)) + current) : current;
}