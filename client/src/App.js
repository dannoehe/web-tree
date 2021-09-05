import React, { Component } from 'react';
// import SortableTree, { toggleExpandedForAll } from 'react-sortable-tree';
// import FileExplorerTheme from 'react-sortable-tree-theme-file-explorer';
// import FileExplorerTheme from './theme';
import './App.css';
// import { GetTree, GetNode } from './interoperation';
import DataService from './server';
// import {NewNodeForm} from './form';

const msg_none_selected = 'Please select one node to operate';
const msg_multiple_selected = 'Please select only one node to operate';
const msg_no_child_node = 'No child node found';
const msg_no_parent_node = 'No parent node found';
const msg_no_name_node = 'Name is not specified';
const msg_unable_edit_readonly = 'Unable to update/delete read-only node';


class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      treeData : [],
      currentNode: {},
    };

    this.getTreeRoot = this.getTreeRoot.bind(this);
    this.navigate = this.navigate.bind(this);
    this.navigateParent = this.navigateParent.bind(this);
    this.createNode = this.createNode.bind(this);
    this.create = this.create.bind(this);
    this.rename = this.rename.bind(this);
    this.delete = this.delete.bind(this);
    this.download = this.download.bind(this);

    this.getTreeRoot();
  }


  getTreeRoot = () => {
    // console.log(`this.state.treeData=` + this.state.treeData)
    var treeArray = [];
    Promise.resolve(DataService.getAll())
    // .then(JSON.parse)
    .then((obj) => {
      // console.log(`obj=` + obj);
      for(var i in obj)
        treeArray.push(obj[i]);
    }).
    then(() => {
      console.log(`treeArray=` + JSON.stringify(treeArray));
      this.setState({ treeData : treeArray, currentNode: {} });
    });
  }

  navigate = () => {
    var checkboxes = document.querySelectorAll('input[type=checkbox]:checked')
    if (checkboxes.length == 0) {
      alert(msg_none_selected);
      return;
    }
    if (checkboxes.length > 1) {
      alert(msg_multiple_selected);
      return;
    }

    var treeArray = [];
    Promise.resolve(DataService.getChildren(checkboxes[0].id))
    .then((obj) => {
      for(var i in obj)
        treeArray.push(obj[i]);
    }).
    then(() => {
      console.log(`treeArray=` + JSON.stringify(treeArray));
      if(treeArray.length == 0) {
        alert(msg_no_child_node);
        return;
      } else {
        this.setState({ 
          treeData : treeArray, 
          currentNode: {'id': checkboxes[0].id, 'name': checkboxes[0].name},
        });
      }
    });
  }

  navigateParent = () => {
    var parentNode = {};
    var treeArray = [];

    var current_node_id = this.state.currentNode && this.state.currentNode['id'] ? this.state.currentNode['id'] : '0';
    console.log(`current_node_id=` + current_node_id);
    if (current_node_id === '0') {
      alert(msg_no_parent_node);
      return;
    }

    DataService.getParent(current_node_id)
    .then((parent) => {
      var parent_id = '0';
      if (parent.length > 0) {
        parentNode = parent[0];
        parent_id = parent[0]['id'];
      }
      console.log(`parent_id=` + parent_id);

          DataService.getChildren(parent_id)
          .then((obj) => {
            for(var i in obj)
              treeArray.push(obj[i]);
          }).
          then(() => {
            console.log(`treeArray.2=` + JSON.stringify(treeArray));
            if(treeArray.length == 0) {
              alert(msg_no_child_node);
              return;
            } else {
              this.setState({ treeData : treeArray , currentNode: parentNode});
            }
          });
    })
  }
  
  createNode =() => {
    console.log(`this.state=` + JSON.stringify(this.state.currentNode));

    var new_node_name = document.getElementById("new_node_name");
    var new_node_desc = document.getElementById("new_node_desc");
    var new_node_name = document.getElementById("new_node_name");

    const data = {
      parent: this.state.currentNode['id']? this.state.currentNode['id'] : "0",
      name: new_node_name? new_node_name.value : "",
      description: new_node_name? new_node_name.value : "",
      read_only: new_node_name && new_node_name.value == "no" ? "0" : "1",
    }
  
    var treeArray = [];
    Promise.resolve(DataService.createNode(data))
    .then((obj) => {
      for(var i in obj)
        treeArray.push(obj[i]);
    }).
    then(() => {
      console.log(`treeArray=` + JSON.stringify(treeArray));
      return { treeData : treeArray , currentNode: this.state.currentNode, };
    });
  };

  create = () => {
    var current_node = document.getElementById("current_node");
    var creation_div = document.getElementById("creation_div");
    if (creation_div == null) {

      var nHTML = '<div id="creation_div">';
      nHTML += '<label for="fname">Please click "Create" to create the New Node</label><br><br>';
      nHTML += '<label for="fname">Name:</label>';
      nHTML += '<input type="text" id="new_node_name" name="fname"><br><br>';
      nHTML += '<label for="lname">Description:</label>';
      nHTML += '<input type="text" id="new_node_desc" name="lname"><br><br>';
      nHTML += '<label for="lname">Read Only:</label>';
      nHTML += '<input type="text" id="new_node_ro" name="lname"><br><br>';
      // nHTML += '<button onClick={this.createNode}>Create Node</button>';
      nHTML += '</div>';

      var para = document.createElement("div"); 
      para.innerHTML = nHTML;
      current_node.appendChild(para);
    } else {
      console.log(`this.state=` + JSON.stringify(this.state.currentNode));

    var new_node_name = document.getElementById("new_node_name");
    var new_node_desc = document.getElementById("new_node_desc");
    var new_node_ro = document.getElementById("new_node_ro");

    if(new_node_name == null || new_node_name.value === ''){
      alert(msg_no_name_node);
      return;
    }

    const data = {
      parent: this.state.currentNode['id']? this.state.currentNode['id'] : "0",
      name: new_node_name? new_node_name.value : "",
      description: new_node_desc? new_node_desc.value : "",
      read_only: new_node_ro && new_node_ro.value == "no" ? "0" : "1",
    }
  
    var treeArray = [];
    Promise.resolve(DataService.createNode(data))
    .then((obj) => {
      // console.log(`obj=` + JSON.stringify(obj));
      for(var i in obj)
        treeArray.push(obj[i]);
    }).
    then(() => {
      console.log(`treeArray=` + JSON.stringify(treeArray));
      current_node.innerHTML = '<div/>';
      this.setState({ treeData : treeArray , currentNode: this.state.currentNode, });
    });
    }
  }

  delete = () => {
    var checkboxes = document.querySelectorAll('input[type=checkbox]:checked');
    if (checkboxes.length == 0) {
      alert(msg_none_selected);
      return;
    }
    if (checkboxes.length > 1) {
      alert(msg_multiple_selected);
      return;
    }

    var node_delete = this.getNodeInCurrentList(checkboxes[0]['id']);
    if(node_delete["read_only"] == '1'){
      alert(msg_unable_edit_readonly);
      return;
    }

    var parent = this.state.currentNode['id']? this.state.currentNode['id'] : "0";

    var treeArray = [];
    Promise.resolve(DataService.delete(node_delete['id']))
    .then(() => DataService.getChildren(parent))
    .then((obj) => {
      for(var i in obj)
        treeArray.push(obj[i]);
    }).
    then(() => {
      console.log(`treeArray=` + JSON.stringify(treeArray));
      this.setState({ treeData : treeArray , currentNode: this.state.currentNode});
    });
  }

  download = () => {
    var checkboxes = document.querySelectorAll('input[type=checkbox]:checked');
    if (checkboxes.length > 1) {
      alert(msg_multiple_selected);
      return;
    }

    var tree_id = '0';
    if (checkboxes.length == 1) {
      tree_id = checkboxes[0].id;
    }

    DataService.downloadTree(tree_id);
    // .then(() => {
      console.log(`downloaded!`);
    // });
  }

  getNodeInCurrentList(id){
    console.log(`getNodeInCurrentList.id=` + id);
    var node = {};
    for ( var index in this.state.treeData){
      var treeNode = this.state.treeData[index];
      if (treeNode['id'] == id) {
        node = treeNode;
        break;
      }
    }

    console.log(`getNodeInCurrentList.node=` + JSON.stringify(node));
    return node;
  }

  rename = () => {
    var checkboxes = document.querySelectorAll('input[type=checkbox]:checked')
    if (checkboxes.length == 0) {
      alert(msg_none_selected);
      return;
    }
    if (checkboxes.length > 1) {
      alert(msg_multiple_selected);
      return;
    }

    var node_rename = this.getNodeInCurrentList(checkboxes[0]['id']);
    if(node_rename["read_only"] == '1'){
      alert(msg_unable_edit_readonly);
      return;
    }

    var current_node = document.getElementById("current_node");
    var update_div = document.getElementById("update_div");
    if (update_div == null) {

      var nHTML = '<div id="update_div">';
      nHTML += '<label for="fname">Please click "Rename" to update the Node</label><br><br>';
      nHTML += '<label for="fname">New Name:</label>';
      nHTML += '<input type="text" id="new_node_name" name="fname"><br><br>';
      nHTML += '</div>';

      var para = document.createElement("div"); 
      para.innerHTML = nHTML;
      current_node.appendChild(para);
    } else {
      console.log(`this.state=` + JSON.stringify(this.state.currentNode));

    var new_node_name = document.getElementById("new_node_name");
    if(new_node_name == null || new_node_name.value === ''){
      alert(msg_no_name_node);
      return;
    }

    const data = {
      name: new_node_name.value,
      parent: this.state.currentNode['id']? this.state.currentNode['id'] : "0",
    }

    var treeArray = [];
    Promise.resolve(DataService.update(checkboxes[0].id, data))
    .then((obj) => {
      // console.log(`obj=` + JSON.stringify(obj));
      for(var i in obj)
        treeArray.push(obj[i]);
    }).
    then(() => {
      console.log(`treeArray=` + JSON.stringify(treeArray));
      current_node.innerHTML = '<div/>';
      this.setState({ treeData : treeArray , currentNode: this.state.currentNode, });
    });
    }
  }

  render() {
    // return <h2>Hi, I am a Car!</h2>;
    const {
      treeData,
      currentNode,
    } = this.state;

    
    var rows = [];
    for ( var index in this.state.treeData){
      // console.log(`node=` + JSON.stringify(index))
      // console.log(`item=` + JSON.stringify(this.state.treeData[index]))
      var node = this.state.treeData[index];
      rows.push(<tr><td><input type="checkbox" id={node["id"]} name={node["name"]}></input></td><td>{node["id"]}</td><td>{node["name"]}</td><td>{node["description"]}</td></tr>);
    }

    return (
      <div
        style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}
      >
        <div id='header_banner' style={{ flex: '0 0 auto', padding: '0 15px' }}>
          <h3>Tree Nodes</h3>
          <button onClick={this.getTreeRoot}>Restore Tree</button>
          <button onClick={this.download}>Download Tree</button>
          <button onClick={this.navigate}>Navigate</button>
          <button onClick={this.navigateParent}>Back To Parent</button>
          <button onClick={this.create}>Create</button>
          <button onClick={this.rename}>Rename</button>
          <button onClick={this.delete}>Delete</button>
          <h3 id='current_node'></h3>
        </div>

        <div id='nodes' style={{ flex: '1 0 50%', padding: '0 0 0 15px' }}>
        <table>
        <thead>
          <tr>
            <th>Selected</th>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
        </div>
        {/* <script type="text/javascript">
          var nodes = document.getElementById("nodes");
          var nHTML = '';
          for (var node in this.state.treeData) {
            nodes.appendChild(document.createElement("P"));
            // nHTML += '<p>' + node["name"] + '</p>'
            //         + '<p>       ' + node["description"] + '</p><br></br>'
            var para = document.createElement("P"); 
            var t = document.createTextNode(node["description"]);      // Create a text node
            para.appendChild(t); 
            nodes.appendChild(para);
            <button onClick={this.getNode}>node["name"]</button>
            <p>node["description"]</p>
          }
          nodes.innerHTML = nHTML;
        </script> */}
      </div>
    );
  }
}

export default App;