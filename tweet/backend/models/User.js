const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true,"enter user name "],
    },
    email:{
        type: String,
        required:
        [true,"enter email"],
        unique: true
,    },
password:{
    type: String,
    required: [true,"enter password"],
}
},{
    timestamps: true,
})
module.exports = mongoose.model("User", userSchema);
