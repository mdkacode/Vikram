import mongoose, { Schema, Document } from "mongoose";


export interface IshopKeeperProps extends Document {
    businessName: string;
    contactPerson: string;
    imageList: string[];
    shopDisplayName: string;
    address: { city: string; areaName: string; pinCode: string; type: string };
    loc: {
        type: string;
        coordinates: [number];
    };
    email: string;
    phoneNumbers: { shop: string; personal: string; delivery: { personName: string; phoneNumber: string } };
    banners: string[];
    promotedProducts: { productIds: string[]; brand: string[] };
    isDelivery: boolean;
    gstn: string;
    bankDetailsId: string;
    productListId: string;
    createdBy: string;
    updatedBy: string;
}


const ShopKeeperSchema: Schema = new Schema({
    businessName: { type: String, required: true, unique: false },
    contactPerson: { type: String, required: true, unique: false },
    shopDisplayName: { type: String, required: true, unique: false },
    imageList: { type: Object, required: false, unique: false },
    banners: { type: [], required: false, unique: false },
    promotedProducts: { type: Object, required: false, unique: false },
    phoneNumbers: { type: Object, required: false, unique: false },
    address: { type: Object, required: false, unique: false },
    loc: { type: Object, required: false, index: "2dsphere", unique: false },
    isDelivery: { type: Boolean, required: false, unique: false },
    email: { type: String, required: true, unique: false },
    gstn: { type: String, required: true, unique: true },
    bankDetailsId: { type: String, required: false, unique: false },
    productListId: { type: String, required: false, unique: false },
    createdBy: { type: String, required: true, unique: false },
    updatedBy: { type: String, required: true, unique: false },
}, { timestamps: true });

ShopKeeperSchema.index({ loc: "2dsphere" });

export const ShopKeeper = mongoose.model<IshopKeeperProps>("ShopKeeper", ShopKeeperSchema);