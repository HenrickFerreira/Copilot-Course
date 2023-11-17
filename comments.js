// Create web server

var http = require("http");
var url = require("url");
var fs = require("fs");
var qs = require("querystring");
var ejs = require("ejs");

// Create server
http.createServer(function(req, res) {
    var urlObj = url.parse(req.url, true, false);
    var pathname = urlObj.pathname;
    var method = req.method.toLowerCase();

    if(pathname == "/") {
        // Read file
        fs.readFile("./views/index.ejs", "utf-8", function(err, data) {
            if(err) {
                throw err;
            }

            // Render page
            res.writeHead(200, {"Content-Type": "text/html"});
            res.end(ejs.render(data));
        });
    } else if(pathname == "/comment") {
        if(method == "get") {
            // Get data from file
            fs.readFile("./data/comments.json", "utf-8", function(err, data) {
                if(err) {
                    throw err;
                }

                // Send data to client
                res.writeHead(200, {"Content-Type": "text/plain"});
                res.end(data);
            });
        } else if(method == "post") {
            // Get data from client
            var str = "";
            req.on("data", function(chunk) {
                str += chunk;
            });
            req.on("end", function() {
                var data = qs.parse(str);
                // Read data from file
                fs.readFile("./data/comments.json", "utf-8", function(err, comments) {
                    if(err) {
                        throw err;
                    }

                    // Convert data to JSON
                    comments = JSON.parse(comments);
                    // Add data to JSON
                    comments.push(data);
                    // Convert data to string
                    comments = JSON.stringify(comments);
                    // Write data to file
                    fs.writeFile("./data/comments.json", comments, function(err) {
                        if(err) {
                            throw err;
                        }

                        // Send data to client
                        res.writeHead(200, {"Content-Type": "text/plain"});
                        res.end(comments);
                    });
                });
            });
        }
    } else {
        // Read file
        fs.readFile("." + pathname, function(err, data) {
            if(err) {
                throw err;
            }

            // Send file to client
            res.writeHead(200, {"Content-Type": "text/plain"});
            res.end(data);
        });