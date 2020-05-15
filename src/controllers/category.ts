import { IMAGE_URI, SERVER_IP, NOT_FOUND_IMAGE } from "../util/secrets";
import fs from "fs";
import { Request, Response, NextFunction } from "express";
import { infoLog, errorLog } from "../util/loggerInfo";
import { MasterCategory } from "../models/Category";
/**
 * @description | Add Category with Image, Name & slug
 * @param req 
 * @param res 
 */
export const addCategory = async (req: Request = null, res: Response = null) => {

    const Category = new MasterCategory({
        ...req.body
    });
    infoLog("addCategory", [req.body, req.query]);
    Category.save((err, doc) => {
        if (err) {
            errorLog("addCategory", err, req.method);
            res.status(500).jsonp({ message: "Field Validation Failed !!", error: err });
        }
        else {
            infoLog("addCategory => RESPONSE SUCCESS", [req.body, req.query, doc]);
            res.status(200).jsonp({ message: doc });
        }

    });
};

/**
 * Pass _id to delete the element
 * @param req | 
 * @param res 
 */
export const deleteCategory = async (req: Request = null, res: Response = null, next: NextFunction) => {
    infoLog("deleteCategory", [req.body, req.query]);
    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {

        return res.status(500).jsonp({ message: "Body is Not Defined" });
    }
    try {
        const doc = await MasterCategory.deleteOne({ ...req.body });
        if (doc.deletedCount > 0) {
            infoLog("deleteCategory => SUCCESS", [req.body, req.query, doc]);
            res.status(200).jsonp({ message: "Item Deleted Successfully", data: doc });
            next();
        }
        else {
            infoLog("deleteCategory => NO RECORD FOUND", [req.body, req.query, doc]);
            res.status(204).jsonp({ message: "Item Not Found !!", data: doc });
        }
    }
    catch (error) {
        errorLog("deleteCategory => PARAMETER ERROR", error, req.body);
        return res.status(500).jsonp({ mssage: "Please check parameter/s", error });
    }


};

/**
 * Pass _id to as KEY
 * @param req | any Body Parameter which wants to get updated 
 * @param res |
 */
export const updateCategory = async (req: Request = null, res: Response = null) => {
    infoLog("updateCategory", [req.body, req.query]);
    MasterCategory.findOneAndUpdate({ ...req.query }, { ...req.body }, (err: object) => {
        if (err) {
            errorLog("deleteCategory => UPDATE FAILED ", err, req.method);
            return res.status(500).json({ message: "Something went Wrong" });
        }

    }).then((doc: object) => {
        if (!doc) {
            infoLog("updateCategory", [req.body, req.query, doc]);
            return res.status(204).json({ message: "Requested Element Not Found !!", item: doc });
        }
        else {
            infoLog("updateCategory", [req.body, req.query, doc]);
            return res.status(200).json({ message: "Updated Successfuly!!", item: doc });
        }

    });
};

export const getCategory = async (req: Request = null, res: Response = null) => {
    infoLog("getCategory", [req.body, req.query]);
    const pageOptions = {
        page: parseInt(req.body.page, 10) || 0,
        limit: parseInt(req.body.limit, 10) || 10
    };

    MasterCategory.find()
        .skip(pageOptions.page * pageOptions.limit)
        .limit(pageOptions.limit)
        .exec((err, doc) => {
            if (err) {
                errorLog("getCategory => GET FAILED ", err, req.method);
                return res.status(500).jsonp({ "messge": "Something Went Wrong !!", error: err });
            }
            else {
                {
                    let imageSource: string[] = []; // Pushing Image to it
                    for (const t in doc) {
                        if (doc[t]._id) {
                            infoLog("getCategory => IMAGE FOUND", [req.body, req.query]);
                            if (fs.existsSync(IMAGE_URI + doc[t]._id)) {
                                console.log(`image FOUND ${IMAGE_URI + doc[t]._id}`);
                                fs.readdirSync(IMAGE_URI + doc[t]._id).forEach(file => {
                                    imageSource.push(`${SERVER_IP}/static/${doc[t]._id + "/" + file}`);
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