load("sbbsdefs.js");
var userprops = load({}, 'userprops.js');

var DDconfig = "";
	if (file_exists('/sbbs/xtrn/DDMsgReader/' + user.command_shell + '-DDMsgReader.cfg'))
		DDconfig = " -configFilename=" + user.command_shell + "-DDMsgReader.cfg";
	else 
		DDconfig = " -configFilename=" + "DDMsgReader.cfg";
		
var param = 'none';
param = argv[0];

var lastuser = userprops.get('USER_LOADABLE_MODULES', 'last_user', undefined, user.number);
if (lastuser == undefined) 
	userprops.set('USER_LOADABLE_MODULES', 'last_user', 'LastLiners', user.number);

  switch (lastuser) {
		case 'LastLiners':
			if (lastuser == 'LastLiners')
				bbs.exec('?/sbbs/mods/lastliners.js');			
			else
				bbs.exec('?ditto_lastcallers.js');
			break;
			default:
			console.putmsg("No Module Specified");
			console.pause();
		break;
  }