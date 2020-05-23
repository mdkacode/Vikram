import { IMAGE_URI, SERVER_IP, NOT_FOUND_IMAGE } from "../util/secrets";
import fs from "fs";
import { Request, Response, NextFunction } from "express";
import { infoLog, errorLog } from "../util/loggerInfo";
import { ShopKeeper } from "../models/shopKeeperModel";
import { ShopProductsList } from "../models/ShopProductListModel";
/**
 * @description | Add ShopKeeper with Image, Name & slug
 * @param req 
 * @param res 
 */
export const addShopKeeper = async (req: Request = null, res: Response = null) => {


    infoLog("addShopKeeper", [req.body, req.query]);
    const newStore = new ShopProductsList({
        products: [],
        createdBy: "admin",
        updatedBy: "admin"
    });
    await newStore.save((err, storeDoc) => {
        if (err) {
            errorLog("addShopKeeper", err, req.method);
            res.status(500).jsonp({ message: "Store Creation Failed !!", error: err });
        }
        else {
            const shopKeeper = new ShopKeeper({
                ...req.body,
                productListId: storeDoc._id
            });
            shopKeeper.save((err, doc) => {
                if (err) {
                    errorLog("addShopKeeper", err, req.method);
                    res.status(500).jsonp({ message: "Field Validation Failed !!", error: err });
                }
                else {
                    infoLog("addShopKeeper => RESPONSE SUCCESS", [req.body, req.query, doc]);
                    res.status(200).jsonp({ message: doc });
                }
            });

        }
    });

};

/**
 * Pass _id to delete the element
 * @param req | 
 * @param res 
 */


export const validateShopKeeper = async (req: Request = null, res: Response = null, next: NextFunction) => {

    const validData = await ShopKeeper.find().where({ email: req.body.email, gstn: req.body.gstn });
    if (validateShopKeeper) {
        res.send(validData);
    }
    else {
        res.send("Something Went Wrong");
    }
};

export const deleteShopKeeper = async (req: Request = null, res: Response = null, next: NextFunction) => {
    infoLog("deleteShopKeeper", [req.body, req.query]);
    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {

        return res.status(500).jsonp({ message: "Body is Not Defined" });
    }
    try {
        const doc = await ShopKeeper.deleteOne({ ...req.body });
        if (doc.deletedCount > 0) {
            infoLog("deleteShopKeeper => SUCCESS", [req.body, req.query, doc]);
            res.status(200).jsonp({ message: "Item Deleted Successfully", data: doc });
            next();
        }
        else {
            infoLog("deleteShopKeeper => NO RECORD FOUND", [req.body, req.query, doc]);
            res.status(204).jsonp({ message: "Item Not Found !!", data: doc });
        }
    }
    catch (error) {
        errorLog("deleteShopKeeper => PARAMETER ERROR", error, req.body);
        return res.status(500).jsonp({ mssage: "Please check parameter/s", error });
    }


};

/**
 * Pass _id to as KEY
 * @param req | any Body Parameter which wants to get updated 
 * @param res |
 */
export const updateShopKeeper = async (req: Request = null, res: Response = null) => {
    infoLog("updateShopKeeper", [req.body, req.query]);
    ShopKeeper.findOneAndUpdate({ ...req.query }, { ...req.body }, (err: object) => {
        if (err) {
            errorLog("deleteShopKeeper => UPDATE FAILED ", err, req.method);
            return res.status(500).json({ message: [], item: "Something went Wrong" });
        }

    }).then((doc: object) => {
        if (!doc) {
            infoLog("updateShopKeeper", [req.body, req.query, doc]);
            return res.status(204).json({ message: [], item: "Requested Element Not Found !!" });
        }
        else {
            infoLog("updateShopKeeper", [req.body, req.query, doc]);
            return res.status(200).json({ message: "Updated Successfuly!!", item: doc });
        }

    });
};

export const getShopKeeper = async (req: Request = null, res: Response = null) => {
    infoLog("getShopKeeper", [req.body, req.query]);
    const pageOptions = {
        page: parseInt(req.body.page, 10) || 0,
        limit: parseInt(req.body.limit, 10) || 10
    };

    ShopKeeper.find()
        .skip(pageOptions.page * pageOptions.limit)
        .limit(pageOptions.limit)
        .exec((err, doc) => {
            if (err) {
                errorLog("getShopKeeper => GET FAILED ", err, req.method);
                return res.status(500).jsonp({ "messge": [], error: "Something Went Wrong !!" });
            }
            else {
                {
                    let imageSource: string[] = []; // Pushing Image to it
                    for (const t in doc) {
                        if (doc[t]._id) {
                            infoLog("getShopKeeper => IMAGE FOUND", [req.body, req.query]);
                            if (fs.existsSync(IMAGE_URI + doc[t]._id)) {
                                fs.readdirSync(IMAGE_URI + doc[t]._id).forEach(file => {
                                    imageSource.push(`https://pluckershop.com/api/static/${doc[t]._id + "/" + file}`);
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