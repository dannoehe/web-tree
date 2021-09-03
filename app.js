const app = require("express")();
const PORT = process.env.PORT || 4001;
app.get("", (req, resp) => {
    resp.send("Hello Perry!");
});

app.listen(PORT, () => {
    console.log(`app is on port ${PORT}`);
});