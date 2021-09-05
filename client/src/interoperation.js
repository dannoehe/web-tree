import React from "react";


export function GetTree() {
  const [data, setData] = React.useState(null);

  React.useEffect(() => {
    fetch("/tree")
      .then((res) => res.json())
      .then((data) => setData(data));
  }, []);

  // console.log(`data=${data}`)
  return data;
}

export function GetNode(node) {
  const [data, setData] = React.useState(null);

  React.useEffect((node) => {
    fetch("/node/" + node.id)
      .then((res) => res.json())
      .then((data) => setData(data));
  }, []);

  // console.log(`data=${data}`)
  return data;
}

export default GetTree;