import http from "./http-common";
import download from 'js-file-download';

class DataService {

  getAll() {
    return http.get("/tree")
    .then((res) => {
        // console.log(`data=` + JSON.stringify(res.data))
        return res.data;
    });
  }

  getChildren(id) {
    return http.get(`/node?id=${id}`)
    .then((res) => {
        // console.log(`data=` + JSON.stringify(res.data))
        return res.data;
    });
  }

  getParent(id) {
    return http.get(`/parentnode?id=${id}`)
    .then((res) => {
        console.log(`getParent=` + JSON.stringify(res.data))
        return res.data;
    });
  }

  createNode(node_data) {
    console.log(`createNode.node_data=` + JSON.stringify(node_data))
    // return http.post("/nodes", {data: node_data})
    return fetch("/nodes", {
        method: "POST", 
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify(node_data),
      })
    .then(response => response.json())
    .then((res) => {
        console.log(`res=` + res);
        return res;
    });
  }

  update(id, data) {
    return http.put(`/node?id=${id}`, data)
    // .then(response => response.json())
    .then((res) => {
        console.log(`res=` + res.data);
        return res.data;
    });;
  }

  downloadTree(id) {
    return http.get(`/treedownload?id=${id}`, {
        responseType: 'blob',
        headers: {
            'Content-Type': 'text/csv',
        }
    })
    .then((res) => {
        console.log(`res=` + res.headers);
        download(res.data, 'downloaded_tree_data.csv');
    });;
  }
}

export default new DataService();
