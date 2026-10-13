// import the  express for the   create the api  enpoints 

const express = require("express");

const jwt = require("jsonwebtoken"); // for the   authentication ---/

const bcryptjs = require("bcryptjs") // for the password  convert into the hash based  password ---?

const user =  require("../models/user");  // import eh  models    in the database 
const { Route } = require("react-router-dom");
const user = require("../models/user");
const user = require("../models/user");

const Router = express.Router();


// for the sign up 
Route.post("/signup", async(req, res)=>{
    try {
        const  {name, email,password} =req.body;

        if (!name || !email || !password){
            return  res.status(400).json({message : " Name, Email, and password are required!"});
        }

        // check user exist or not
        const exists_user = await  user.findOne({
            email: email.toLowerCase(),
        });

        if (exists_user ){
            return  res.status(409).json({message : "Email already register ! "});

        }

        // create the hash password -->
        const hash_password =  await bcrypt.hash(password, 10);

        const user = await user.create({
            name,
            email: email.toLowerCase(),
            password: hash_password,
        });
        res.status(201).json({message : "Account is created sucessfully ! ",
            user: {
                id:user._id,
                name:user.name,
                email:user.email,
            }
        });

    }catch (error){
        console.error("sigup  error:",error);
        res.status(500).json({message :"Signup  failed !"});
    }
});


Router.post("login" , async(req, res) =>{
    try{
        const {email , password} = req.body;

        // check the data fields =-->
        if (!email || !password){
            return res.status(400).json({message : "Email and  Password are required !"});
        }

        // find the user -->
        const user = await user.findOne({
            email: email.toLowerCase(),
        });
        if (!user) {
            return res.status(401).json({message : " Invalid Email and Password !"});
        }

        const  token =  jwt.sign({
            userId:user._id,
            email:user.email,
        },
        process.env.JWT_SECRETkey,
        {expiresIn :" 1d",}
    );

    res.json({ message : "Login  sucessfully !", 
        token,  
        user:{
            id:user._id,
            name:user.name,
            email:user.email,
        },
    });

    } catch (error){
        console.error("Login Error.. !",error);

        res.status(500).json({message : "Sever Error !"});
    }
});

module.exports  = Router;