// Many thanks to tracker and ispyhumanfly for a lot of this code.
load("sbbsdefs.js");
load("ditto/ditto_settings.js");
load("ditto/ditto_functions.js");
//load("funclib.js");

var lastcallerfile = "/sbbs/mods/ditto/lastcaller2.msg";

// Set default width for each item to be used as column widths
// column_padding will be used for padding between columns
var column_padding = 1;
var width_node = 1;
var width_name = 25;
var width_location = 30;
var width_shell = 8;
var width_laston = 8;
var width_timeon = 4;
var width_firston = 8;
var width_terminal_name = 9;
var width_terminal_size = 10;
var width_downloads = 2;
var width_uploads = 2;
var width_msgs_read = 2;
var width_msgs_sent = 2;
var width_connection = 3;
var width_activity = 10;

// Lets tweak these values for different sized terminals
if (console.screen_columns >= 132) {
  column_padding =2;
  width_name = 20;
  width_location = 24;
} else {
  column_padding = 1;
  width_name = width_name - 10;
  width_location = width_location - 10;
}

// Lets set up text and widths for header items
var h_node = printPadded("N", width_node + column_padding);
var h_name = printPadded("NAME", width_name + column_padding);
var h_location = printPadded("LOCATION/AFILS", width_location + column_padding);
var h_shell = printPadded("SHELL", width_shell + column_padding);
var h_laston = printPadded("LAST ON", width_laston + column_padding);
var h_timeon = printPadded("TIME", width_timeon + column_padding);
var h_activity = printPadded("[nprftdeh]", width_activity + column_padding);
var h_uploads = printPadded("U", width_uploads + column_padding);
var h_downloads = printPadded("D", width_downloads + column_padding);
var h_msgs_read = printPadded("R", width_msgs_read + column_padding);
var h_msgs_sent = printPadded("P", width_msgs_sent + column_padding);
var h_firston = printPadded("FIRST ON", width_firston + column_padding);
var h_terminal_name = printPadded("TERMINAL", width_terminal_name + column_padding);
var h_terminal_size = printPadded("TERM SIZE", width_terminal_size + column_padding);
var h_connection = printPadded("CON", width_connection);

function lastcallers_get_data(id) {
  // create empty items for ativity grid
  activity_posted = "-";
  activity_gfiles = "-";
  activity_feedback = "-";
  activity_readmg = "-";
  activity_hungup = "-";
  activity_doors = "-";
  activity_emails = "-";
  activity_isnew = "-";

  //get User information from userser database for ID passed via function.
  var u = new User(id);
  // getting data from userID.ini file for each used in loop
  userprops = load({}, "userprops.js");

  d_node = printPadded(
    userprops.get("USER_LASTCALL", "node", "1", u.number),
    width_node + column_padding
  );

  d_name = printPadded(u.alias.substring(0, width_name), width_name + column_padding);
  d_name = leet_color_dark(d_name);

  location = u.location.substring(0, width_location);
  location = printPadded(location, width_location + column_padding);
  d_location = leet_color(location);

  var user_shell_color = "";
  if (u.command_shell.toUpperCase() == "AMIGAISH")
    user_shell_color = color.bright;
  d_shell = printPadded(u.command_shell.toUpperCase(), width_shell + column_padding);
  d_shell = user_shell_color + d_shell;

  lastdate = u.stats.laston_date;
  d_laston = printPadded(
    strftime("%m/%d/%y", lastdate),
    width_laston + column_padding
  );
  d_laston = color.bright + d_laston;

  d_timeon = printPadded(
    printPadded(u.stats.timeon_last_logon.toString(), 3, "0", "Right") + "m",
    width_timeon + column_padding
  );
  d_timeon = color.dark + d_timeon;

  terminal_name = userprops.get(
    "USER_LASTCALL",
    "terminal",
    "ANSI-BBS",
    u.number
  );
  switch (terminal_name.toUpperCase()) {
    case "ANSI-256COLOR":
      terminal_name = "Netrunner";
      break;
    case "SYNCTERM":
    case "XTERM":
      terminal_namel = terminal_name;
      break;
    case "ansi-bbs": // fTelnet
    default:
      terminal_name = "Other";
      break;
  }
  d_terminal_name = printPadded(terminal_name, width_terminal_name + column_padding);

  terminal_cols = userprops.get(
    "USER_LASTCALL",
    "terminal_width",
    "80",
    u.number
  );
  //var terminal_size_color = color.normal;
  //if (terminal_cols > 80)
  //terminal_size_color =  color.bright
  if (terminal_cols == 80) terminal_type = "Standard";
  else terminal_type = "Widescreen";
  terminal_size = printPadded(
    terminal_type.substring(0, 10),
    width_terminal_size + column_padding
  );
  if (terminal_cols <= 80) d_terminal_size = leet_color(terminal_size);
  else d_terminal_size = RainbowColor(terminal_size);
  // d_terminal_size = terminal_size_color + terminal_size

  msgs_read = userprops.get("USER_LASTCALL", "msgs_read", "?", u.number);
  d_msgs_read = printPadded(msgs_read.toString(), width_msgs_read + column_padding);
  d_msgs_read = color.normal + d_msgs_read;

  d_msgs_sent =
    color.bright +
    printPadded(
      userprops.get("USER_LASTCALL", "msgs_sent", "?", u.number).toString(),
      width_msgs_sent + column_padding
    );

  files_ul = userprops.get("USER_LASTCALL", "files_ul", "?", u.number);
  d_uploads = printPadded(files_ul.toString(), width_uploads + column_padding);
  d_uploads = color.bright + d_uploads;

  files_dl = userprops.get("USER_LASTCALL", "files_dl", "?", u.number);
  d_downloads = printPadded(files_dl.toString(), width_downloads + column_padding);
  d_downloads = color.normal + d_downloads;
  firstdate = u.stats.firston_date;
  d_firston = printPadded(
    strftime("%m/%d/%y", firstdate),
    width_firston + column_padding
  );
  d_firston = leet_color(d_firston);

  // timelast = u.stats.timeon_last_logon + "m";

  if (
    strftime("%m%d%y", firstdate) ==
    strftime("%m%d%y", u.stats.laston_date)
  )
    activity_isnew = "\1h\1gn\1n" + color.normal;
  if (u.security.flags1 & UFLAG_P) activity_posted = "p";
  if (u.security.flags1 & UFLAG_T) activity_gfiles = "t";
  if (u.security.flags1 & UFLAG_F) activity_feedback = "f";
  if (u.security.flags1 & UFLAG_R) activity_readmg = "r";
  if (u.security.flags1 & UFLAG_H && u.alias != user.alias)
    activity_hungup = "h";
  if (u.security.flags1 & UFLAG_D) activity_doors = "d";
  if (u.security.flags1 & UFLAG_E) activity_emails = "e";

  activity =
    color.dark +
    "[" +
    color.normal +
    activity_isnew +
    activity_posted +
    activity_readmg +
    activity_feedback +
    activity_gfiles +
    activity_doors +
    activity_emails +
    activity_hungup +
    color.dark +
    "]";

  d_activity = printPadded(activity, width_activity + column_padding);

  d_connection = printPadded(
    u.connection.toUpperCase().substring(0, 3),
    width_connection
  );
  d_connection = leet_color(d_connection);
}

