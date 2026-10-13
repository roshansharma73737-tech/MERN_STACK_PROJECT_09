// Creation of the server 

const express = require("express");

const  mongooes = require("mongoose");

const cors = require("cors");

const dotenv = require("dotenv");

// import eh paths =------>
const authentication = require("./router/auth_routes");
const payments_routes =  require("./router/payment_routes");

dotenv.config();   // set up the environments for the  secrect key  :--

const  app = express();
const  port = process.env.Port || 5000;


app.use(cors());

app.use(express());


// server routes set up :-
app.use("/api/Authentication",authentication);

//server the  payment-section  steup --->
app.use("/api/payment/", payments_routes);

//  check the   routes of the authentication perfeclty:-
app.get("/",(req,res)=>{
    res.json({message :  " The  backend  authentication routes  is running  perfectly ",});
});


//mongoose  database set up --->
mongooes
.connect(process.env.MongoDB)

.then(()=>{
    console.log("MongoDB connected sucesssfully !");

    app.listen(port , ()=>{
        console.log(`server running  on http:/localhost:${port}`);
    });
})
.catch ((error) =>{
    console.error("MongoDB   connection failed: !",error);
});