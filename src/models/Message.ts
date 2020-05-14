import mongoose, { Schema, Document } from "mongoose";

export interface MessageProps extends Document {
  phoneNumber: string;
  code: number;
  status: false;
}

const MessageSchema: Schema = new Schema({
    phoneNumber: { type: String, required: true, unique: true },
    code: { type: String, required: true },
    status: { type: Boolean, required: true },

});

// // Export the model and return your IUser interface
// export default mongoose.model<MessageProps>("Message", MessageSchema);

export const Message = mongoose.model<MessageProps>("Message", MessageSchema);