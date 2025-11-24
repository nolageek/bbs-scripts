load("sbbsdefs.js");
load("/sbbs/mods/ditto/ditto_settings.js");

var userprops = load({}, 'userprops.js');

var DDconfig = "";
	if (file_exists(options.ddreader + user.command_shell + '-DDMsgReader.cfg'))
		DDconfig = ' -configFilename=' + user.command_shell + '-DDMsgReader.cfg';
	else 
		DDconfig = " -configFilename=" + "DDMsgReader.cfg";
		
var param = 'none';
param = argv[0];

  switch (param) {
		case 'msglist':
			if (options.msgreader == 'ddreader')
				bbs.exec(options.ddreaderpath + 'DDMsgReader.js -startMode=list' + DDconfig);			
			else
				bbs.exec('?msglist');
		break;
		case 'mailread':
			if (options.msgreader == 'ddreader')
				bbs.exec(options.ddreaderpath + 'DDMsgReader.js -startMode=list -personalEmail' + DDconfig);			
			else 
				bbs.exec('?msglist mail -preview');
		break;
		case 'newscan':
			if (options.msgreader == 'ddreader')
				bbs.exec(options.ddreaderpath + 'DDMsgReader.js -SEARCH=new_msg_scan_all' + DDconfig);			
			else
				bbs.exec('?msglist');
		break;
		case 'msgscan':
			if (options.msgreader == 'ddreader')
				bbs.exec('?DDScanMsgs 1' + DDconfig);			
			else
				bbs.exec('?msglist');
		break;	
		case 'subscan':
			if (options.msgreader == 'ddreader')
				bbs.exec('?DDScanSubs %1');			
			else
				bbs.exec('?msglist');
		break;
		default:
			console.putmsg("No Module Specified");
			console.pause();
		break;
  }