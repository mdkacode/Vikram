import mongoose, { Schema, Document } from "mongoose";


export interface User extends Document {
    imageList: string[];

    cId: string; // cart id => unique id
    emailId: string;
    uuid: string;
    name: string;
    isExisting: boolean;
    phone: number;
    otp: number;
    defaultAddress: object[]; // array of Objects
    loc: {
        type: string;
        coordinates: [number];
    };
    addresses: string;
    imageLocation: string;
    isBlackListed: string;

}


export const UserSchema: Schema = new Schema({
    cId: { type: String, required: false, unique: false },   // should be generated at the time of signup by system
    uuid: { type: String, required: false, unique: false },
    emailId: { type: String, required: false, unique: false },
    name: { type: String, required: false, unique: false },
    isExisting: { type: Boolean, required: false, unique: false },
    phone: { type: String, required: false, unique: true }, // unique customer identification number
    otp: { type: String, required: true, unique: false }, // unique customer identification number
    defaultAddress: { type: String, required: false, unique: false },
    addresses: { type: Array, required: false, unique: false },
    loc: { type: Object, required: false, index: "2dsphere", unique: false },
    imageLocation: { type: String, required: false, unique: false },
    // make default value as 0, if we need to blacklist some customer, we can use this field 
    isBlackListed: { type: Number, required: false, unique: false }
}, { timestamps: true });



export const User = mongoose.model<User>("User", UserSchema);