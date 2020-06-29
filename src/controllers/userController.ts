import { Request, Response, NextFunction } from "express";
import { infoLog, errorLog } from "../util/loggerInfo";
import { MasterProductList } from "../models/productModel";
import {User} from "../models/userModel";
/**
 * @description | Add Product with Image, Name & slug
 * @param req
 * @param res
 */
export const createCustomer = async (req: Request = null, res: Response = null) => {

    const User = new MasterProductList({
        ...req.body
    });
    infoLog("createCustomer", [req.body, req.query]);
    User.save((err, doc) => {
        if (err) {
            errorLog("createCustomer", err, req.method);
            res.status(500).jsonp({ message: "Field Validation Failed !!", error: err });
        }
        else {
            infoLog("createCustomer => RESPONSE SUCCESS", [req.body, req.query, doc]);
            res.status(200).jsonp({ message: doc });
        }

    });
};

/**
 * Pass _id to delete the element
 * @param req |
 * @param res
 */
export const deleteCustomer = async (req: Request = null, res: Response = null, next: NextFunction) => {
    infoLog("deleteCustomer", [req.body, req.query]);
    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {

        return res.status(500).jsonp({ message: "Body is Not Defined" });
    }
    try {
        const doc = await User.deleteOne({ ...req.body });
        if (doc.deletedCount > 0) {
            infoLog("deleteCustomer => SUCCESS", [req.body, req.query, doc]);
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
export const updateCustomer = async (req: Request = null, res: Response = null) => {
    infoLog("updateCustomer", [req.body, req.query]);
    User.findOneAndUpdate({ ...req.query }, { ...req.body }, (err: object) => {
        if (err) {
            errorLog("updateCustomer => UPDATE FAILED ", err, req.method);
            return res.status(500).json({ message: "Something went Wrong" });
        }

    }).then((doc: object) => {
        if (!doc) {
            infoLog("updateCustomer", [req.body, req.query, doc]);
            return res.status(204).json({ message: "Requested Element Not Found !!", item: doc });
        }
        else {
            infoLog("updateCustomer", [req.body, req.query, doc]);
            return res.status(200).json({ message: "Updated Successfuly!!", item: doc });
        }

    });
};
