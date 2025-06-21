import { Schema,model,Types } from "mongoose";

const urlSchema = new Schema({
    url:{
        type:String,
        required:true,
        unique:true
    },
    userId:{
        type:Types.ObjectId,
        ref:"USER",
        required:true
    },
    status:{
        type:String,
        default:"unknown"
    },
    lastChecked:{
        type:Date
    },
    responseTime:{
        type:Number
    }
},{timestamps:true})

const URL = model("URL",urlSchema);

export default URL;