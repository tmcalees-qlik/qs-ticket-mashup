# Readme
The configuration steps below assume you are running this code on a Qlik Sense Enterprise for Windows server.  You can run this code on a seperate computer, but you will need to copy certificates from the Qlik Sense server, make edits to the *{root}/util/qlik-config.js* file, and update any URLs referring to *localhost* (these changes are not detailed in this readme).

# Qlik Sense Configuration
1.   Make sure the *Enable HTTP* box is checked in the Central Proxy.  We will not be using SSL for this mashup to simplify the coding.
2.	Create a new virtual proxy (expand/include all of the properties sections in the QMC)
      * Name it something like *Ticket Authentication*
      * Enter *ticket* for the prefix (this is used in the URL path to determine which virtual proxy is used to authenticate a request)
      * Make sure you create a unique Session cookie header name, I suggest appending *-Ticket* to the default value
      * Add http://localhost:1234/login as the Authentication module redirect URI.  This will redirect unauthenticated users that attempt to access Qlik Sense via this virtual proxy path to the URI you provided.
      * Add the unqualified *server name*, *localhost*, and *localhost:1234* to the Host white list.
      * Link the newly created virtual proxy to the Central Proxy service.
      * Add *Access-Control-Allow-Origin:http://localhost:1234* to the Additional response headers.  This is required by the mashup to prevent CORS related errors.2.	
3.	Add the file *redirect-ticket.html* to the Default content library.  The file is shipped with this project in the *{root}/qse* folder. 
4.	Import the app *Demo.qvf* into your QSE environment and publish it to the *Everyone* Stream.  The app is shipped with this project in the *{root}/qse* folder.
5.	Create some local Windows users in your QSE environment (if needed) and allocate them a Qlik Sense license.

# Tooling Configuration
1.	Install Visual Studio Code
2.	Install Node.js
3.	Install Git
4.	Clone the following GitHub repository to your local machine:
      * https://github.com/tmcalees-qlik/qs-ticket-mashup.git
5.	Open the *qs-ticket-mashup* folder in Visual Studio Code

# Project Configuration
1.	In the Visual Studio Code Terminal window type *npm install* (this will download and install the project dependencies)
2.	You will need to edit references to the Qlik Sense application identifier in the following files (Qlik Sense generates a new application identifier each time an application is created or imported): 
      * {root}/templates/iframe-integration.html          
      * {root}/static/client/javascript/app-session.js 

> These files contain references to the Qlik Sense application ID.  Each reference to an application ID needs to be replaced with the new application ID from your imported Demo.qvf application.  You can also update the capability-api-1.html, capability-api-2.html, and capability-api-3.html files, but the application ID references in these files are only displayed for documentation purposes and aren't referenced by the actual running code. 

# Run
1.	In the Visual Studio Code Debug panel, click the green arrow to launch the debugger and run the authentication module.  If you don’t have a launch.json entry for Node.js, you'll need to create one.  Here is a sample *launch.json* file for running a Node.JS application:

```
{
    // Use IntelliSense to learn about possible attributes.
    // Hover to view descriptions of existing attributes.
    // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
    "version": "0.2.0",
    "configurations": [
        {
            "type": "node",
            "request": "launch",
            "name": "Launch Program",
            "program": "${workspaceFolder}/server.js"
        }
    ]
}
```


Once the server is running, you can access the login page using the URL http://localhost:1234/login.  You do not need to enter a password, as no actual password check is implemented in this code; however, you do need to enter a valid *username* and *directory* for a user that has been granted a license in your environment.  

#  Notes
> * Make sure you are consistent with the DNS name used to access the Qlik Sense Server.  For example, if you are running this app on the server and access the server using *localhost* when authenticating, make sure you use *localhost* in the Single Configurator URI rather than the server name (ex. *qlikserver*).  If you see a login prompt in the Single Configurator iFrame, this may be the issue.
