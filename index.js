var http = require('http');
var _ = require('lodash');
var requireTree = require("require-tree");
var commandLineArgs = require('command-line-args');
var optionDefinations = [
    {name:'port',alias:'p',type:Number,defaultValue:8976},
    {name:'sqrLen',alias:'s',type:Number,defaultValue:50},
    {name:'players',alias:'n',type:Number,defaultValue:5}
]
var args = commandLineArgs(optionDefinations)
var server = http.createServer(handler);
var routes = {
    GET: {},
    POST: {}
};
var restRoutes = {
    GET: {},
    POST: {}
};
var runtime = {
    db: {}
};

var reqData = {
    GET: {},
    POST: {}
};

init();

function handler(req,res){
 console.log("in handler")
 var path = url.parse(req.url, true, true).pathname;
 var method = req.method;
     if (!routes[method][path]) {
        var p1 = path.split("/");
        var o = Object.keys(restRoutes[method]);
        var matched = false;
        for (var r = 0; r < o.length && matched == false; r++) {
            var rdata = restRoutes[method][o[r]];
            if (rdata.rest) {
                if (path.indexOf(o[r] + "/") == 0) {
                    matched = true;
                    path = o[r];
                    for (var i = 0; i < rdata.split.length; i++) {
                        if (!req.params) {
                            req.params = {};
                        }
                        if (rdata.split[i] != '')
                            req.params[rdata.split[i]] = p1[rdata.skip + i];
                    }
                }
            }
        }
        if (!matched)
            return res.sendJson({
                code: 404,
                message: "Not Found"
            }, 404);
    }
 
}

function initapis(functions, filename, path) {
   var apiPath = path.substring(__dirname.length, path.length - 3);
    var fun = _.without(_.keys(functions), "init");
    if (!functions.init) {
        console.log('init', filename);
    }
   functions.init(runtime);

   for (var i in fun) {
        var p = apiPath + "/" + fun[i];

        var rest = false,
            split = [],
            skip = 0;

        if (functions[fun[i]].conf.addToPath) {
            if (functions[fun[i]].conf.addToPath.indexOf(":") != -1) {
                skip = p.split("/").length;
                var temp = functions[fun[i]].conf.addToPath.split("/");
                for (var j = 0; j < temp.length; j++) {
                    split.push(temp[j].substr(1));
                } 
                rest = true;
            } else { 
                p += "/" + functions[fun[i]].conf.addToPath;
            }
        }
        p = p.toLowerCase();
        var pSplit = p.split("/")

        routes[functions[fun[i]].method][p] = functions[fun[i]].conf.handler;
        reqData[functions[fun[i]].method][p] = {
            path: p,

        }

   }
}

function initModels(functions, filename, path) {
    functions.init(runtime);
}

function init(){
requireTree("./apis/", {
        each: initapis
    });


requireTree("./models/", {
        each: initModels
    })
  console.log(routes, "routes====================");
    server.listen(args.port, "localhost", 1024, function() {
            console.log('Listening at http://0.0.0.0:' + args.port);
        });

}

