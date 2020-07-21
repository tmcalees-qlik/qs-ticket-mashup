const qlikAuth = require('../util/qlik-auth');
const appCache = require('../util/app-cache');

module.exports = [
    // Route for login page.
    //
    // This route does not leverage the 'session' auth configuration, so it can be
    // served to a non-authenticated user.  The login page uses the 'empty_layout'
    // template.
    {
        method: 'GET',
        path: '/login',
        handler: function (request, h) {
            console.log('GET [/login]: Render login.html');
            var targetId = request.query.targetId;

            return h.view('login.html',{PageTitle:'Login', targetId: targetId},{layout: 'empty_layout'});
        }
    },

    // Route for the login page postback.
    //
    // This route takes the parameters from the login form and performs an 
    // authentication check.  This is currently stubbed out and always return
    // true.
    {
        method: 'POST',
        path: '/login',        
        handler: async function (request, h) {            
            var user = request.payload.username;
            var pwd = request.payload.password;            
            var directory = request.payload.directory;  
            var targetId = request.payload.targetId;           
            console.log('POST [/login]: Authenticate login credentials [USER:'+user+', PASSWORD:'+pwd+', DIRECTORY:'+ directory+',TARGETID: '+targetId+']');            
                        
            // Establish the hapi cookieAuth session
            request.cookieAuth.set({sessionId});    

            console.log('POST [/login]: Create session identifier');
            var sessionId = appCache.createId();            
            var ticket = await qlikAuth.createTicket(request, h, user, directory, targetId);                                                                                  

            appCache.updateValue(sessionId, ticket);

            // This redirectUri is a little trick to establish the Qlik Sense ticket session cookie.  There are other ways to accomplish
            // this, but this is one of the easiest.  I have uploaded an html file to the Default content repository via the QMC.
            // This html file contains a redirect to the mashups main page (http://localhost:1234/view/index.html).  Because the 
            // content library is a secure resource and the Uri contains a valid qlikTicket, the proxy will establish the Ticket
            // cookie that will be used for the remainder of the session.
            var redirectUri;
            if (ticket.TargetUri == null) {
                redirectUri = 'http://localhost/ticket/content/Default/redirect-ticket.html'+'?qlikTicket='+ticket.Ticket;
            }            
             else {
                redirectUri = ticket.TargetUri+'?qlikTicket='+ticket.Ticket;
            }
            console.log('Route POST [/login-ticket]: Login successful, redirect to '+redirectUri);
            return h.redirect(redirectUri);
        }
    },

    // Route for  logout
    //
    // This route clears the hapi-session-ath cookie, clears the Qlik Sense session cookie
    // and removes the Qlik Sense session ticket from the cache.  The user will then be routed
    // to the login page.
    {
        method: 'GET',
        path: '/logout',
        options: {
            auth: 'session', 
            handler: async function (request, h) {
                console.log('GET [/logout]: Log out of mashup application');                                        
                
                var sessionId =  request.cookieAuth.request.auth.credentials.sessionId;
                if (sessionId)
                {
                    appCache.delete(request, h, sessionId,'MashupSession');
                }  

                return h.redirect('/login');
            }
        }                 
    }    
];