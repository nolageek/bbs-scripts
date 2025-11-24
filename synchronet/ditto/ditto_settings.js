load("sbbsdefs.js");
load("cga_defs.js");
load("funclib.js");

var jsonServer = "localhost";
var jsonPort = "10088";

/**/
var screenRows = console.screen_rows;
//var leftpad = printPadded('',(console.screen_columns - 80) / 2);   
//if (user.screen_rows) 
//    screenRows = user.screen_rows;
// Get Default Settings from ditto.ini
	
var options = load({}, 'modopts.js', 'DITTOSETTINGS:default');

options.lastCallersNum = console.screen_rows - 13;
// Get Theme Override Settings from ditto.ini

//bbs.atcode("BPS:" + options.BAUD); // Set Emulated BPS

var theme = load({}, 'modopts.js', 'DITTOSETTINGS:' + user.command_shell);
if (theme.fontcode)
	options.fontcode = theme.fontcode
if (theme.rumorsNum)
	options.rumorsNum = theme.rumorsNum
if (theme.useDefDoors)
	options.useDefDoors = theme.useDefDoors
if(options.ddreaderpath) {
    var ddreaderscript = options.ddreaderpath + 'DDMsgReader.js'
    if (file_exists(options.ddreaderpath + user.command_shell + '-' + options.ddreaderconfig))
        var ddreaderconfigfile = ' -configFilename=' + user.command_shell + '-' + options.ddreaderconfig;
	else
		var ddreaderconfigfile = '';
    var ddreader = ddreaderscript + ddreaderconfigfile;
    }

// Get Default Colors from ditto.ini
var color = load({}, 'modopts.js', 'DITTOCOLORS:default');
// Get Theme Override Colors from ditto.ini
var themecolor = load({}, 'modopts.js', 'DITTOCOLORS:' + user.command_shell);

if (themecolor.dark)
	color.dark = themecolor.dark
if (themecolor.normal)
	color.normal = themecolor.normal
if (themecolor.bright)
	color.bright = themecolor.bright
if (themecolor.alert)
	color.alert = themecolor.alert
if (themecolor.yes)
	color.yes = themecolor.yes
if (themecolor.info)
	color.info = themecolor.info
if (themecolor.select)
	color.select = themecolor.select
