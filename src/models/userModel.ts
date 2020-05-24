import mongoose, { Schema, Document } from "mongoose";


export interface User extends Document {

    cIds: String;
    cName: String;
    emailId: String;
    defaultAddress: Array;
    addresses: String;
    creationTimeStamp: String;
    imageLocation: String;
    isBlackListed: String;

}


const UserSchema: Schema = new Schema({
    cIds: { type: String, required: true, unique: true },   // should be generated at the time of signup by system
    cName: { type: String, required: true, unique: false },
    emailId: { type: String, required: true, unique: true },
    defaultAddress: { type: String, required: false, unique: false },
    addresses: { type: Array, required: false, unique: false },
    creationTimeStamp: { type: String, required: true, unique: false },
    imageLocation: { type: String, required: false, unique: false },
    // make default value as 0, if we need to blacklist some customer, we can use this field
    isBlackListed: { type: Number, required: false, unique: false }
}, { timestamps: true });



export const User = mongoose.model<User>("User", UserSchema);