const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required:true,
        trim:true,
    },

    email: {
        type:String,
        required:true,
        unique:true,
        trim:true,
        match:[/.+\@.+\..+/,"Please enter a valid email address"],

    },
    password:{
        type:String,
        required:true,
        minLength:6,

    },

    role:{
        type: String,
        enum:["customer","admin"],
        default:"customer",
    },
},
{ timestamps:true }

);

//Password Hash Middleware
userSchema.pre("save", async function () {
    if (!this.isModified("password")) { 
   // next(); 
     return;
    }
        const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  //  next();
});

// Match user entered password to hashed password
userSchema.methods.matchPassword = async function (enteredpassword) {
    return await bcrypt.compare(enteredpassword, this.password);
};

module.exports = mongoose.model("User", userSchema);