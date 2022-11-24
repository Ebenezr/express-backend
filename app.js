require('dotenv').config()
var express = require("express")
var app =express()
require('./setupMongo')();
app.use(express.json());

app.use("/auth",require("./routes/auth"))
app.use("/post",require("./routes/post"))
// app.get("/users/:userId",

// function (req, res){
//     res.send(req.params.userId);
// },

// function(req,res,next){
//     console.log("Request URL:", req.originalUrl);
//     next();
// }
// )
// const PostRoute = require("./routes/post");
// const AuthRoute = require("./routes/auth");
// app.use("/api/auth", AuthRoute);
// app.use("/api/post", PostRoute);
module.exports= app
