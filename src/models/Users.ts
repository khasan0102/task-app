import mongoose, { Schema, Document } from 'mongoose';
import { v4 as uuid } from "uuid";

export interface IUser extends Document {
    _id: string
    email: string
    name: string
    lastname: string
    age: number
    photo_path: string 
    password: string
    online_time: string
    count_views: number
    socket_id: string
};

let userSchema = new Schema({
    _id: {
        type: String,
        default: uuid
    },
    email: {
        type: String,
        required: true,
        unique : true
    },
    name: {
        type: String,
        required: true
    },
    lastname: String,
    age: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    photo_path: {
        type: String,
        required: true
    },
    online_time: String,
    count_views: {
        type: Number,
        default: 0
    },
    socket_id: String
});

export default mongoose.model<IUser>("User", userSchema);