import fs from "fs";
import { Request, Response } from "express";
import { infoLog, errorLog } from "../util/loggerInfo";
import { MasterCategory } from "../models/Category";
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

export const deleteCategory = async (req: Request = null, res: Response = null) => {
    infoLog("deleteCategory", [req.body, req.query]);
    MasterCategory.deleteOne({ ...req.body }, (err, doc) => {
        if (err) {
            errorLog("deleteCategory => DELETE FAILED ", err, req.method);
            return res.status(500).json({ message: "Something went Wrong" });
        }
        else return res.status(200).json({ item: doc.deletedCount == 0 ? "No Item Found" : doc });
    });
};


export const updateCategory = async (req: Request = null, res: Response = null) => {
    infoLog("deleteCategory", [req.body, req.query]);
    MasterCategory.findOneAndUpdate({ ...req.query }, { ...req.body }, { useFindAndModify: false }, (err, doc) => {
        if (err) {
            errorLog("deleteCategory => UPDATE FAILED ", err, req.method);
            return res.status(500).json({ message: "Something went Wrong" });
        }
        else return res.status(200).json({ item: doc });
    });
};

export const getCategory = async (req: Request = null, res: Response = null) => {
    const UPLOAD_PATH = "/Users/anrag/Documents/saumi/TypeScript-Node-Starter/imagesPublic/";
    infoLog("getCategory", [req.body, req.query]);
    let imageSource: any = [];
    const message: object = [];
    const pageOptions = {
        page: parseInt(req.query.page, 10) || 0,
        limit: parseInt(req.query.limit, 10) || 10
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
                        if (doc[t].imagepath) {
                            fs.readdirSync(UPLOAD_PATH + doc[t].imagepath).forEach(file => {
                                imageSource.push(`http://192.168.0.102:3000/static/${doc[t].imagepath + "/" + file}`);
                            });
                        }
                        doc[t].imageList = imageSource;
                        imageSource = [];
                    }

                }

                res.status(200).jsonp({ message: doc, size: doc.length });
            }
        });

};