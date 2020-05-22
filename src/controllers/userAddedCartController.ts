import { Request, Response, NextFunction } from "express";
import { infoLog, errorLog } from "../util/loggerInfo";
import { UserAddedCart } from "../models/userAddedCartModal";
import { SERVER_IP } from "../util/secrets";

/**
 * @description | Add UserAddedCart with Image, Name & slug
 * @param req 
 * @param res 
 */
export const addUserAddedCart = async (req: Request = null, res: Response = null) => {

    const userAddedCart = new UserAddedCart({
        ...req.body
    });
    infoLog("addUserAddedCart", [req.body, req.query]);
    userAddedCart.save((err, doc) => {
        if (err) {
            errorLog("addUserAddedCart", err, req.method);
            res.status(500).jsonp({ message: "Field Validation Failed !!", error: err });
        }
        else {
            infoLog("addUserAddedCart => RESPONSE SUCCESS", [req.body, req.query, doc]);
            res.status(200).jsonp({ message: doc });
        }

    });
};


export const updateUserAddedCart = async (req: Request = null, res: Response = null) => {
    infoLog("updateUserAddedCart", [req.body, req.query]);
    UserAddedCart.update(
        { "carts.storeId": req.storeId },
        {
            "$push": {
                "carts": req.body,
            }
        },
        { safe: true, upsert: true },
        (err: object) => {
            if (err) {
                errorLog("deleteUserAddedCart => UPDATE FAILED ", err, req.method);
                return res.status(500).json({ message: "Something went Wrong" });
            }

        }).then((doc: object) => {
            if (!doc) {
                infoLog("updateUserAddedCart", [req.body, req.query, doc]);
                return res.status(204).json({ message: "Requested Element Not Found !!", item: doc });
            }
            else {
                infoLog("updateUserAddedCart", [req.body, req.query, doc]);
                return res.status(200).json({ message: "Updated Successfuly!!", item: doc });
            }

        });
};