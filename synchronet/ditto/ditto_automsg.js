load('sbbsdefs.js');
load('ditto/ditto_settings.js')
load('ditto/ditto_functions.js')
load('json-client.js');

var db = new JSONClient(jsonServer, jsonPort);
var totalautomsgs = db.read("ditto", "automsg.length", 1);

function autoMsg() {
	
	if (totalautomsgs != 0)
		showAutoMsg();
	else
		console.putmsg("There is no AutoMessage.\r\n")
		
	if(!console.noyes('Enter new AutoMessage')) {
	console.clear();
	dittoHeaderFooter('header','automsg');
	console.crlf();
	console.putmsg('\1h\1bLine 1: ');
	var amsg1 = console.getstr("", 50);
	if (amsg1 == null || amsg1 == "" || amsg1 =="q" || amsg1 =="quit") return;
	console.putmsg('\1h\1cLine 2: ');
	var amsg2 = console.getstr("", 50);
	console.putmsg('\1h\1wLine 3: ');
	var amsg3 = console.getstr("", 50);
	var uname = user.alias;
	console.crlf(2);
	bbs.menu(user.command_shell + '/automsg-f');
	console.crlf(2);
	
	if(!console.noyes('Save your Message?')) {
        var automsg_data = [];
		automsg_data = {
          line1: amsg1,
          line2: amsg2,
          line3: amsg3,
          user: user.alias,
        };
        // Really Saving Your Rumor
        saveautomsg(automsg_data);
		showAutoMsg()
			console.center('\1h\1rYour automessage has been saved. \1n\1w\r\n');
	}

}

	if (user.is_sysop) {
		if(!console.noyes('Delete AutoMessage'))
		db.slice("ditto", "automsg", 0, 0, 2);
	}
	
}

function showAutoMsg() {
	var automesg = db.read("ditto", "automsg", 1);

	var amsg1 = automesg[0].line1;
	var amsg2 = automesg[0].line2;
	var amsg3 = automesg[0].line3;
	var user = automesg[0].user;

	console.clear();
	dittoMenu('header');
	console.crlf();
	console.center(dittoText('AUTO MESSAGE'));
	console.crlf();
	console.center(amsg1)
	console.center(amsg2)
	console.center(amsg3)
	console.center(user)
	console.crlf(2);
	dittoMenu('automsg-f');
	console.crlf(2);
}

function saveautomsg(automsg_data) {
	var db = new JSONClient(jsonServer, jsonPort);
	db.splice("ditto", "automsg", 0, totalautomsgs, automsg_data, 2);
  }

autoMsg();