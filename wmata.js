load("http.js"); //this loads the http libraries which you will need to make requests to the web server
load("sbbsdefs.js"); // i  always load this when making stuff for synchronet don't know why
//var wmataApiKey = "exq6dtydgwdf3ys2ynyk5pmd"; // put your own API key here.
var opts=load({},"modopts.js","wmata"); 
var wmataApiKey = opts.wmataApiKey;

function main() {
	var loop = 1;
	while(loop == 1) {
    console.clear();
    bbs.menu("wmata/mainmenu");
    console.putmsg(" \1h\1wWelcome to the Cap Shrill WMATA Interface.\r\n");
    console.putmsg(" \1h\1k[\1h\1r1\1n\1y2\1h\1b3\1g4\1y5\1k6\1hQ\1k]\1w: ");
    switch (cmdkey = console.getkeys("123456SAQ", K_UPPER)) {
        case '1': //show all stations 
            line("red");
            break;
        case '2': //show times for A10
            line("orange");
            break
        case '3': //show times for A10
            line("blue");
            break
        case '4': //show times for A10
            line("green");
            break
        case '5': //show times for A10
            line("yellow");
            break
        case '6': //show times for A10
            line("silver");
            break
        case 'S':
            console.print("\1h\1b\r\n\1h\1bEnter the station Code: \1n\1w");
            str = console.getstr("", 3, K_UPPER);
            if (str == null || str == "") main();
            else {
                showTimes(str);
            }
            break;
        case 'A': //show times for A10
			showIncidents();
			break;
        case 'Q': //QUIT
			console.print("Many thanks to Larry Lagomorph for help with this!");
			loop = 0;
            exit();
        default:
            break;
    }
	} // while loop = 1;
}

function line(line) {
    var line
    console.clear();
    bbs.menu("wmata/" + line + "line");
    console.putmsg(
        " \1h\1kWelcome to the Cap Shrill WMATA Interface.\r\n")
    console.putmsg(" \1n\1wSelect a station code. (Q) for main menu.: ")
        //	console.print("\r\n\1n\1w\1hEnter the station Code:");
    str = console.getstr("", 3, K_UPPER);
    if (str == null || str == "" || str == "Q") main();
    else {
        showTimes(str);
    }
}

function Rail() { // this function is actually creating an object, named Rail to distinguish from Bus and Escalator Objects which you may add later.   See the API manual for all the methods available.                                                                                                                 
    this.request = new HTTPRequest(); //uses the http.js library to create an object to create methods  for retrieving data using http                                                        
    this.RequestURL = new URL("http://api.wmata.com/"); //creates a URL object which the HTTPRequest object will take as an argument to fetch data
    this.stations = function(str) { // this function corresponds to ste stations function in the API docs    
        var str
        var stationsEndpoint = this.RequestURL.url +
            "Rail.svc/json/JStations?LineCode=" + str + "&api_key=" +
            wmataApiKey; //What we are doing here is taking the base URL object and appending some properties to it so the data so it gets the right page.                                                                                                   
       // console.putmsg("\1h\1r" + stationsEndpoint +"\1h\1w\r\n Attn nolageek, this is just a debug function so you can copy and paste this in your browser and see what's happening.  comment out or delete this line when you get it cause it's un-needed\r\n");
        var response = this.request.Get(stationsEndpoint); // now we are implementing our HTTPRequest.Get method via our this.request object/instance.  I'm returning it to a variable called response for good measure although it might not be needed but can't hurt.                                                 
        var stationList = this.request.body; //If you were to load the URL that prints to the console telling you the URL, this is the body just what the web server spits out, a lot of JSON data                                                                                                                       
        stationList = JSON.parse(stationList).Stations; //This takes the body aka "stationList" and uses the JSON.parse to create an object.  Because of the way the data is formatted, there is a singular key Stations (uppercase) in their data that has an array filled with station Objects I want to return       
        return stationList; //returns an array of stations as objects                                                                                                                                                                                                                                                   
    }
    this.predictions = function(str) { //corresponds to the stations predictions fucntions in the API
        var str
        var predictionEndpoint = this.RequestURL.url +
            "StationPrediction.svc/json/GetPrediction/" + str +
            "?api_key=" + wmataApiKey;
        //	console.putmsg("\1h\1r" + predictionEndpoint + "\1h\1w\r\n FOR DEBUGGING\r\n@PAUSE@");
        var response = this.request.Get(predictionEndpoint);
        var predictionList = this.request.body;
        predictionList = JSON.parse(predictionList).Trains;
//		if (predictionList.length <= 5)
//			predictionList = "NO TIMES AVAILABLE";
//		console.putmsg(predictionList.length);
        return predictionList;
    }
    this.incidents = function() { //corresponds to the stations predictions fucntions in the API
        var incidentEndpoint = this.RequestURL.url +
            "Incidents.svc/json/Incidents?api_key=" + wmataApiKey;
        //		console.putmsg("\1h\1r" + incidentEndpoint + "\1h\1w\r\n FOR DEBUGGING\r\n@PAUSE@");
        var response = this.request.Get(incidentEndpoint);
        var incidentList = this.request.body;
        incidentList = JSON.parse(incidentList).Incidents;
        return incidentList;
    }
    this.stationinfo = function(str) { //corresponds to the stations predictions fucntions in the API
        var str
        var stationInfoEndpoint = this.RequestURL.url +
            "Rail.svc/json/JStationInfo?StationCode=" + str +
            "&api_key=" + wmataApiKey;
      //  console.putmsg("\1h\1r" + stationInfoEndpoint + "\1h\1w\r\n FOR DEBUGGING\r\n@PAUSE@");
        var response = this.request.Get(stationInfoEndpoint);
        var stationInfoList = this.request.body;
        stationInfoList = JSON.parse(stationInfoList).Name;
        return stationInfoList;
    }
}
var rail = new Rail(); //creates the Rail Object so you can use it.                                                                                                                                                                                                                                                     
function showStations(str) { // Just cycles through the array of stations and prints their names                                                                                                                                                                                                                            
    var stationsToShow = rail.stations(str); //calls the Rail.stations() functions and puts it in an  objects                                                                                                                                                                                                              
    for (i = 0; i < stationsToShow.length; i++) {
        var obj = stationsToShow[i];
        console.putmsg(obj.Code + " " + obj.Name + "\r\n"); //uses dot syntax to return the name and puts a return after each one.  obj[Name] would also work the same way.
    }
    console.pause();
    main();
}

