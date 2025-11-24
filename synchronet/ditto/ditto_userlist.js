load("sbbsdefs.js");
load("frame.js");
//load("ditto/ditto_settings.js");
require("dd_lightbar_menu.js", "DDLightbarMenu");
load("funclib.js");
if (!color)
  var color = [];
if (!color.dark)
	color.dark = "\1h\1k"
if (!color.normal)
	color.normal = "\1n\1c"
if (!color.bright)
	color.bright = "\1h\1c"
  if (!color.white)
	color.white = "\1h\1w"
if (!color.select)
	color.select = "\0016\1k"

userprops = load({}, "userprops.js");

const avatar_lib = load({}, "avatar_lib.js");

Frame.prototype.blit = function (bin, w, h, x, y) {
  var o = 0; // offset into 'bin'
  for (var yy = 0; yy < h; yy++) {
    for (var xx = 0; xx < w; xx++) {
      this.setData(
        x + xx,
        y + yy,
        bin.substr(o, 1),
        bin.substr(o + 1, 1).charCodeAt(0) || BG_BLACK
      );
      o = o + 2;
    }
  }
};

var mainframe = new Frame(
  1,
  1,
  console.screen_columns,
  console.screen_rows,
  BG_BLACK
);

var ansiDir = system.text_dir + '\\menu\\' + user.command_shell + "\\";
console.putmsg(ansiDir);
console.pause()
if (!file_exists(ansiDir + "header*.*"))
  var ansiDir = system.mods_dir + "ditto\\menus\\";
console.putmsg(ansiDir);
console.pause()
var headerFile = ansiDir + "header.ans";

if (file_exists(ansiDir + "header." + console.screen_columns + "col.ans"))
  headerFile = ansiDir + "header." + console.screen_columns + "col.ans"

if (file_exists(ansiDir + "header.c" + console.screen_columns + ".ans"))
  headerFile = ansiDir + "header.c" + console.screen_columns + ".ans"

mainframe.load(headerFile);
mainframe.transparency = true;
mainframe.scrollTo(-1,1)


var avatarframe = new Frame(
  1,
  7,
  avatar_lib.defs.width + 2,
  avatar_lib.defs.height + 2,
  BG_BLACK | LIGHTGRAY,
  mainframe
);

var profileframe = new Frame(
  avatarframe.width + 2,
  avatarframe.y,
  console.screen_columns - (avatarframe.width + 3),
  8,
  BG_BLACK | WHITE,
  mainframe
);


mainframe.draw();


var u = new User(1); //user object...

var lastuser;
if (system.lastuser == undefined) lastuser = system.stats.total_users;
else lastuser = system.lastuser;



var userlistlb = new DDLightbarMenu(3, avatarframe.y + avatarframe.height, console.screen_columns-4, console.screen_rows-( avatarframe.y + avatarframe.height));

userlistlb.AddAdditionalQuitKeys("qQ");
userlistlb.colors.itemColor = color.white;
userlistlb.colors.selectedItemColor = color.select;
userlistlb.callOnItemNavOnStartup = true;
if (console.screen_columns == 80)
userlistlb.topBorderText = color.dark + " NUM   USERNAME                LOCATION/AFFILIATIONS              LAST ON";
else
userlistlb.topBorderText = color.dark + " NUM   USERNAME                  LOCATION/AFFILIATIONS                  FIRST ON               LAST ON                 CONNECT";
userlistlb.bottomBorderText = color.dark + ">> userbrowse v.001 by nolageek <phenom>";
userlistlb.bordersColor = "\1h\1k";
userlistlb.borderEnabled = true;
userlistlb.borderChars.upperLeft = ".";
userlistlb.borderChars.upperRight = ".";
userlistlb.borderChars.lowerLeft = ".";
userlistlb.borderChars.lowerRight = ".";
userlistlb.borderChars.top = ".";
userlistlb.borderChars.bottom = ".";
userlistlb.borderChars.left = ":";
userlistlb.borderChars.right = ":";
//userlistlb.scrollbarEnabled = true;

userlistlb.OnItemNav = function (pOldItemIdx, pNewItemIdx) {
  view_user(this.GetItem(pNewItemIdx).retval);
};
for (var i = 0; i < lastuser; i++) {
  u.number = i + 1;
  if (u.stats.total_logons != 0 && (u.settings & USER_DELETED) != USER_DELETED)
    if(console.screen_columns >= 132)  
    userlistlb.Add(
      printPadded(" #" + u.number, 7) + printPadded(u.alias.substring(0, 25),26) + printPadded(u.location.substring(0, 35),39) + printPadded(strftime("%m/%d/%y", u.stats.firston_date).substring(0, 10),23) + printPadded(strftime("%m/%d/%y", u.stats.laston_date).substring(0, 10),24) + printPadded(u.connection, 6), u.number);
    else
    userlistlb.Add(
      printPadded(" #" + u.number, 7) + printPadded(u.alias.substring(0, 23),24) + printPadded(u.location.substring(0, 33),34) + printPadded(strftime("%m/%d/%y", u.stats.laston_date).substring(0, 9),10) + " ", u.number);

}

var quit = false;
while (!quit) {
  var key = userlistlb.GetVal();

  switch (key) {
    case null:
      quit = true;
      console.clear();
      break;
    default:
   }
  
  
}

