import mongoose, { Schema } from "mongoose";

const TodoSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: false },
    completed: { type: Boolean, default : false },
    userId: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
}, { timestamps: true, toJSON: { getters: true } });
const TodosModel = mongoose.model(`Todo`, TodoSchema);

export { TodosModel };