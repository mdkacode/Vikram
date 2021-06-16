import mongoose, { Schema, Document } from "mongoose";

export interface IuserAddedCart extends Document {
  userId: string;
  carts: {
    storeId: string;
    tranasctionNumber: string;
    paymentMethod: string;
    address: string;
    products: {
      brandName: string;
      cIds: string;
      createdBy: string;
      defaultSize: string;
      imageList: string[];
      isAvailable: boolean;
      maxOrderCount: number;
      minOrderCount: number;
      name: string;
      pId: string;
      price: { mrp: number; sp: number };
      priceList: { sp: number; mrp: number };
      quantity: number;
      sku: number;
      slug: string;
      units: string;
      updatedBy: string;
    }[];
  }[];
}

const UserAddedCartSchema: Schema = new Schema(
  {
    updatedBy: { type: String, required: false, unique: false },
    carts: { type: Object, required: false, unique: false },
    userId: { type: String, required: true, unique: false },
  },
  { timestamps: true }
);

export const UserAddedCart = mongoose.model<IuserAddedCart>(
  "UserAddedCart",
  UserAddedCartSchema
);
