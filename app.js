const app = require("express")();
const PORT = 4000;
app.get("", (req, resp) => {
    resp.send("Hello Perry!");
});

app.listen(4000, () => {
    console.log('app is on port 4000');
});