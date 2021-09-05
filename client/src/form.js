import React, { useState } from 'react';
import DataService from './server';



export function NewNodeForm(parent) {
  const nameEl = React.useRef(null);
  const descriptionEl = React.useRef(null);
  const roEl = React.useRef(null);

const handleSubmit = e => {
  e.preventDefault();
  
  const data = {
    parent: parent['id'],
    name: nameEl.current.value,
    description: descriptionEl.current.value,
    readonly: roEl.current.value === "NO" ? "0" : "1",
  }

  var treeArray = [];
  Promise.resolve(DataService.createNode(data))
  .then((obj) => {
    for(var i in obj)
      treeArray.push(obj[i]);
  }).
  then(() => {
    console.log(`treeArray=` + JSON.stringify(treeArray));
    return { treeData : treeArray , currentNode: parent};
  });
};

return (
   <form onSubmit={handleSubmit}>
     <label>Name:
       <input type="text" ref={nameEl} />
     </label>
     <label>Description:
       <input type="text" ref={descriptionEl} />
     </label>
     <label>Read-only?
       <input type="text" placeholder="NO" ref={roEl} />
     </label>
     <input type="submit" name="Submit" />
   </form>
 );
}

export default NewNodeForm;