function view_user(key) {
  profileframe.clear();
  avatarframe.clear();
  var u = new User(key);

  load_user_avatar(avatarframe, u.number);

 
  profileframe.gotoxy(2, 2);
  profileframe.putmsg(color.white + "#" + u.number.toString() + ' ' + color.bright + u.alias);
  if (u.is_sysop) profileframe.putmsg(" \1h\1g+o\1n");
  profileframe.gotoxy(2, 3);
  profileframe.putmsg(color.bright + "SL: " + color.dark + u.security.level);
  var level = "";
  if (u.security.level == 25) level = "\1h\1r (DEL)";
  if (u.security.level == 50) level = "\1h\1g (user)";
  if (u.security.level == 75) level = "\1h\1y (vis sysop)";
  if (u.security.level == 99) level = "\1n\1w (sysop)";
  profileframe.putmsg(level);
  profileframe.gotoxy(2, 5);
  profileframe.putmsg(color.white + "Location / Affiliations")
  profileframe.gotoxy(2, 6)
  profileframe.putmsg(color.bright + u.location);


  var padding_if_wide = 0;
  if(console.screen_columns >= 132) 
  padding_if_wide = 8;

  profileframe.gotoxy(27 + padding_if_wide, 2);
  profileframe.putmsg(color.white + "MESSAGE STATS ");
  profileframe.gotoxy(27 + padding_if_wide, 3);
  profileframe.putmsg(
    color.bright +
      "Posts: " +
      color.dark +
      u.stats.total_posts +
      color.bright +
      " Email: " +
      color.dark +
      u.stats.total_emails +
      color.bright +
      " Feedback: " +
      color.dark +
      u.stats.total_feedbacks
  );
 
  profileframe.gotoxy(27 + padding_if_wide, 5);
  profileframe.putmsg(color.white + "FILE STATS ");
  profileframe.gotoxy(27 + padding_if_wide, 6);
  profileframe.putmsg(
    color.bright +
      "UL: " +
      color.dark +
      u.stats.files_uploaded +
      color.bright +
      " Files: " +
      color.dark +
      Math.round(u.stats.bytes_uploaded / 1000000) +
      "Mb ");
      profileframe.gotoxy(27 + padding_if_wide, 7);
  profileframe.putmsg(
      color.bright +
      "DL: " +
      color.dark +
      u.stats.files_downloaded +
      color.bright +
      " Files: " +
      color.dark +
      Math.round(u.stats.bytes_downloaded / 1000000) +
      "Mb"
  );

  profileframe.gotoxy(44 + padding_if_wide, 5);
  profileframe.putmsg(color.white + "CALLS: " + color.bright + "TOTAL  FIRST");
  profileframe.gotoxy(51 + padding_if_wide, 6);
  profileframe.putmsg(
    color.dark +
      printPadded(u.stats.total_logons,6,0));
      profileframe.gotoxy(58 + padding_if_wide, 6);
      profileframe.putmsg(   
      color.dark + printPadded(strftime("%m/%d/%y",u.stats.firston_date),9))


  if(console.screen_columns >= 132) {
  profileframe.gotoxy(85, 2);
  profileframe.putmsg(color.white + "LAST SEEN " + strftime("%m/%d/%y", u.stats.laston_date) + " ON NODE #" + userprops.get("USER_LASTCALL", "node", "1", u.number));
  
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
  };

  terminal_cols = userprops.get(
    "USER_LASTCALL",
    "terminal_width",
    "80",
    u.number
  );
  if (terminal_cols == 80) terminal_type = "Standard";
  else terminal_type = "Widescreen";

  profileframe.gotoxy(85, 3);
  profileframe.putmsg(color.bright + "term : " + color.dark + terminal_name.toUpperCase() + " (" + terminal_type + ")");
  
  profileframe.gotoxy(85, 4);
  profileframe.putmsg(color.bright + "shell: " + color.dark + u.command_shell.toUpperCase());
  profileframe.gotoxy(85, 5);
  profileframe.putmsg(color.bright + "area : ");
  if (u.cursub)
    try {
      profileframe.putmsg(color.dark +  msg_area.sub[u.cursub].name.substring(0,25));
    } catch (err) {}
  profileframe.gotoxy(85, 6);
  profileframe.putmsg(color.bright + "dir  : ");
  if (u.curdir)
    try {
      profileframe.putmsg(color.dark + file_area.dir[u.curdir].name.substring(0,25));
    } catch (err) {}
  profileframe.gotoxy(85, 7);
  profileframe.putmsg(color.bright + "door : ");
  if (u.curxtrn)
    try {
      profileframe.putmsg(color.dark + xtrn_area.prog[u.curxtrn].name.substring(0,25));
    } catch (err) {}
  }

  
  profileframe.cycle();
  avatarframe.cycle();
  mainframe.cycle();
}

function load_user_avatar(frame, user) {
  var user_avatar = avatar_lib.read_localuser(user);
  if (user_avatar && user_avatar.data) {
    frame.clear();
    frame.blit(
      base64_decode(user_avatar.data),
      avatar_lib.defs.width,
      avatar_lib.defs.height,
      1,
      1
    );
    if (user_avatar.disabled) {
      for (var y = 1; y < frame.data.length - 2; y++) {
        if (!Array.isArray(frame.data[y])) continue;
        for (var x = 1; x < frame.data[y].length - 1; x++) {
          if (typeof frame.data[y][x] == "object") {
            frame.data[y][x].attr = BG_BLACK | LIGHTGRAY;
          }
        }
      }
      frame.invalidate();
    }
  }
}