function showTimes(str) {
    var str
	var lcol
	var yl = "\1h\1y"
	var rd = "\1h\1r"
	var bl = "\1h\1b"
	var or = "\1n\1y"
	var gr = "\1h\1g"
	var sv = "\1n\1w"
	
    console.clear();
		var stationName = JSON.stringify(rail.stationinfo(str));
		    bbs.menu("wmata/times"); 
		console.center(" \0014\1h\1w Station Information For " + stationName + "\r\n\r\n\1n");
    //write function to get station information. name, etc...
        var timesToShow = rail.predictions(str);

		if (timesToShow.length == 0) {
			console.gotoxy(20,10);
			console.putmsg(yl + "NO TIMES FOUND. METRO IS PROBABLY CLOSED.\1n\1w");
		} else {

	console.right(27);
    console.putmsg("\1n\1rLN CAR  DEST         MIN      \r\n");
	
    for (i = 0; i < timesToShow.length; i++) {
        var obj = timesToShow[i];

        if (obj.Line == "RD") {
            lcol = rd
        } else if (obj.Line == "SV") {
            lcol = sv
        } else if (obj.Line == "BL") {
            lcol = bl
        } else if (obj.Line == "YL") {
            lcol = yl
        } else if (obj.Line == "GR") {
            lcol = gr
        } else if (obj.Line == "OR") {
            lcol = or
        } else { lcol = "\1n\1w"
		}

		console.gotoxy(28,8+i);
		console.putmsg(lcol + obj.Line);
		console.gotoxy(32,8+i);
		console.putmsg(yl + obj.Car);
		console.gotoxy(36,8+i);
		console.putmsg(yl + obj.Destination);
		console.gotoxy(49,8+i);
		console.putmsg(yl + obj.Min);

    }
	}
	console.gotoxy(2,19);
    console.pause();
    main();
}

function showIncidents() {
    console.clear();
    bbs.menu("wmata/alerts");
    var icol
    var incidentsToShow = rail.incidents();
    for (i = 0; i < incidentsToShow.length; i++) {
        var obj = incidentsToShow[i];
        if (obj.IncidentType == "Alert") {
            icol = "\1n\1r"
        } else if (obj.IncidentType == "Delay") {
            icol = "\1n\1r"
        } else {
            icol = "\1n\1w"
        }
        obj.Description = word_wrap(obj.Description, 40);
        console.putmsg(icol + obj.IncidentType + ": \1h\1w" + obj.Description +
            "\r\n\1n");
    }
//	console.crlf();
    console.pause();
    main();
}

function showStationInfo(str) {
        var str
     //   var stationInfoToShow = rail.stationinfo(str);
        //for (i = 0; i < stationInfoToShow.length; i++) {
            var obj = stationInfoToShow[i];
            console.putmsg("Showing data for "+ obj.Name + "Station\r\n");
       // }
        //			console.pause();
        //			main();
    }
    //console.putmsg(JSON.stringify(rail.stations()));  // if you uncomment this you will see the raw return of the JSON's station request.  it's not exactly the same as the server data, it's the array contained in the Stations key.  
    //console.putmsg(JSON.stringify(rail.predictions())); 
    //console.putmsg(JSON.stringify(rail.incidents()));  
	//console.putmsg(JSON.stringify(rail.stationinfo("A11")));
    //showStations();     //calls the function to display the Stations, which in turn calls the function to go fetch the stations.
    //showIncidents();
    //showTimes()
	//showStationInfo("A11");
main();