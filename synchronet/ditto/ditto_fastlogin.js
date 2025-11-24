//Fast login
load("sbbsdefs.js"); // load helper functions
load("ditto/ditto_settings.js");


var file = new File("/sbbs/mods/ditto/ditto_options.ini");
if (!file.open("r"))
alert("Error opening file: /sbbs/mods/ditto/ditto_options.ini");

var fastlogons = file.iniGetKeys("LOGONFAST");

for (i = 0; i < fastlogons.length; i++) {
  try {
    var program = file.iniGetValue("LOGONFAST", fastlogons[i]);
     if (file_exists(program))
      bbs.exec("?" + program);
  } catch (err) {
    bbs.log_str(err);
  }
}


if (!console.noyes("\1h\1k Would you like to see my cat (Sixel Test)\1n\1w")) {
  bbs.exec("?showsixel.js /sbbs/text/logon/bunny.sixel");
  console.putmsg(" Bunny says Hello!  ");
  console.pause();
}

bbs.menu(user.command_shell + "/fastlogin*");
if (user.security.flags2 & UFLAG_F) {
  if (!console.yesno("\1h\1k Fast Login:\1n\1w")) {
   logon_full();
  }
} else {
  if (console.noyes("\1h\1k Fast Login:\1n\1w")) {
    logon_full();
  }
}

function logon_full() {
  //ADD YOUR FULL-LOGON PROGRAMS HERE
  console.clear();

  var logonfulls = file.iniGetKeys("LOGONFULL");

  for (i = 0; i < logonfulls.length; i++) {
    try {
      var program = file.iniGetValue("LOGONFULL", logonfulls[i]);
       if (file_exists(program))
        bbs.exec("?" + program);
    } catch (err) {
      bbs.log_str(err);
    }
  }

bbs.menu("437");
bbs.menu("../logon/1*"); // logo ansi
bbs.menu("../logon/2*"); // network promo
bbs.menu("../logon/3*"); // game/feature promo
bbs.menu("../logon/4*"); // more
bbs.menu("437");

  var n = new File("/sbbs/data/subs/notices.hash");
  var u = user.stats.laston_date;
  if (u < n.date) bbs.exec("?/sbbs/xtrn/bullshit/bullshit.js bulletins");
}

bbs.menu(options.fontcode);
