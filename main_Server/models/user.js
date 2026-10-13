// create the mongo DB database  set up 



const mongoose = require("mongoose")  // import the mongoDB as the mongoose--->

//  create the user schema architecture    in the  database format --->
const userschema =  new mongoose.Schema(
    {
        name :{
        type: String ,
        required : true ,
        trim :true
        }
    ,

    email :{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
    },

    password: {
        type: String,
        required:true,
    },
    },
    {
        timestamps :true,
    }
);


//Export the  schema in the   other files   ( resuable use in every file )
module.exports = mongoose.model("user",userschema);