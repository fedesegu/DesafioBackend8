import { Schema, model} from "mongoose";
import { mongoose } from "mongoose";

const usersSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    last_name: { 
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    age:{
        type: Number
    },
    role:{
        type:String,
        enum:["user" , "admin"],
        default: "user"
    },
    cart:{
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Carts'
    },
    isGithub: {

        type: Boolean,
        default:false,
    },
});

export const usersModel = mongoose.model("Users", usersSchema);