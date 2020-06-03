import sendTeleegramNotification from '../util/telegram.bot';
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
        "userId": req.query.userId,
        "carts": {
            "storeId": req.query.storeId,
        }
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
export const findUserAddedCart = async (req: Request = null, res: Response = null) => {

    let failedOrderReq = req.query.isFailed;

    UserAddedCart.findOne({ "userId": req.query.userId }, (err: object, doc: object) => {
        if (err) {
            errorLog("UserCartGetElement", err, req.method);
            res.status(500).json({ message: "Something went Wrong !!" });
        }
        else {
            let productsArray = [];
            let failedOrder = [];
            if (doc) {
                if (doc['carts']) {
                    doc.carts.prodcuts.map(product => {
                        console.log(product);
                        if (product.method !== "") {
                            let amount = 0;
                            product.prodcucts && product.prodcucts.map(e => {
                                amount += e.price.sp * e.quantity;
                            })
                            productsArray.push({ shopName: product.storeId, orderDate: product.orderDate || '', products: product.prodcucts, total: amount < 500 ? amount + 10 : amount });
                            console.log("GETPRD", product.products);
                        }
                        else {
                            let amount = 0;
                            product.prodcucts && product.prodcucts.map(e => {
                                amount += e.price.sp * e.quantity;
                            })
                            failedOrder.push({ shopName: product.storeId, products: product.prodcucts, total: amount < 500 ? amount + 10 : amount });
                            console.log("GETPRD", product.products);
                        }

                    })
                    res.status(200).json({ data: failedOrderReq == 1 ? failedOrder : productsArray, message: `Data Not for ${doc.userId}` });
                }
                else {
                    res.status(200).json({ data: [], message: `Data Not for ${doc.userId}` });
                }


            }
            else {
                res.status(200).json({ data: [], message: "Data Not Found" });
            }

        }
    })
};


export const updateUserAddedCart = async (req: Request = null, res: Response = null) => {
    infoLog("updateUserAddedCart", [req.body, req.query]);

    console.log('--qwew----wqwq----wqwqwqwqqw----wqwqqwqw---wwqwq');
    console.log(req.body);
    UserAddedCart.updateOne(
        { "userId": req.query.userId },
        {
            "$addToSet": {
                "carts.prodcuts": { ...req.body },
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
                infoLog("After", [req.body, req.query, doc]);
                return res.status(204).json({ message: "Requested Element Not Found !!", item: doc });
            }
            else {
                infoLog("updateUserAddedCart", [req.body, req.query, doc]);


                // sendTeleegramNotification("930311240", JSON.stringify({ ...req.body }))
                // sendTeleegramNotification("984079007", JSON.stringify({ ...req.body }))
                sendTeleegramNotification("447233341", JSON.stringify({ ...req.body }));
                return res.status(200).json({ message: "Updated Successfuly!!", item: doc });
            }

        });
};