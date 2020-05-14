import mongoose, { Schema, Document } from "mongoose";

export interface CategoryProps extends Document  {
    id: number;
    name: string;
    slug: string;
    createdBy: string;
    updatedBy: string;
    imagepath: {type: string;default: "equal _id"};
    imageList: any;
    createdOn: { type: Date; default: Date.now };
    updatedOn: {tyoe: Date};
    isActive: boolean;
}

const CategorySchema: Schema = new Schema({
    id :{ type: Number, required: true, unique: true},
    name :{ type: String, required: true, unique: true},
    slug :{type:String,required:true,unique:true},
    createdBy:{type:String,required:true,unique:false},
    updatedBy:{type:String,required:true,unique:false},
    imagepath:{type:String,required:false,unique:false},
    imageList:{type:Object,required:false,unique:false},
    createdOn:{type:String,required:false,unique:false}
});



export const MasterCategory = mongoose.model<CategoryProps>("MasterCategory", CategorySchema);