load("sbbsdefs.js");
load("ditto/ditto_settings.js");
load("coldfuncs.js");

//load("ditto_language.js");

// test for menu in user.command_shell directory, if not found use ditto version.

function dittoMenu(file) {
  //checks current command_shell directory for file name, if doesn't exist,
  // use ditto dir.
  console.putmsg("@RESETPAUSE@");

  var ansiDir = "/sbbs/text/menu/" + user.command_shell + "/";
  if (file == "mesg" && file_exists(ansiDir + bbs.curgrp + "-" + file + ".ans"))
    file = bbs.curgrp + "-" + file;

  if (file == "xfer" && file_exists(ansiDir + bbs.curdir + "-" + file + ".ans"))
    file = bbs.curlib + "-" + file;

  if (!file_exists(ansiDir + file + "*.*"))
    var ansiDir = "/sbbs/mods/ditto/menus/";
  //   var random_list = directory(ansiDir + file + '*.*') //returns an array of filenames from ansiDir
  ///   if (random_list.length)  //if there are files in the directory
  //       file = file_getname(random_list[random(random_list.length)]).slice(0, -4);
  if (file_exists(ansiDir + file + "*.*")) bbs.menu(ansiDir + file, P_NOERROR);
}


function dittoHeaderFooter(type, file) {
  if (
    !file_exists("/sbbs/text/menu/" + user.command_shell + "/" + file + ".ans")
  )
    file = type;
  dittoMenu(file);
}

function dittoPrompt(menu) {
  bbs.nodesync();
  bbs.menu(options.fontcode); // reset font type

  var pre_prompt = "";
  var menupath = user.command_shell + "/"
  var menuname;
  //if (!(user.settings & USER_EXPERT)) 
  //bbs.menu(menupath + menuname);

  //bbs.menu(menupath + menu);

  
  if (menu == "mesg") {
   menuname = "Message";

    if(bbs.menu_exists(menupath+bbs.curgrp+"-"+menu+"*"))
      menu = bbs.curgrp+"-"+menu+"*";

    if (!(user.settings & USER_EXPERT))
      console.gotoxy(1, console.screen_rows - 2);

      pre_prompt = 
      " " +
        bracket("@GN@") +
        color.normal +
        " @GRP@" +
        color.dark +
        " - " +
        bracket("@SN@") +
        color.normal +
        " @SUBL@\1n\r\n";

    //console.crlf();
  }

  if (menu == "xfer") {
    menuname = "Transfer";
    if(bbs.menu_exists(menupath+bbs.curlib+"-"+menu+"*"))
      menu = bbs.curlib+"-"+menu+"*";

    if (!(user.settings & USER_EXPERT))
      console.gotoxy(1, console.screen_rows - 2);

    pre_prompt = 
      " " +
        bracket("@LN@") +
        color.normal +
        " @LIBL@" +
        color.dark +
        " - " +
        bracket("@DN@") +
        color.bright +
        " @DIRL@\1n\r\n";
  }

  if (user.settings & USER_EXPERT) var xpert = ".xpert " + bracket("?=menu");
  else 
  var xpert = "";

  if (!(user.settings & USER_EXPERT))
    console.gotoxy(1, console.screen_rows - 1);

    if(!menuname)
      menuname = menu;
  var prompt = format(
    " %s" +
      user.alias +
      "%s > %s" +
      menuname +
      "_Menu%s%s %s>%s>%s>" +
      color.reset,
    color.bright,
    color.dark,
    color.normal,
    color.dark,
    xpert,
    color.bright,
    color.normal,
    color.dark
  );

  //if (!(user.settings & USER_EXPERT)) 
  

  if (!(user.settings & USER_EXPERT)) 
  bbs.menu(menupath + menu);
  
  console.gotoxy(1, console.screen_rows - 1);
  console.putmsg(pre_prompt);
  console.print(dittoText(prompt));
}

function bracket(string) {
  bracketed = color.dark + "[" + color.bright + string + color.dark + "]";
  return bracketed;
}

//pads left

//pads left

function lpad(str, length, padString) {
	if (!padString) var padString = " ";
	if (str.length > length) str = str.substring(0, length);
	while (str.length < length) str = padString + str;
	return str;
  }
/*
function lpad(str, length, padString) {
	if (!padString) padString = " ";
	var working_string = strip_ctrl(str).trim();
	var padding_length = (length - working_string.length);
	var lpadding = Array(padding_length).join(padString)
	if (working_string.length > length) 
		return working_string.substring(0, length);
	else 
		return lpadding + str;    
  }

//pads right
/*
function rpad(str, length, padString) {
  if (!padString) var padString = " ";
  if (str.length > length) str = str.substring(0, length);
  while (str.length < length) str = str + padString;

  return str;
}
*/

function rpad(str, length, padString) {
	if (!padString) padString = " ";
	var working_string = strip_ctrl(str).trim();
	var padding_length = (length - working_string.length);
	var rpadding = Array(padding_length).join(" ")
	if (working_string.length > length) 
		return working_string.substring(0, length);
	else 
		return str + rpadding;    
  }

