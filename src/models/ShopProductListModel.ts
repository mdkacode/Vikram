import mongoose, { Schema, Document } from "mongoose";

export interface IshopProductListProps extends Document {

    products: [
        {
            pId: string; cIds: string;
            price: { mrp: number; sp: number };
            sku: number; maxOrderCount: number;
            minOrderCount: number;
            isAvailable: boolean;
        }
    ]
    ;
    createdBy: string;
    updatedBy: string;

}

const ShopProductsSchema: Schema = new Schema({
    products: { type: Array, required: true, unique: true },
    createdBy: { type: String, required: true, unique: false },
    updatedBy: { type: String, required: true, unique: false },
}, { timestamps: true });

export const ShopProductsList = mongoose.model<IshopProductListProps>("ShopProductsList", ShopProductsSchema);