load("sbbsdefs.js");
load("frame.js");
load("ditto/ditto_functions.js");
load("ditto/ditto_settings.js");
require("dd_lightbar_menu.js", "DDLightbarMenu");


var arealistlb = new DDLightbarMenu(1, 1 , 20, 45);
arealistlb.AddAdditionalQuitKeys("qQ");
arealistlb.colors.itemColor = "\1h\1w";
arealistlb.colors.selectedItemColor = color.alert;
arealistlb.OnItemNav = function (pOldItemIdx, pNewItemIdx) {
  view_user(this.GetItem(pNewItemIdx).retval);
};