
const mongoose = require('mongoose');
const validator = require('validator');
const { validate } = require('./task');
const bcrypt= require('bcrypt');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required: true,
        maxlength:[40,'Characters should be less than 40']
    },
    email :{
        type:String,
        required:true,
        validate : [validator.isEmail,'Please provide correct email'],
        unique:[true,'Already registered email']
    },
    password:{
        type:String,
        required:true,
        maxlength:[35,'Password should be less than 35 caharacters'],
        minlength:[8,'Password should be greater than 8 characters'],
        select : false
    },
    passwordConfirm:{
        type:String,
        required:true,
        validate: {
            //works only on save and create
            validator : function (el) {
                return el===this.password;
            },
            messaege : 'password and confirm password are not same'
        }
    }
});

userSchema.methods.correctPassword = async function(candidatePassword,userPassword){
    return await bcrypt.compare(candidatePassword,userPassword);
}
userSchema.pre('save',async function (next) {
    if(!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password,12)

    this.passwordConfirm= undefined;
    next();
});

module.exports = mongoose.model('User',userSchema);