function lastcallers_get_header(width) {
  bbs.menu(user.command_shell + "/header*");
  if (width >= 132)
    header =
      h_node +
      h_name +
      h_location +
      h_shell +
      h_terminal_size +
      h_firston +
      h_laston +
      h_timeon +
      h_activity +
      h_uploads +
      h_downloads +
      h_msgs_read +
      h_msgs_sent +
      h_connection;
  if (width == 80)
    header =
      h_node +
      h_name +
      h_location +
      h_shell +
      h_laston +
      h_timeon +
      h_activity +
      h_connection;
  return header;
}

function lastcallers_get_entry(width, id) {
  lastcallers_get_data(id);
  var u = new User(id);
  if (width == 80)
    entry =
      d_node +
      d_name +
      d_location +
      d_shell +
      d_laston +
      d_timeon +
      d_activity +
      d_connection;

  if (width >= 132)
    entry =
      d_node +
      d_name +
      d_location +
      d_shell +
      d_terminal_size +
      d_firston +
      d_laston +
      d_timeon +
      d_activity +
      d_uploads +
      d_downloads +
      d_msgs_read +
      d_msgs_sent +
      d_connection;
  return entry;
}

function lastCallers(num) {
  if (!num) num = options.lastCallersNum;

  var show_count = num; //number of logins to show...
  var u = new User(1); //user object...
  var laston_list = new Array(); //array to hold recent users...

  function UserLogin(user_number, user_laston) {
    this.number = user_number;
    this.logon = user_laston;
  }

  function sortByLogin(a, b) {
    return a.logon - b.logon;
  }

  var lastuser;
  if (system.lastuser == undefined) lastuser = system.stats.total_users;
  else lastuser = system.lastuser;

  for (var i = 1; i <= lastuser; i++) {
    u.number = i; //change to current user
    if (
      u.stats.total_logons > 0 &&
      u.compare_ars("NOT GUEST") &&
      (u.settings & USER_DELETED) != USER_DELETED
    )
      laston_list[laston_list.length] = new UserLogin(i, u.stats.laston_date);
  }

  laston_list.sort(sortByLogin);

  var start =
    laston_list.length > show_count ? laston_list.length - 1 - show_count : 0;
  var lastfile = new File(lastcallerfile);
  var head = lastcallers_get_header(console.screen_columns);

  var head_padding = (console.screen_columns - strip_ctrl(head).length) / 2;
  var space = " ";
  while (space.length < head_padding) space = space + space;
  console.putmsg(space + "\1h\1w" + head);
  console.crlf();
  lastfile.open("w");
  lastfile.writeln(space + color.white + head);

  //create a loop to display the last few callers...
  for (var i = laston_list.length - 1; i > start; i--) {
    u.number = laston_list[i].number; //assign to user in list...
    var entry = lastcallers_get_entry(console.screen_columns, u.number);
    console.putmsg(space + entry + "\r\n");
    lastfile.writeln(space + entry);

    //now create the desired output...
    //console.center(active + "\r\n");
  }
  var footerlist = "newuser postmsg readmsg feedback tfiles doors email hangup";
  var footerlistwide = " / Uploaded Downloaded Read Posted";
  if (console.screen_columns >= 132) footerlist = footerlist + footerlistwide;
  console.crlf();
  console.center(dittoLeetColorDark(footerlist) + "\r\n");
  lastfile.writeln(dittoLeetColorDark(footerlist));
  lastfile.close();
  console.crlf(2);
  console.pause();
}

function askLastCallers(int) {
  var num = int;
  console.crlf();
  if (num == "undefined" || num == null) {
    console.putmsg(
      "\r\n" +
        color.dark +
        "> " +
        color.normal +
        "How many callers would you like to list? " +
        color.dark +
        "99 Max." +
        color.bright +
        " [" +
        options.lastCallersNum +
        "]"
    );
    console.putmsg(color.bright + " : ");
    num = console.getnum(99, console.screen_rows - 12);
  }
  lastCallers(num);
}

if (!argv[0]) askLastCallers();
else askLastCallers(argv[0]);
