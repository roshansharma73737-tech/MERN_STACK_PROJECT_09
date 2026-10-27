// create the mongo DB database  set up 



const mongoose = require("mongoose")  // import the mongoDB as the mongoose--->

//  create the user schema architecture    in the  database format --->
const userschema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            maxlength: 254
        },
        password: {
            type: String,
            required: true,
            select: false
        }
    },
    {
        timestamps: true
    }
);


// The unique email index and hashed password support persistent account login.
module.exports = mongoose.model("user",userschema);