load("sbbsdefs.js"); // load helper functions
load("ditto/ditto_settings.js"); // load helper functions
load("ditto/ditto_functions.js"); // load helper functions
load("ansislow.js");

user.security.flags1|=UFLAG_H; // Set Hangup flag, to be updated if user logs out properly

if (options.fontcode != "437")
	bbs.menu("../logon/ascii*"); // "Ascii Emulation" detected
else
 	bbs.menu("../logon/us-ansi*"); // "Ascii Emulation" detected

console.putmsg(color.alert + "@RESETPAUSE@ Current shell:\1n\1c " + user.command_shell + "\1n\r\n");

if(!console.noyes("\r\n\1h\1k Select a new logon shell\1h\1w "))
	bbs.select_shell();

//bbs.exec('?../xtrn/twitter/tweet.js ' + user.alias + ' has logged into the BBS on node ' + bbs.node_num + ". #bbslogon",EX_BG);

bbs.exec('?/sbbs/mods/ditto/ditto_fastlogin.js');

//bbs.exec('?/sbbs/mods/ditto/ditto_lastcallers.js');

bbs.menu('../logon/stats-synchronet');
bbs.menu(options.fontcode);