import mongoose, { Schema, Document } from "mongoose";


export interface IproductProps extends Document {
    name: string;
    brandName: string;
    slug: string;
    createdBy: string;
    updatedBy: string;
    priceList: [{ mrp: number; sp: number }];
    units: string;
    defaultSize: string;
    description: string;
    imageList: string[];
}


const ProductSchema: Schema = new Schema({
    name: { type: String, required: true, unique: false },
    brandName: { type: String, required: true, unique: false },
    defaultSize: { type: String, required: true, unique: false },
    slug: { type: String, required: true, unique: true },
    units: { type: String, required: true, unique: true },
    priceList: { type: String, required: true, unique: false },
    imagepath: { type: String, required: true, unique: false },
    imageList: { type: Object, required: true, unique: false },
    createdBy: { type: String, required: true, unique: false },
    updatedBy: { type: String, required: true, unique: false },
}, { timestamps: true });



export const MasterProductList = mongoose.model<IproductProps>("MasterProductList", ProductSchema);