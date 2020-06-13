import { IMAGE_URI, SERVER_IP, NOT_FOUND_IMAGE } from "../util/secrets";
import fs from "fs";
import { Request, Response, NextFunction } from "express";
import { infoLog, errorLog } from "../util/loggerInfo";
import { User, UserSchema } from "../models/userModel";
import { UserAddedCart, IuserAddedCart } from "../models/userAddedCartModal";

import messages from "../util/message";
/**
 * @description | Add UserService with Image, Name & slug
 * @param req 
 * @param res 
 */
export const adduserService = async (req: Request = null, res: Response = null, next: NextFunction = null) => {

    const uniqueNumber = Math.floor(1000 + Math.random() * 9000);;
    infoLog("adduserService", [req.body, req.query]);
    const newUser = new User({
        ...req.body,
        otp: uniqueNumber,
        createdBy: "admin",
        updatedBy: "admin"
    });
    await User.findOne({ phone: req.body.phone }, (err, user) => { // for cheking existing user

        infoLog("FindingNewUser", [req.body, req.query]);
        if (err) {
            errorLog("adduserService", [req.body, req.query], "find user Error");
            res.status(500).json({ message: "something went wrong", trace: err })
        }
        else {
            if (!user) {
                infoLog("AddingNewUser", [req.body, req.query]);
                newUser.save((err, user) => {
                    if (err) {
                        errorLog("adduserService", err, req.method);
                        res.status(500).jsonp({ message: "Store Creation Failed !!", error: err });
                    }
                    else {
                        const cart = new UserAddedCart({ storeId: req.body.phone + "cart", userId: req.body.phone });

                        cart.save((err: object, doc: object) => {
                            if (err) {
                                errorLog("NewUserCartError", [req.body.phone], "newCart");

                            }
                            else {
                                infoLog("NewUserCartSucess", [req.body]);

                            }
                        });

                        res.status(200).jsonp({ User: [user] });

                         messages.sendMessage({ code: uniqueNumber, userNumber: req.body.phone });
                        // messages.sendWhatsAppMessage({ code: uniqueNumber, userNumber: req.body.phone });


                    }
                });
            }
            else {
                User.updateOne({ phone: req.body.phone }, {
                    otp: uniqueNumber,
                }, function (err: any, affected: any, user: any) {
                    if (err) {
                        errorLog("NewUserCartError", [req.body.phone], "UpdatedPasword");
                        res.status(500).json({ error: "something went wrong", trace: err });
                    }
                    else {

                        if (affected.nModified == 1) {
                            infoLog("PasswordRequested", [req.body]);
                             messages.sendMessage({ code: uniqueNumber, userNumber: req.body.phone });
                            // messages.sendWhatsAppMessage({ code: uniqueNumber, userNumber: req.body.phone });
                            User.find({ phone: req.body.phone }, (err: any, User: object) => {
                                res.status(200).json({ User });
                            });
                        } else res.status(204);
                    }
                });
            }


        }
    });



};

/**
 * Pass _id to delete the element
 * @param req | 
 * @param res 
 */


export const validateuserService = async (req: Request = null, res: Response = null, next: NextFunction) => {

    const validData = await User.find().where({ phone: req.body.phone, OTP: req.body.otp });
    if (validateuserService) {
        res.send(validData);
    }
    else {
        res.send("Something Went Wrong");
    }
};

export const userInfoService = async (req: Request = null, res: Response = null, next: NextFunction) => {

    const userInfo = await User.find().where({ phone: req.query.phone });
    if (validateuserService) {
        res.send(userInfo);
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
        const doc = await User.deleteOne({ ...req.body });
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
    User.findOneAndUpdate({ ...req.query }, { ...req.body }, (err: object) => {
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

    User.find()
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