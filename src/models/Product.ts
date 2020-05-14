import mongoose, { Schema, Document } from "mongoose";

export interface ProductProps extends Document {
    id: any;
  productName: string;
  quantity: string;
  mPrice: string;
  sPrice: string;
  imagePath: string;
  imageArray: string;
  category: string;
  sku: number;
}

const ProductSchema: Schema = new Schema({
    id: { type: String, required: true, unique: true },
    productName: { type: String, required: true, unique: true },
    quantity: { type: Number, required: true },
    mPrice: { type: String, required: true },
    sPrice: { type: String, required: true },
    imagePath: { type: String, required: false },
    imageArray: { type: String, required: false },
    category: { type: String, required: true },
    sku: { type: Number, required: true },
});

// // Export the model and return your IUser interface
// export default mongoose.model<MessageProps>("Message", MessageSchema);

export const Product = mongoose.model<ProductProps>("Product", ProductSchema);