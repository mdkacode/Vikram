import mongoose, { Schema, Document } from "mongoose";


export interface IuserAddedCart extends Document {

    userId: string;
    carts: [
        { storeId: string },
        [
            {
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
            }
        ]
    ];

}


const UserAddedCartSchema: Schema = new Schema({
    brandName: { type: String, required: false, unique: false },
    cIds: { type: String, required: false, unique: false },
    createdBy: { type: String, required: false, unique: false },
    defaultSize: { type: String, required: false, unique: false },
    imageList: { type: Object, required: false, unique: false },
    isAvailable: { type: Boolean, required: false, unique: false },
    maxOrderCount: { type: String, required: false, unique: false },
    minOrderCount: { type: String, required: false, unique: false },
    name: { type: Object, required: false, unique: false },
    pId: { type: String, required: false, unique: false },
    price: { type: Object, required: false, unique: false },
    priceList: { type: Object, required: false, unique: false },
    quantity: { type: Number, required: false, unique: false },
    sku: { type: Number, required: false, unique: false },
    slug: { type: String, required: false, unique: false },
    storeId: { type: String, required: false, unique: false },
    units: { type: String, required: false, unique: false },
    updatedBy: { type: String, required: false, unique: false },
    carts: { type: Array, required: true, unique: false },
    userId: { type: String, required: true, unique: true },
}, { timestamps: true });



export const UserAddedCart = mongoose.model<IuserAddedCart>("UserAddedCart", UserAddedCartSchema);