# Environment Setup (qs-ticket-mashup)

Steps 1-7 listed below are specific to how I run the project. You can use whatever development, GitHub and runtime environment you like.  
1.	Install Visual Studio Code
2.	Install Node.js
3.	Install Git
4.	Clone the following GitHub repository to your local machine:
https://github.com/tmcalees-qlik/qs-ticket-mashup.git
5.	Open the qs-ticket-mashup folder in Visual Studio Code
6.	In the Terminal window type npm install
7.	In the Debug panel click to launch the program.  If you don’t have a launch.json entry, create one with a “program”: “${workspaceFolder}/server.js” entry.
8.	Create some users in your QSE environment and allocate them a license
9.	Create a new virtual proxy with the prefix of ticket
a.	Name it something like Ticket Authentication
b.	Make sure you create a unique Session cookie header name, I suggest appending -Ticket to the default
c.	If you like, you can add the URL http://localhost:1234/login as the Authentication module redirect URI
d.	Add the QSE server name and localhost to the Host white list
e.	Link it to the Central Proxy service
10.	Enable HTTP support in Central Proxy
11.	Add the file redirect-ticket.html to the Default content library.  The file can be found in {root}/qse folder. 
12.	Import the app Demo.qvf into your QSE environment.  The file can be found in the {root}/qse folder.
13.	You will need to edit the code in the following files: iframe-integration.html ({root}/templates) and app-session.js ({root}/static/client/javascript). These files contain Qlik Sense application IDs and object IDs that will need to be replaced with values from your imported Demo.qvf application (you can use Dev Hub to obtain the values).  You can also update the capability-api-1.html, capability-api-2.html, and capability-api-3.html files if you want the sample code to match the actual running code.  
Once the server is running, you can access the login page using the URL http://localhost:1234/login.  You do not need to enter a password, as no actual password check is implemented in this code; however, you do need to enter a valid user identifier that has been granted a license in your environment.  You also need to enter a valid directory name.  In a default installation, this will be the name of your server.
