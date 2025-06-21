import { Schema,model } from "mongoose";

const userSchema = new Schema({
    firebaseUid:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        unique:true,
        required:true
    }
},{timestamps:true});

const USER = model("USER",userSchema);

export default USER;

