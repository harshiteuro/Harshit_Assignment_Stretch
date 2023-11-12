const mongoose =require('mongoose');
const uniqueValidator=require('mongoose-unique-validator');

const Schema=mongoose.Schema;

const userSchema=new Schema({
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true,minlength:6},
    image:{type:String,required:true},
    places:[{type:mongoose.Types.ObjectId,required:true,ref:'Place'}],

    bio:{type:String,required:true},
    github:{type:String,required:true},
    website:{type:String,required:true},
    seeking:{type:String,required:true},
    techstack:{type:String,required:true},
    fieldofinterest:{type:String, required:true}
});

userSchema.plugin(uniqueValidator);

module.exports=mongoose.model('User',userSchema);
