import { IMAGE_URI, SERVER_IP } from "../util/secrets";
import fs from "fs";
import { Request, Response } from "express";
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
export const deleteCategory = async (req: Request = null, res: Response = null) => {
    infoLog("deleteCategory", [req.body, req.query]);
    MasterCategory.deleteOne({ ...req.body }, (err) => {
        if (err) {
            errorLog("deleteCategory => DELETE FAILED ", err, req.method);
            return res.status(500).json({ message: "Something went Wrong" });
        }
    }).then((result) => {
        if (result.deletedCount > 0) {
            infoLog("deleteCategory => SUCCESS", [req.body, req.query, result]);
            res.status(200).jsonp({ message: "Item Deleted Successfully", data: result });
        }
        infoLog("deleteCategory => NO RECORD FOUND", [req.body, req.query, result]);
        res.status(204).jsonp({ message: "Item Not Found !!", data: result });
    });
};


export const updateCategory = async (req: Request = null, res: Response = null) => {
    infoLog("deleteCategory", [req.body, req.query]);
    MasterCategory.findOneAndUpdate({ ...req.query }, { ...req.body }, (err: object) => {
        if (err) {
            errorLog("deleteCategory => UPDATE FAILED ", err, req.method);
            return res.status(500).json({ message: "Something went Wrong" });
        }

    }).then((doc: object) => {
        infoLog("updateCategory", [req.body, req.query, doc]);
        return res.status(200).json({ message: "Updated Successfuly!!", item: doc });
    });
};

export const getCategory = async (req: Request = null, res: Response = null) => {
    infoLog("getCategory", [req.body, req.query]);
    let imageSource: string[] = [];
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
                    console.log(doc.length);
                    for (const t in doc) {
                        if (doc[t]._id) {
                            console.log(`image FOUND ${IMAGE_URI + doc[t]._id}`);
                            try {

                                if (fs.existsSync(IMAGE_URI + doc[t]._id)) {
                                    console.log(`image FOUND ${IMAGE_URI + doc[t]._id}`);
                                    fs.readdirSync(IMAGE_URI + doc[t]._id).forEach(file => {
                                        imageSource.push(`${SERVER_IP}/static/${doc[t]._id + "/" + file}`);
                                    });
                                }
                                else {
                                    imageSource.push("https://thumbs.dreamstime.com/b/page-not-found-design-template-error-flat-line-concept-link-to-non-existent-document-no-results-magnifying-glass-156396935.jpg");
                                }

                            }
                            catch (error) {
                                errorLog("getCategory => FILE NOT FOUND ", error, req.method);
                                console.log(error);
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