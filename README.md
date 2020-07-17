# Readme
The configuration steps below assume you are running this code on a Qlik Sense Enterprise for Windows server.  While you can certainly run this code on a seperate computer, you will need to export the certificates, move them to the computer running this project, and adjust any of the URLs referring to *localhost*.

# Qlik Sense Configuration
1.	Create a new virtual proxy with the prefix of *ticket*
      *	Name it something like *Ticket Authentication*
      * Make sure you create a unique Session cookie header name, I suggest appending *-Ticket* to the default
      * If you like, you can add the URL http://localhost:1234/login as the Authentication module redirect URI.  This will redirect unauthenticated users that attempt to access Qlik Sense via this virtual proxy path to the URI you provide (for authentication).
      * Add the unqualified *<QSE server name>* and *localhost* to the Host white list.
      * Link the newly created virtual proxy to the Central Proxy service.
2.	Check the *Enable HTTP* box in Central Proxy edit screen.
3.	Add the file *redirect-ticket.html* to the Default content library.  The file is shipped with this project in the *{root}/qse* folder.
4.	Import the app *Demo.qvf* into your QSE environment.  The file is shipped with this project in the *{root}/qse* folder.
5.	Create some local Windows users in your QSE environment (if needed) and allocate them a license

# Project Configuration
Steps 1-7 listed below are specific to how I run the project. You can use whatever development, GitHub and runtime environment you like.  
1.	Install Visual Studio Code
2.	Install Node.js
3.	Install Git
4.	Clone the following GitHub repository to your local machine:
https://github.com/tmcalees-qlik/qs-ticket-mashup.git
5.	Open the qs-ticket-mashup folder in Visual Studio Code
6.	In the Terminal window type npm install
7.	You will need to edit the code in the following files: 
      * iframe-integration.html ({root}/templates) 
      * app-session.js ({root}/static/client/javascript) 
These files contain Qlik Sense application IDs and object IDs that will need to be replaced with values from your imported Demo.qvf application (you can use Dev Hub to obtain the values).  You can also update the capability-api-1.html, capability-api-2.html, and capability-api-3.html files if you want the sample code to match the actual running code. 
8.	In the Debug panel click to launch the program.  If you don’t have a launch.json entry, create one with a “program”: “${workspaceFolder}/server.js” entry.


Once the server is running, you can access the login page using the URL http://localhost:1234/login.  You do not need to enter a password, as no actual password check is implemented in this code; however, you do need to enter a valid user identifier that has been granted a license in your environment.  You also need to enter a valid directory name.  In a default installation, this will be the name of your server.
#Project Setup (qs-ticket-mashup)
