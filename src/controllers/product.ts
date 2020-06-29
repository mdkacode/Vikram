import { IMAGE_URI, SERVER_IP, NOT_FOUND_IMAGE } from "../util/secrets";
import fs from "fs";
import { Types } from "mongoose";
import { Request, Response, NextFunction } from "express";
import { infoLog, errorLog } from "../util/loggerInfo";
import { MasterProductList } from "../models/productModel";
/**
 * @description | Add Product with Image, Name & slug
 * @param req 
 * @param res 
 */
export const addProduct = async (req: Request = null, res: Response = null) => {

    const Product = new MasterProductList({
        ...req.body
    });
    infoLog("addProduct", [req.body, req.query]);
    Product.save((err, doc) => {
        if (err) {
            errorLog("addProduct", err, req.method);
            res.status(500).jsonp({ message: "Field Validation Failed !!", error: err });
        }
        else {
            infoLog("addProduct => RESPONSE SUCCESS", [req.body, req.query, doc]);
            res.status(200).jsonp({ message: doc });
        }

    });
};

/**
 * Pass _id to delete the element
 * @param req | 
 * @param res 
 */
export const deleteProduct = async (req: Request = null, res: Response = null, next: NextFunction) => {
    infoLog("deleteProduct", [req.body, req.query]);
    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {

        return res.status(500).jsonp({ message: "Body is Not Defined" });
    }
    try {
        const doc = await MasterProductList.deleteOne({ ...req.body });
        if (doc.deletedCount > 0) {
            infoLog("deleteProduct => SUCCESS", [req.body, req.query, doc]);
            res.status(200).jsonp({ message: "Item Deleted Successfully", data: doc });
            next();
        }
        else {
            infoLog("deleteProduct => NO RECORD FOUND", [req.body, req.query, doc]);
            res.status(204).jsonp({ message: "Item Not Found !!", data: doc });
        }
    }
    catch (error) {
        errorLog("deleteProduct => PARAMETER ERROR", error, req.body);
        return res.status(500).jsonp({ mssage: "Please check parameter/s", error });
    }


};

/**
 * Pass _id to as KEY
 * @param req | any Body Parameter which wants to get updated 
 * @param res |
 */
export const updateProduct = async (req: Request = null, res: Response = null) => {
    infoLog("updateProduct", [req.body, req.query]);
    MasterProductList.findOneAndUpdate({ ...req.query }, { ...req.body }, (err: object) => {
        if (err) {
            errorLog("deleteProduct => UPDATE FAILED ", err, req.method);
            return res.status(500).json({ message: "Something went Wrong" });
        }

    }).then((doc: object) => {
        if (!doc) {
            infoLog("updateProduct", [req.body, req.query, doc]);
            return res.status(204).json({ message: "Requested Element Not Found !!", item: doc });
        }
        else {
            infoLog("updateProduct", [req.body, req.query, doc]);
            return res.status(200).json({ message: "Updated Successfuly!!", item: doc });
        }

    });
};

export const getProduct = async (req: Request = null, res: Response = null) => {
    infoLog("getProduct", [req.body, req.query]);
    const pageOptions = {
        page: parseInt(req.body.page, 10) || 0,
        limit: parseInt(req.body.limit, 10) || 20
    };

    MasterProductList.find()
        .skip(pageOptions.page * pageOptions.limit)
        .limit(pageOptions.limit)
        .exec((err, doc) => {
            if (err) {
                errorLog("getProduct => GET FAILED ", err, req.method);
                return res.status(500).jsonp({ "messge": "Something Went Wrong !!", error: err });
            }
            else {
                {
                    let imageSource: string[] = []; // Pushing Image to it
                    for (const t in doc) {
                        if (doc[t]._id) {
                            infoLog("getProduct => IMAGE FOUND", [req.body, req.query]);
                            if (fs.existsSync(IMAGE_URI + doc[t]._id)) {
                                console.log(`image FOUND ${IMAGE_URI + doc[t]._id}`);
                                fs.readdirSync(IMAGE_URI + doc[t]._id).forEach(file => {
                                    imageSource.push(`${SERVER_IP}static/${doc[t]._id + "/" + file}`);
                                });
                            }
                            else {
                                imageSource.push(NOT_FOUND_IMAGE);
                            }
                        }
                        doc[t].imageList = imageSource;
                        imageSource = [];
                    }
                }
                res.status(200).jsonp({ message: doc, size: doc.length });
            }
        });
};

export const getSingleProduct = async (req: Request = null, res: Response = null) => {
    infoLog("getSingleProduct", [req.body, req.query]);


    MasterProductList.find({ "_id": req.query.pId })
        .exec((err, doc) => {
            if (err) {
                errorLog("getSingleProduct => GET FAILED ", err, req.method);
                return res.status(500).jsonp({ "messge": "Something Went Wrong !!", error: err });
            }
            else {
                {
                    let imageSource: string[] = []; // Pushing Image to it
                    for (const t in doc) {
                        if (doc[t]._id) {
                            infoLog("getSingleProduct => IMAGE FOUND", [req.body, req.query]);
                            if (fs.existsSync(IMAGE_URI + doc[t]._id)) {
                                console.log(`image FOUND ${IMAGE_URI + doc[t]._id}`);
                                fs.readdirSync(IMAGE_URI + doc[t]._id).forEach(file => {
                                    imageSource.push(`${SERVER_IP}static/${doc[t]._id + "/" + file}`);
                                });
                            }
                            else {
                                imageSource.push(NOT_FOUND_IMAGE);
                            }
                        }
                        doc[t].imageList = imageSource;
                        imageSource = [];
                    }
                }
                res.status(200).jsonp({ data: doc, size: doc.length });
            }
        });
};

export const getManyProduct = async (req: Request = null, res: Response = null) => {
    infoLog("getSingleProduct", [req.body, req.query]);
    const { ids } = req.query;

    const itemIDs = ids.toString().split(",");
    MasterProductList.find({
        "_id": {
            $in: itemIDs
        }
    }).exec((err, doc) => {
        if (err) {
            errorLog("getSingleProduct => GET FAILED ", err, req.method);
            return res.status(500).jsonp({ "messge": "Something Went Wrong !!", error: err });
        }
        else {
            {
                let imageSource: string[] = []; // Pushing Image to it
                for (const t in doc) {
                    if (doc[t]._id) {
                        infoLog("getSingleProduct => IMAGE FOUND", [req.body, req.query]);
                        if (fs.existsSync(IMAGE_URI + doc[t]._id)) {
                            console.log(`image FOUND ${IMAGE_URI + doc[t]._id}`);
                            fs.readdirSync(IMAGE_URI + doc[t]._id).forEach(file => {
                                imageSource.push(`${SERVER_IP}static/${doc[t]._id + "/" + file}`);
                            });
                        }
                        else {
                            imageSource.push(NOT_FOUND_IMAGE);
                        }
                    }
                    doc[t].imageList = imageSource;
                    imageSource = [];
                }
            }
            res.status(200).jsonp({ data: doc, size: doc.length });
        }
    });
};