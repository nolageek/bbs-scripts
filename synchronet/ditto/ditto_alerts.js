load("http.js"); //this loads the http libraries which you will need to make requests to the web server
load("sbbsdefs.js");
load('oauth.js');

var command = argv[0]; 

// if command is omitted, let sysop know via notification.
	if (command == null) {
		var message = "No command specified.";
	} else {
// otherwise create notification in form of "COMMAND: username(#0) from IP_ADDR"
		var message = command.toUpperCase() + ": " + user.alias + "(#" + user.number + ")";
	}


var file = new File("/sbbs/mods/ditto/ditto_options.ini");
if (!file.open("r"))
alert("Error opening file: /sbbs/mods/ditto/ditto_options.ini");

var alert_options = file.iniGetKeys("ALERTS");
var use_pushover = 0;
if (alert_options.PO_APPTOKEN && alert_options.PO_USERKEY) {
    use_pushover = 1;
    var poAppToken = alert_options.PO_APPTOKEN;
    var poUserKey = alert_options.PO_USERKEY;
}

var use_twitter = 0;
if (alert_options.TW_CONSUMER_SECRET && alert_options.TW_ACCESS_TOKEN) {
    use_twitter = 1;
    var tw_secret = alert_options.TW_CONSUMER_SECRET;
    var tw_key = alert_options.TW_CONSUMER_KEY;
    var tw_token = alert_options.TW_ACCESS_TOKEN
    var tw_token_secret = alert_options.TW_ACCESS_TOKEN_SECRET
}

var ignoreSysop = [alert_options.IGNORE_SYSOP]; 


function pushover(command) {
// Set up the POST data for pushover
	var postdata = "token=" + poAppToken
			+ "&user=" + poUserKey
			+ "&message=" + message;
	
		this.request = new HTTPRequest();
		this.RequestURL = new URL("http://api.pushover.net/1/messages.json");
		var currentEndpoint = this.RequestURL.url;
		response = this.request.Post(currentEndpoint,postdata);

	}


var Twitter = function (key, secret, token, token_secret) {
        var self = this;
    
        this.api_url = 'https://api.twitter.com/1.1';
        this.key = key;
        this.secret = secret;
        this.token = token;
        this.token_secret = token_secret;
    
        var endpoints = {
            statuses : {
                update : {
                    method : 'tweet',
                    required : { status : '' },
                    http_method : 'post'
                }
    
            }
        };
    
        /*	Send a signed OAuth1 POST request to this.api_url + 'path'.
            POST data will be constructed from key/value pairs in 'obj'. */
        this.post = function (path, obj) {
            return JSON.parse(
                (new OAuth1_Client()).post(
                    this.api_url + path, obj,
                    this.key, this.secret, this.token, this.token_secret
                )
            );
        }
    
        // Populate methods from described REST API endpoints
        function methodist(obj, path) {
            for (var property in obj) {
                if (typeof obj[property].method === 'undefined') {
                    methodist(obj[property], path + property + '/');
                } else {
                     (function (obj, property, path) {
                         self[obj[property].method] = function (data) {
                            if (typeof data === 'undefined') var data = {};
                            if (typeof obj[property].required === 'object') {
                                for (var r in obj[property].required) {
                                    if (typeof data[r] !==
                                        typeof obj[property].required[r]
                                    ) {
                                        throw obj[property].method + ': missing ' + r;
                                    }
                                }
                            }
                            return self[obj[property].http_method](
                                path + property + '.json', data
                            );
                        }
                    })(obj, property, path);
                }
            }
        }
        methodist(endpoints, '/');
    
    }


    var options = load({}, 'modopts.js', 'twitter');

if (argv.length < 1) exit();





if (ignoreSysop == 1 && is_sysop)
    pushover(command);

if (ignoreSysop == 1 && is_sysop)
    try {
	    (new Twitter(
		    options.consumer_key, options.consumer_secret,
		    options.access_token, options.access_token_secret
	        )).tweet({ status : command.toUpperCase() + ': ' + user.alias + ' on node #'+ bbs.node_num });
        } catch (err) {
            log(LOG_ERR, err);
        }