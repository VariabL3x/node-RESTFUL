const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const UserSchema = new Schema({
    firstname:{
        type:String,
        required:true
    },
    lastname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        min:[6,'Password Too Short']
    },
    permissionLevel:{
        type:Number,
        default:1
    }
},{timestamps:true})

UserSchema.statics.comparePassword = function(email,password){
    return this.findOne({email}).then((result)=>{
        if(result!==null){
            return bcrypt.compareSync(password,result.password);
        }else{
            return false;
        }
    })
}

const User = mongoose.model('User',UserSchema);

module.exports = User;