String.prototype.rpad = function (pad, len) {
  while (pad.length < len) {
    pad += pad;
  }
  return this + pad.substr(0, len - this.length);
};

String.prototype.lpad = function (pad, len) {
  while (pad.length < len) {
    pad += pad;
  }
  return pad.substr(0, len - this.length) + this;
};

function timeSince(ts) {
	now = new Date();
	ts = new Date(ts * 1000);
	var delta = now.getTime() - ts.getTime();
  
	delta = delta / 1000; //us to s
  
	var ps, pm, ph, pd, min, hou, sec, days;
  
	if (delta <= 59) {
	  return lpad(delta.toString(),2,"0") + "s";
	}
  
	if (delta >= 60 && delta <= 3599) {
	  min = Math.floor(delta / 60);
	  sec = delta - min * 60;
	  return lpad(min.toString(),2,"0") + "m";
	}
  
	if (delta >= 3600 && delta <= 86399) {
	  hou = Math.floor(delta / 3600);
	  min = Math.floor((delta - hou * 3600) / 60);
	  return lpad(hou.toString(),2,"0") + "h " + lpad(min.toString(),2,"0") + "m";
	}
  
	if (delta >= 86400) {
	  days = Math.floor(delta / 86400);
	  hou = Math.floor((delta - days * 86400) / 60 / 60);
	  return lpad(days.toString(),2,"0") + "d " + lpad(hou.toString(),2,"0") + "h";
	}
  }

/*
String.prototype.toRandomCase = function() {
return dittoRandomCase(this);
} */

function dittoRandomCase(string) {
  return strip_ctrl(string)
    .split("")
    .map(function (c) {
      return c[Math.round(Math.random()) ? "toUpperCase" : "toLowerCase"]();
    })
    .join("");
}

function dittoRandomColor(string) {
  return strip_ctrl(string)
    .split("")
    .map(function (c) {
      var items = [
        color.normal,
        color.dark,
        color.bright,
        color.white,
        color.lightgray,
      ];
      return color.reset + items[Math.floor(Math.random() * items.length)] + c;
    })
    .join("");
}

function RainbowColor(string) {
  return strip_ctrl(string)
    .split("")
    .map(function (c) {
      var items = [
        "\1n\1h\1r",
        "\1n\1y",
        "\1n\1h\1y",
        "\1n\1h\1g",
        "\1n\1h\1b",
        "\1n\1m",
        "\1n\1h\1m",
      ];
      return items[Math.floor(Math.random() * items.length)] + c;
    })
    .join("");
}

function dittoLeetCase(string) {
  var original = string.toUpperCase().replace(/I/g, "i").replace(/O/g, "0");
  return strip_ctrl(original)
    .split(" ")
    .map(function (e) {
      return e.charAt(0).toLowerCase() + e.slice(1);
    })
    .join(" ");
}

function dittoLeetColor(string) {
  return strip_ctrl(string)
    .split(" ")
    .map(function (e) {
      return (
        color.white +
        e.charAt(0) +
        color.bright +
        e.charAt(1) +
        color.normal +
        e.slice(2)
      );
    })
    .join(" ");
}

function leet_color(string) {
	str = color.white + 
		string.charAt(0) +
		color.bright + string.charAt(1) +
		color.normal + string.slice(2, string.length)
	return str;
}

function leet_color_dark(string) {
	str = color.white + 
		string.charAt(0) +
		color.normal + string.charAt(1) +
		color.dark + string.slice(2, string.length)
	return str;
}

function dittoLeetColorDark(string) {
	return strip_ctrl(string)
	  .split(" ")
	  .map(function (e) {
		return (
		  color.white +
		  e.charAt(0) +
		  color.bright +
		  e.charAt(1) +
		  color.dark +
		  e.slice(2)
		);
	  })
	  .join(" ");
  }

function dittoFirstWhiteColor(string) {
  return strip_ctrl(string)
    .split(" ")
    .map(function (e) {
      return color.white + e.charAt(0) + color.bright + e.slice(1);
    })
    .join(" ");
}

function dittoText(string) {
  var text = string;

  if (user.security.flags2 & UFLAG_R) text = dittoRandomCase(text);

  if (user.security.flags2 & UFLAG_E) text = dittoLeetCase(text);

  if (user.security.flags2 & UFLAG_B) text = dittoRandomColor(text);

  if (user.security.flags2 & UFLAG_C) text = dittoLeetColor(text);

  if (user.security.flags2 & UFLAG_G) text = color.normal + text;

  return text;
}

