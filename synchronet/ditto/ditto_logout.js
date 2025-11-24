// THIS IS RUN AFTER THE CARRIER IS DROPPED
load("sbbsdefs.js");
load('json-client.js');
log('LOGOUTEVENT.JS')
//bbs.exec('?bulb.js off');


var userprops = load({}, 'userprops.js');

var activity_doors = 0; 
if (user.security.flags1 & UFLAG_D)
    activity_doors = 1;
var activity_hungup = 0;
if (user.security.flags1 & UFLAG_H)
    activity_hungup = 1;

log('UPDATING USER_LASTCALL INFO')
		userprops.set('USER_LASTCALL', 'terminal_name', console.terminal, user.number);
        userprops.set('USER_LASTCALL', 'terminal_type',  console.type, user.number);
        userprops.set('USER_LASTCALL', 'terminal_width', console.screen_columns, user.number);
        userprops.set('USER_LASTCALL', 'terminal_height', console.screen_rows, user.number);
        userprops.set('USER_LASTCALL', 'terminal_supports',  console.term_supports(), user.number);
        userprops.set('USER_LASTCALL', 'protocol', client.protocol, user.number);
        userprops.set('USER_LASTCALL', 'node', bbs.node_num, user.number);
        userprops.set('USER_LASTCALL', 'msgs_read',  bbs.posts_read, user.number);
        userprops.set('USER_LASTCALL', 'files_ul',  bbs.logon_uls, user.number);
        userprops.set('USER_LASTCALL', 'files_dl',  bbs.logon_dls, user.number);
        userprops.set('USER_LASTCALL', 'msgs_sent',  bbs.logon_posts, user.number);
        userprops.set('USER_LASTCALL', 'user_hungup',  activity_hungup, user.number);
        userprops.set('USER_LASTCALL', 'user_doors',  activity_doors, user.number);

log('UPDATING USER LASTCALLER DATABASE')
var jsonServer = "localhost";
var jsonPort = "10088";
var db = new JSONClient(jsonServer, jsonPort);
var lastcallerstotal = db.read("ditto", "lastcallers.length", 1);

var lastcaller_data = [];
    lastcaller_data = {
    user_name: user.name,
    user_number: user.number,
    user_ip: user.ip_address,
    user_location: user.location,
    user_command_shell: user.command_shell,
    user_logontime: user.logontime,
    logoff_time: time,
    console_terminal_name: console.terminal,
    console_terminal_type: console.type,
    console_terminal_width: console.screen_columns,
    console_terminal_height: console.screen_rows,
    console_term_supports: console.term_supports(),
    client_protocol: client.protocol,
    bbs_node: bbs.node_num,
    bbs_posts_read: bbs.posts_read,
    bbs_logon_posts: bbs.logon_posts,
    bbs_logon_uls: bbs.logon_uls,
    bbs_logon_dls: bbs.logon_dls,
    bbs_logon_doors: activity_doors,
    user_hungup: activity_hungup
    }

saveactivity(lastcaller_data);

function saveactivity(lastcaller_data) {
	var db = new JSONClient(jsonServer, jsonPort);
	//db.splice("ditto", "lastcallers", 0, lastcallerstotal, lastcaller_data, 2);
    db.push("ditto", "lastcallers", lastcaller_data, 2);
  }

