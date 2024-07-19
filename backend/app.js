require('dotenv').config();

const express = require("express")
const app = express()
const cors = require('cors');

const gen_routes = require("./routes/generation-routes")
const user_routes = require("./routes/user-routes")
const image_routes = require("./routes/image-routes.js")
const post_routes = require("./routes/post-routes.js")
const bid_routes = require("./routes/bid-routes.js")

const { NotFoundError, ExistingUserError, NoUserFound } = require('./middleware/CustomErrors');

const PORT = 3000;
app.use(cors());
app.use(express.json());
app.use("/generate", gen_routes)
app.use("/user", user_routes)
app.use("/images", image_routes )
app.use("/posts",post_routes )
app.use("/bids", bid_routes)

app.get("/", (req, res) => {
    return res.json({"response" : "You a'ight"})
})

// error handling
app.use((req, res, next) => {
    next(new NotFoundError());
});

app.use((err, req, res, next) => {
    if (err instanceof NotFoundError) {
      return res.json({ error: err.message });
    } else if (err instanceof ExistingUserError) {
      return res.json({ error: err });
    } else if (err instanceof NoUserFound) {
      return res.json({ error: err });
    } else {
      console.log(err)
      return res.json({ error: 'Something went wrong!' });
    }

});


app.listen(PORT, ()=> {
    console.log(`Server running on port ${PORT}`)
})


module.exports = app;