function jump_area_group() {
  // Shamefully stolen from classic_shell.js
  if (!msg_area.grp_list.length) return;
  while (1) {
    var orig_grp = bbs.curgrp;
    var i = 0;
    var j = 0;
    if (msg_area.grp_list.length > 1) {
      if (file_exists(system.text_dir + "menu/grps.*")) bbs.menu("grps");
      else {
        console.putmsg(bbs.text(133), P_SAVEATR);
        for (i = 0; i < msg_area.grp_list.length; i++) {
          if (i == bbs.curgrp) console.print("*");
          else console.print(" ");
          if (i < 9) console.print(" ");
          if (i < 99) console.print(" ");
          console.putmsg(
            format(bbs.text(134), i + 1, msg_area.grp_list[i].description),
            P_SAVEATR
          );
        }
      }
      console.mnemonics(format(bbs.text(652), bbs.curgrp + 1));
      j = get_next_num(msg_area.grp_list.length, false);
      if (j < 0) return;
      if (!j) j = bbs.curgrp;
      else j--;
    }
    bbs.curgrp = j;
    if (file_exists(system.text_dir + "menu/subs" + (bbs.curgrp + 1)))
      bbs.menu("subs" + (bbs.curgrp + 1));
    else {
      console.clear();
      console.putmsg(
        format(bbs.text(125), msg_area.grp_list[j].description),
        P_SAVEATR
      );
      for (i = 0; i < msg_area.grp_list[j].sub_list.length; i++) {
        var msgbase = new MsgBase(msg_area.grp_list[j].sub_list[i].code);
        if (msgbase == undefined) return;
        if (!msgbase.open()) return;
        if (i == bbs.cursub) console.print("*");
        else console.print(" ");
        if (i < 9) console.print(" ");
        if (i < 99) console.print(" ");
        console.putmsg(
          format(
            bbs.text(126),
            i + 1,
            msg_area.grp_list[j].sub_list[i].description,
            "",
            msgbase.total_msgs
          ),
          P_SAVEATR
        );
        msgbase.close();
      }
    }
    console.mnemonics(format(bbs.text(653), bbs.cursub + 1));
    i = get_next_num(msg_area.grp_list[j].sub_list.length, false);
    if (i == -1) {
      if (msg_area.grp_list.length == 1) {
        bbs.curgrp = orig_grp;
        return;
      }
      return;
    }
    if (!i) i = bbs.cursub;
    else i--;
    bbs.cursub = i;
    return;
  }
}

function jump_lib_dir() {
  if (!file_area.lib_list.length) return;
  while (1) {
    var orig_lib = bbs.curlib;
    var i = 0;
    var j = 0;
    if (file_area.lib_list.length > 1) {
      if (file_exists(system.text_dir + "menu/libs.*")) bbs.menu("libs");
      else {
        console.putmsg(bbs.text(658), P_SAVEATR);
        for (i = 0; i < file_area.lib_list.length; i++) {
          if (i == bbs.curlib) console.print("*");
          else console.print(" ");
          if (i < 9) console.print(" ");
          if (i < 99) console.print(" ");
          // We use console.putmsg to expand ^A, @, etc
          console.putmsg(
            format(bbs.text(659), i + 1, file_area.lib_list[i].description),
            P_SAVEATR
          );
        }
      }
      console.mnemonics(format(bbs.text(654), bbs.curlib + 1));
      j = get_next_num(file_area.lib_list.length, false);
      if (j < 0) return;
      if (!j) j = bbs.curlib;
      else j--;
    }
    bbs.curlib = j;
    if (file_exists(system.text_dir + "menu/dirs" + (bbs.curlib + 1)))
      bbs.menu("dirs" + (bbs.curlib + 1));
    else {
      console.clear();
      console.putmsg(
        format(bbs.text(656), file_area.lib_list[j].description),
        P_SAVEATR
      );
      for (i = 0; i < file_area.lib_list[j].dir_list.length; i++) {
        if (i == bbs.curdir) console.print("*");
        else console.print(" ");
        if (i < 9) console.print(" ");
        if (i < 99) console.print(" ");
        console.putmsg(
          format(
            bbs.text(657),
            i + 1,
            file_area.lib_list[j].dir_list[i].description
          ),
          P_SAVEATR
        );
      }
    }
    console.mnemonics(format(bbs.text(655), bbs.curdir + 1));
    i = get_next_num(file_area.lib_list[j].dir_list.length, false);
    if (i == -1) {
      if (file_area.lib_list.length == 1) {
        bbs.curlib = orig_lib;
        return;
      }
      return;
    }
    if (!i) i = bbs.curdir;
    else i--;
    bbs.curdir = i;
    return;
  }
  // This never actually happens...
  return;
}

function get_slashslash_menu() {
  var file = new File("/sbbs/mods/ditto/ditto_options.ini");
  if (!file.open("r"))
    alert("Error opening file: /sbbs/mods/ditto/ditto_options.ini");
  var slashslashhelp = " TWO SLASH MENU";
  console.crlf();
  console.putmsg(color.yes + rpad(slashslashhelp, console.screen_columns - 1));
  console.crlf();
  var keys = file.iniGetKeys("SLASHSLASH");
  var commands = "";
  for (var i = 0; i < keys.length; i++) {
    commands = commands + "//" + keys[i] + " ";
  }
  console.putmsg(dittoLeetColor(commands), P_WORDWRAP);
  file.close();
}