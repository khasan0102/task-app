import mongoose, { Schema, Document } from "mongoose";
import { v4 as uuid } from "uuid";

export interface IOTP extends Document {
    _id: string
    email: string
    code: string
    created_at: Date
}

const otpSchema = new Schema({
    _id: {
        type: String,
        default: uuid
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    code: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now,
        expires: '3m'
    }
});

export default mongoose.model<IOTP>('OTP', otpSchema);