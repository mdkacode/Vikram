import { IMAGE_URI, SERVER_IP, NOT_FOUND_IMAGE } from "../util/secrets";
import fs from "fs";
import { Request, Response, NextFunction } from "express";
import { infoLog, errorLog } from "../util/loggerInfo";
import { IuserServiceProps, UserService } from "../models/userServiceModel";
/**
 * @description | Add UserService with Image, Name & slug
 * @param req 
 * @param res 
 */
export const adduserService = async (req: Request = null, res: Response = null) => {


    infoLog("adduserService", [req.body, req.query]);
    const newStore = new UserService({
        ...req.body,
        createdBy: "admin",
        updatedBy: "admin"
    });
    await newStore.save((err, storeDoc) => {
        if (err) {
            errorLog("adduserService", err, req.method);
            res.status(500).jsonp({ message: "Store Creation Failed !!", error: err });
        }
        else {
            const userService = new UserService({
                ...req.body,
                productListId: storeDoc._id
            });
            userService.save((err, doc) => {
                if (err) {
                    errorLog("adduserService", err, req.method);
                    res.status(500).jsonp({ message: "Field Validation Failed !!", error: err });
                }
                else {
                    infoLog("adduserService => RESPONSE SUCCESS", [req.body, req.query, doc]);
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


export const validateuserService = async (req: Request = null, res: Response = null, next: NextFunction) => {

    const validData = await UserService.find().where({ phoneNumber: req.body.phone, OTP: req.body.otp });
    if (validateuserService) {
        res.send(validData);
    }
    else {
        res.send("Something Went Wrong");
    }
};

export const deleteuserService = async (req: Request = null, res: Response = null, next: NextFunction) => {
    infoLog("deleteuserService", [req.body, req.query]);
    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {

        return res.status(500).jsonp({ message: "Body is Not Defined" });
    }
    try {
        const doc = await UserService.deleteOne({ ...req.body });
        if (doc.deletedCount > 0) {
            infoLog("deleteuserService => SUCCESS", [req.body, req.query, doc]);
            res.status(200).jsonp({ message: "Item Deleted Successfully", data: doc });
            next();
        }
        else {
            infoLog("deleteuserService => NO RECORD FOUND", [req.body, req.query, doc]);
            res.status(204).jsonp({ message: "Item Not Found !!", data: doc });
        }
    }
    catch (error) {
        errorLog("deleteuserService => PARAMETER ERROR", error, req.body);
        return res.status(500).jsonp({ mssage: "Please check parameter/s", error });
    }


};

/**
 * Pass _id to as KEY
 * @param req | any Body Parameter which wants to get updated 
 * @param res |
 */
export const updateuserService = async (req: Request = null, res: Response = null) => {
    infoLog("updateuserService", [req.body, req.query]);
    UserService.findOneAndUpdate({ ...req.query }, { ...req.body }, (err: object) => {
        if (err) {
            errorLog("deleteuserService => UPDATE FAILED ", err, req.method);
            return res.status(500).json({ message: [], item: "Something went Wrong" });
        }

    }).then((doc: object) => {
        if (!doc) {
            infoLog("updateuserService", [req.body, req.query, doc]);
            return res.status(204).json({ message: [], item: "Requested Element Not Found !!" });
        }
        else {
            infoLog("updateuserService", [req.body, req.query, doc]);
            return res.status(200).json({ message: "Updated Successfuly!!", item: doc });
        }

    });
};

export const getuserService = async (req: Request = null, res: Response = null) => {
    infoLog("getuserService", [req.body, req.query]);
    const pageOptions = {
        page: parseInt(req.body.page, 10) || 0,
        limit: parseInt(req.body.limit, 10) || 10
    };

    UserService.find()
        .skip(pageOptions.page * pageOptions.limit)
        .limit(pageOptions.limit)
        .exec((err, doc) => {
            if (err) {
                errorLog("getuserService => GET FAILED ", err, req.method);
                return res.status(500).jsonp({ "messge": [], error: "Something Went Wrong !!" });
            }
            else {
                {
                    let imageSource: string[] = []; // Pushing Image to it
                    for (const t in doc) {
                        if (doc[t]._id) {
                            infoLog("getuserService => IMAGE FOUND", [req.body, req.query]);
                            if (fs.existsSync(IMAGE_URI + doc[t]._id)) {
                                fs.readdirSync(IMAGE_URI + doc[t]._id).forEach(file => {
                                    imageSource.push(`http://52.186.14.151/api/static/${doc[t]._id + "/" + file}`);
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