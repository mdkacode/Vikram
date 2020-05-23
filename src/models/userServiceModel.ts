import mongoose, { Schema, Document } from "mongoose";


export interface IuserServiceProps extends Document {
    imageList: string[];
    phoneNumber: string;
    UUID: string;
    userCurrentAddress: object[];
    OTP: string;
    email: string;
    DeliveryAddress: object[];
    name: string;
    cartId: string;
    createdBy: string;
    updatedBy: string;
}


const UserServiceSchema: Schema = new Schema({
    phoneNumber: { type: String, required: true, unique: false },
    UUID: { type: String, required: true, unique: false },
    OTP: { type: String, required: true, unique: false },
    email: { type: Object, required: false, unique: false },
    name: { type: Object, required: false, unique: false },
    cartId: { type: Object, required: false, unique: false },
    userCurrentAddress: { type: [], required: false, unique: false },
    DeliveryAddress: { type: [], required: false, unique: false },
    createdBy: { type: String, required: false, unique: false },
    updatedBy: { type: String, required: false, unique: false },
}, { timestamps: true });



export const UserService = mongoose.model<IuserServiceProps>("UserService", UserServiceSchema);