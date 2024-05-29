import mongoose, { Schema } from "mongoose";

const UsersSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    bio: { type: String, required: false },
    photo: { type: String, required: false },
    password: { type: String, required: true },
    role: { type: String, enum: [`user`, `admin`], default: `user` },
    name: { get: function (this: any): string { return `${this?.firstName} ${this.lastName}` }, type: String },
}, { timestamps: true, toJSON: { getters: true } });
const UsersModel = mongoose.model(`Users`, UsersSchema);

export { UsersModel };