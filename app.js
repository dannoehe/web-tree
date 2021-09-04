var express = require('express');
var app = express();
var fs = require("fs");
// var tree = require("./tree");
const splitLines = str => str.split(/\r?\n/);

function parseTree(data) { 
    // console.log( data );

    arrayOfLines = splitLines(data);
    parsedData = {};
    for (let i=1; i< arrayOfLines.length; i++) {
        if (arrayOfLines[i].trim() == '') continue;

        attrs = arrayOfLines[i].split("\t");
        // console.log( attrs );
        lineData = {
            "id": attrs[0],
            "name":attrs[1],
            "description":attrs[2],
            "parent":attrs[3],
            "read_only":attrs[4],
        };
        // console.log( lineData );
        parsedData[attrs[0]] = lineData;
    }
    // console.log( `parsedData= ${parsedData}` );
    
    return parsedData; 
 } 

const PORT = process.env.PORT || 4001;

app.use(express.static(path.resolve(__dirname, './client/build')));

app.get("", (req, resp) => {
    resp.send("Hello Perry!");
});

app.get('/tree', (req, resp) => {
    console.log("accessing /tree...");
    fs.readFile( __dirname + "/" + "tree_data.csv", 'utf8', function (err, data) {

        respContent = parseTree(data);

        resp.json( respContent );
     });
});

app.post('/', function (req, res) {
    console.log("Got a POST request for the homepage");
    res.send('Hello POST');
 })
 
 app.delete('/', function (req, res) {
    console.log("Got a DELETE request for /del_user");
    res.send('Hello DELETE');
 })

app.listen(PORT, () => {
    console.log(`app is on port ${PORT}`);
});