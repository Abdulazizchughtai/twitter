const mongoose = require("mongoose");

const tweetSchema = new mongoose.Schema({
    text: {
        type: String,
        required: [true, "Tweet text is required"],
    
    },
    author: {
        type: String,
        required: [true, "Author is required"],

    },
    likes:{
        type:Number,
        default: 0,
    },
    comments:[{
        text:String,
        author:String,
        createdAt: String,

    },]


},{
    timestamps: true,
}) 
module.exports = mongoose.model("Tweet", tweetSchema);

