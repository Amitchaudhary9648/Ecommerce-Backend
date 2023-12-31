const mongoose = require('mongoose'); // Erase if already required
const bycrpt = require('bcrypt');
// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    firstname:{
        type:String,
        required:true,
        index:true,
    },
    lastname:{
        type:String,
        required:true,
        index:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    mobile:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
});

userSchema.pre("save", async function(next){
    const salt = await bycrpt.genSaltSync(10)
    this.password = await bycrpt.hash(this.password, salt)
})
userSchema.methods.isPasswordMatched = async function (enteredPassword){
    return await bycrpt.compare(enteredPassword, this.password);
}

//Export the model
module.exports = mongoose.model('User', userSchema);