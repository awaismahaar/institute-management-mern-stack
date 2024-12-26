const express = require("express");
const mongoose = require("mongoose");
const userRoute = require("./routes/userRoute");
const studentRoute = require("./routes/studentRoute");
const courseRoute = require("./routes/courseRoute");
const feeRoute = require("./routes/feeRoute");
const fileUpload = require("express-fileupload");
var bodyParser = require('body-parser')
const cors = require("cors");



const app = express();

// connect with database
mongoose.connect("mongodb+srv://awaismahaar499:Awa305is@cluster0.ij0ve.mongodb.net/institute")
.then(()=> console.log("connected to database"))
.catch((err) => console.log(err));

app.use(cors());
app.get("/", (req, res) => {
   return res.send("<h1>Welcome to Institute Management</h1>");
})


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
app.use(fileUpload({
    useTempFiles : true,
   /*  tempFileDir : '/tmp/' */
}));
// Routes
app.use("/user", userRoute);
app.use("/student", studentRoute);
app.use("/course", courseRoute);
app.use("/fee", feeRoute);

app.use("*" , (req , res)=>{
    return res.status(404).json({
        message : "Route not found"
    })
})
const PORT = 3000;
app.listen(PORT , ()=> console.log("listening on port 3000"))