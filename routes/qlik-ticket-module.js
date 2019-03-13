const qlikAuth = require('../util/qlik-auth');
const appCache = require('../util/app-cache');

module.exports = [
    // Route for ticket id validation
    //
    // This route is called whenever Qlik Sense needs to validate a ticket identifier.  The ticket
    // id passed in the URI will be looked up in the hapi server cache.  If the session id is found,
    // the session ticket JSON is returned, otherwise ...
    //
    // TODO: Research the appropriate return for an invalid session id
    {
        method: 'GET',
        path: '/ticket-auth',
        handler: async function (request, h) {
            console.log('GET [/ticket-auth]: Ticket authorization request from Qlik Sense');
            var targetId = request.query.targetId;
            var proxyRestUri = request.query.proxyRestUri;                        
                
            console.log('GET [/ticket-auth]: targetId ('+ targetId + ') proxyRestUri ('+ proxyRestUri +')');                           
            
            return h.redirect('/login-ticket?targetId='+targetId);
        }
    }
];