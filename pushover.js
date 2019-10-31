load("http.js"); //this loads the http libraries which you will need to make requests to the web server
load("sbbsdefs.js"); 

// Pushover notifications for synchronet v0.12 by nolageek
//
// This script adds simple push notifications to your synchronet bbs, using the pushover API,
// NOTE: You'll need to install pushover on your mobile device, web browser, etc...
// and sign up for API keys at http://pushover.net
//
//// INSTRUCTIONS / INSTALLATION
// Upload script to /mods and add to BBS external programs:
//
// Example:
// Name: "Pushover Logon"
// Command Line: ?pushover.js event_name
// Execute on Event: Logon, Only

// Do the same for other events: logon, logoff, newuser, sysopchat
// "event_name" is simply the word after the script name in the "Command Line" and is only used in the notification message
// before the username.
// It can be anything (just not blank) since it's the "Execute on event" that indicates the event itself.
// Example: Command Line: ?pushover.js logon
// Resulting notification: LOGON: nolageek(#1) from 12.34.56.78
//
//
//// CONFIGURATION ////////////////////////////
//
// Pushover Configuration
var poAppToken = "xxx";
var poUserKey = "xxx"; // Who gets the message?
// End Pushover Configuration

// ignore these user names (use form ['username1','username2'];)
var ignoreUser = ['nolagee1k']; 
//// END CONFIGURATION ////////////////////////


// get command from commandline argument. ex "?pushover.js command"
var command = argv[0]; 

// if command is omitted, let sysop know via notification.
	if (command == null) {
		var message = "No command specified.";
	} else {
// otherwise create notification in form of "COMMAND: username(#0) from IP_ADDR"
		var message = command.toUpperCase() + ": " + user.alias + "(#" + user.number + ") from " + user.ip_address;
	}

// the actual function
function Pushover() {
// Set up the POST data for pushover
	var postdata = "token=" + poAppToken
			+ "&user=" + poUserKey
			+ "&message=" + message;
			
// Send notification if user is NOT found in the ignore list
	if (ignoreUser.indexOf(user.alias) < 0) {
		this.request = new HTTPRequest();
		this.RequestURL = new URL("http://api.pushover.net/1/messages.json");
		var currentEndpoint = this.RequestURL.url;
		response = this.request.Post(currentEndpoint,postdata);
		}
	}

	
Pushover();
