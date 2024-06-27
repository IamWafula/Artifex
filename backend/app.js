require('dotenv').config();

const express = require("express")
const app = express()

const gen_routes = require("./routes/generation-routes")

const PORT = 3000;
app.use(express.json());

app.use("/generate", gen_routes)


app.get("/", (req, res) => {
    return res.json({"response" : "You a'ight"})
})

app.listen(PORT, ()=> {
    console.log(`Server running on port ${PORT}`)
})


module.exports = app;
