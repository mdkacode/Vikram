import { IMAGE_URI, SERVER_IP, NOT_FOUND_IMAGE } from "../util/secrets";
import fs from "fs";
import { Request, Response, NextFunction } from "express";
import { infoLog, errorLog } from "../util/loggerInfo";
import { ShopProductsList } from "../models/ShopProductListModel";
/**
 * @description | Add ShopProductsList with Image, Name & slug
 * @param req 
 * @param res 
 */
export const addShopProductsList = async (req: Request = null, res: Response = null) => {

    const shopProductsList = new ShopProductsList({
        ...req.body
    });
    infoLog("addShopProductsList", [req.body, req.query]);
    shopProductsList.save((err, doc) => {
        if (err) {
            errorLog("addShopProductsList", err, req.method);
            res.status(500).jsonp({ message: "Field Validation Failed !!", error: err });
        }
        else {
            infoLog("addShopProductsList => RESPONSE SUCCESS", [req.body, req.query, doc]);
            res.status(200).jsonp({ message: doc });
        }

    });
};

/**
 * Pass _id to delete the element
 * @param req | 
 * @param res 
 */
export const deleteShopProductsList = async (req: Request = null, res: Response = null, next: NextFunction) => {
    infoLog("deleteShopProductsList", [req.body, req.query]);
    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {

        return res.status(500).jsonp({ message: "Body is Not Defined" });
    }
    try {
        const doc = await ShopProductsList.deleteOne({ ...req.body });
        if (doc.deletedCount > 0) {
            infoLog("deleteShopProductsList => SUCCESS", [req.body, req.query, doc]);
            res.status(200).jsonp({ message: "Item Deleted Successfully", data: doc });
            next();
        }
        else {
            infoLog("deleteShopProductsList => NO RECORD FOUND", [req.body, req.query, doc]);
            res.status(204).jsonp({ message: "Item Not Found !!", data: doc });
        }
    }
    catch (error) {
        errorLog("deleteShopProductsList => PARAMETER ERROR", error, req.body);
        return res.status(500).jsonp({ mssage: "Please check parameter/s", error });
    }


};

/**
 * Pass _id to as KEY
 * @param req | any Body Parameter which wants to get updated 
 * @param res |
 */
export const updateShopProductsList = async (req: Request = null, res: Response = null) => {
    infoLog("updateShopProductsList", [req.body, req.query]);
    ShopProductsList.findOneAndUpdate({ ...req.query }, { ...req.body }, (err: object) => {
        if (err) {
            errorLog("deleteShopProductsList => UPDATE FAILED ", err, req.method);
            return res.status(500).json({ message: "Something went Wrong" });
        }

    }).then((doc: object) => {
        if (!doc) {
            infoLog("updateShopProductsList", [req.body, req.query, doc]);
            return res.status(204).json({ message: "Requested Element Not Found !!", item: doc });
        }
        else {
            infoLog("updateShopProductsList", [req.body, req.query, doc]);
            return res.status(200).json({ message: "Updated Successfuly!!", item: doc });
        }

    });
};

export const getShopProductsList = async (req: Request = null, res: Response = null) => {
    infoLog("getShopProductsList", [req.body, req.query]);
    const pageOptions = {
        page: parseInt(req.body.page, 10) || 0,
        limit: parseInt(req.body.limit, 10) || 10
    };

    ShopProductsList.find()
        .skip(pageOptions.page * pageOptions.limit)
        .limit(pageOptions.limit)
        .exec((err, doc) => {
            if (err) {
                errorLog("getShopProductsList => GET FAILED ", err, req.method);
                return res.status(500).jsonp({ "messge": "Something Went Wrong !!", error: err });
            }
            else {
                infoLog("getShopProductsList ==> SUCCESS", [req.body, req.query]);
                res.status(200).jsonp(doc[0]);
            }
        });
};