var express = require('express');
var app = express();
var fs = require("fs");
const path = require('path');
const bodyParser = require("body-parser");
// var tree = require("./tree");
const splitLines = str => str.split(/\r?\n/);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

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

function get_new_id() { 
    var biggest_id = 0;

    for (var index in ORIGINAL_TREE) {
        id = parseInt(index);
        if (id > biggest_id)  biggest_id = id;
    }
    biggest_id++;
    
    return biggest_id.toString(); 
 } 

const PORT = process.env.PORT || 4001;

var ORIGINAL_TREE = {};

app.use(express.static(path.resolve(__dirname, './client/build')));

app.get("", (req, resp) => {
    resp.send("Hello Perry!");
});

app.get('/tree', (req, res) => {
    console.log("Got a GET request: /tree");
    fs.readFile( __dirname + "/" + "tree_data.csv", 'utf8', function (err, data) {

        ORIGINAL_TREE = parseTree(data);
        console.log("ORIGINAL_TREE=" + JSON.stringify(ORIGINAL_TREE));
        var nodes = [];
        for (let id in ORIGINAL_TREE) {
            var node = ORIGINAL_TREE[id];
            console.log("node=" + JSON.stringify(node));
            if (node["parent"] == '0') {
                nodes.push(node);
            }
        }

        res.json( nodes );
     });
});
  
  function extractAsCSV(nodes) {
    const header = ["id name    description parent  read_only"];
    if (nodes == null || nodes.length == 0) {
        return header.toString();
    } else {
        const rows = nodes.map(node =>
           `${node.id}  ${node.name}    ${node.description} ${node.parent} ${node.read_only}`
        );
        return header.concat(rows).join("\n");
    }
  }
  
app.get('/treedownload', function (req, res) {
   const node_id = req.query.id;
   console.log(`node_id=` + node_id);
   var data = req.body;
   console.log("Got a DOWNLOAD request: /treedownload/ with node_id: " + JSON.stringify(node_id));

   var nodes = [];
   for (let id in ORIGINAL_TREE) {
       var node = ORIGINAL_TREE[id];
    //    if (node["parent"] == data['parent']) {
    //        nodes.push(node);
    //    }
        nodes.push(node);
   }
   console.log(`nodes=` + JSON.stringify(nodes));

   const file_to_download = __dirname + '/download_folder/downloaded_tree_data.csv';
   console.log(`file_to_download=` + file_to_download);
    fs.writeFile(file_to_download, extractAsCSV(nodes), err => {
      if (err) {
        console.log('Error writing to csv file', err);
      } else {
        console.log(`saved as ${file_to_download}`);
        res.download(file_to_download);
      }
    });
 })

app.get('/node', function (req, res) {
     console.log("Got a GET request: /node/");
     const node_id = req.query.id;
     console.log("node_id=" + node_id);
 
     var nodes = [];
     for (let id in ORIGINAL_TREE) {
         var node = ORIGINAL_TREE[id];
         // console.log("node=" + JSON.stringify(node));
         if (node["parent"] == node_id) {
             nodes.push(node);
         }
     }
 
     res.json( nodes );
})

app.get('/parentnode', function (req, res) {
    console.log("Got a GET request: /parentnode/");
    const node_id = req.query.id;
    console.log("node_id=" + node_id);

    var nodes = [];
    var parent_id = '0';
    for (let id in ORIGINAL_TREE) {
        var node = ORIGINAL_TREE[id];
        // console.log("node=" + JSON.stringify(node));
        if (node["id"] == node_id) {
            parent_id = node["parent"];
            break;
        }
    }
    console.log("parent_id=" + parent_id);
    if(parent_id != '0') {
        for (let id in ORIGINAL_TREE) {
            var node = ORIGINAL_TREE[id];
            // console.log("node=" + JSON.stringify(node));
            if (node["id"] == parent_id) {
                nodes.push(node);
                break;
            }
        } 
    }

    res.json( nodes );
})

 app.put('/node', function (req, res) {
    const node_id = req.query.id;
    console.log(`node_id=` + node_id);
    var data = req.body;
    console.log("Got a POST request: /nodes/ with data: " + JSON.stringify(data));
    
    ORIGINAL_TREE[node_id]["name"] = data['name'];

    var nodes = [];
    for (let id in ORIGINAL_TREE) {
        var node = ORIGINAL_TREE[id];
        if (node["parent"] == data['parent']) {
            nodes.push(node);
        }
    }
    console.log(`nodes=` + JSON.stringify(nodes));

    res.json( nodes );
  })

 app.post('/nodes', function (req, res) {
    console.log(`req.body=` + req.body);
     var data = req.body;
     console.log(`data=` + JSON.stringify(data));
    console.log("Got a POST request: /nodes/ with data: " + data);
    if (data['id'] in ORIGINAL_TREE) {
        return;
    }

    var new_id = get_new_id();
    var nodeData = {
        "id": new_id,
        "name":data['name'],
        "description":data['description'],
        "parent":data['parent'],
        "read_only":data['read_only'],
    };
    ORIGINAL_TREE[new_id] = nodeData;

    console.log(`ORIGINAL_TREE=` + JSON.stringify(ORIGINAL_TREE));

    var nodes = [];
    for (let id in ORIGINAL_TREE) {
        var node = ORIGINAL_TREE[id];
        if (node["parent"] == data['parent']) {
            nodes.push(node);
        }
    }
    console.log(`nodes=` + JSON.stringify(nodes));

    res.json( nodes );
  })
 
 app.delete('/node', function (req, res) {
    const node_id = req.query.id;
    console.log("Got a DELTE request: /node/ with id: " + node_id);
    
    ORIGINAL_TREE[node_id] = {}

    res.send('DELETE OK');
 })

app.listen(PORT, () => {
    console.log(`app is on port ${PORT}`);
});