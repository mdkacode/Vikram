import { IMAGE_URI, SERVER_IP, NOT_FOUND_IMAGE } from "../util/secrets";
import { Request, Response, NextFunction } from "express";
import { UserAddedCart } from "../models/userAddedCartModal";
import { User, UserSchema } from "../models/userModel";
// @ts-ignore
import Promise from 'bluebird';
import { infoLog, errorLog } from "../util/loggerInfo";

/**
 * filters (DAY | HOURS | USER_ID | STORE)
 * Upcoming (AREA WISE filters)
 * upcoming pagination
 * @return user Details with the order summery
 * @param req
 * @param res
 */
export const orderByFilters = async (req: Request = null, res: Response = null) =>{
    let filterUserCart = await UserAddedCart.findOne({})
    let cartElements = filterUserCart['carts'];
    let finalCartInfo:any = [];
    let finalCartObject:any = [];
    await Promise.map(cartElements['prodcuts'],async (item: any, index: number) => {
        const getOrderDate = new Date(item.orderDate);
        let todayDate = new Date();
        if(getOrderDate.getDate() == todayDate.getDate()){
            finalCartInfo.push(item);
        }

    }).then(function () {

    })
    await Promise.map(finalCartInfo,async  (item:any,index:number)=>{
        let userCheck = true;
        userCheck &&  await Promise.map(item.prodcucts,async (userInfo:any,index:number)=>{
           let userDetails = await User.findOne({phone:userInfo.userId});
           console.log('GET USER INFO',userDetails);
            item['userInfo'] = userDetails;
           userCheck = false;
        })

    })


    res.status(200).jsonp( finalCartInfo);
    // first filter by user id

}