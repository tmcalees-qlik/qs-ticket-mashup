# Readme
The configuration steps below assume you are running this code on a Qlik Sense Enterprise for Windows server.  You can run this code on a seperate computer, but you will need to copy certificates from the Qlik Sense server, make edits to the *{root}/util/qlik-config.js* file, and update any URLs referring to *localhost* (these changes are not detailed in this readme).

# Qlik Sense Configuration
1.	Create a new virtual proxy with the prefix of *ticket*
      *	Name it something like *Ticket Authentication*
      * Make sure you create a unique Session cookie header name, I suggest appending *-Ticket* to the default
      * If you like, you can add the URL http://localhost:1234/login as the Authentication module redirect URI.  This will redirect unauthenticated users that attempt to access Qlik Sense via this virtual proxy path to the URI you provide (for authentication).
      * Add the unqualified *server name* and *localhost* to the Host white list.
      * Link the newly created virtual proxy to the Central Proxy service.
      * Since I run this project on the Qlik Sense Server, I add *localhost:1234* (in addition to any other entries needed) to the Virtual Proxy Whitelist and *Access-Control-Allow-Origin:http://localhost:1234* to the Additional response headers.
2.	Check the *Enable HTTP* box in Central Proxy edit screen.
3.	Add the file *redirect-ticket.html* to the Default content library.  The file is shipped with this project in the *{root}/qse* folder.
4.	Import the app *Demo.qvf* into your QSE environment.  The file is shipped with this project in the *{root}/qse* folder.
5.	Create some local Windows users in your QSE environment (if needed) and allocate them a license

# Tooling Configuration
1.	Install Visual Studio Code
2.	Install Node.js
3.	Install Git
4.	Clone the following GitHub repository to your local machine:
      * https://github.com/tmcalees-qlik/qs-ticket-mashup.git
5.	Open the *qs-ticket-mashup* folder in Visual Studio Code

# Project Configuration
1.	In the Visual Studio Code Terminal window type *npm install* (this will download and install the project dependencies)
2.	You will need to edit references to Qlik Sense application and object identifiers in the following files: 
      * iframe-integration.html ({root}/templates) 
         * Line 12 contains the documentation that is displayed in the application.  Update the iframe *appid* with the *appid* from the imported *Demo.qvf* application.
         * Line 17 contains the actual iframe tag.  Update the iframe *appid* with the *appid* from the imported *Demo.qvf* application.
         * For both of the updates above, you will need to ensure the URL to your server is correct and contains the path of your virtual proxy immediately following the server name.
      * app-session.js ({root}/static/client/javascript) 

> These files contain Qlik Sense application IDs and object IDs that will need to be replaced with values from your imported Demo.qvf application (you can use Dev Hub to obtain the values).  You can also update the capability-api-1.html, capability-api-2.html, and capability-api-3.html files if you want the sample code to match the actual running code. 

# Run
1.	In the Visual Studio Code Debug panel, click the green arrow to launch the debugger and run the authentication module.  If you don’t have a launch.json entry for Node.js, you'll need to create one.  Here is what my launch.json file looks like:

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
