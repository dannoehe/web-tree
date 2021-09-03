const app = require("express")();
const PORT = 3000;
app.get("", (req, resp) => {
    resp.send("Hello Perry!");
});

app.listen(PORT, () => {
    console.log('app is on port 3000');
});