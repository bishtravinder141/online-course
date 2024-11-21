const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const cookieParser = require("cookie-parser");

require("./config/db")
const userRouter=require("./routes/userRoutes")
const postRouter=require("./routes/postRoutes")

const PORT=4087
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());

app.use("/api/v1", userRouter);
app.use("/api/v1", postRouter);

app.listen(PORT,()=>{
    console.log("app is working on port")
})