import mongoose, { Schema, Document } from "mongoose"

export interface ISample extends Document {
    _id: string
    name: string
    description: string
}

let sampleSchema = new mongoose.Schema({
    _id: {
        type: Schema.Types.ObjectId
    },
    name: {
        type: String
    },
    description: {
        type: String
    }
})

export default mongoose.model<ISample>("Sample", sampleSchema)
