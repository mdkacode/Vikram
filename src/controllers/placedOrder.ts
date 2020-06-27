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
    console.log("GETTING HERER SIME");
    let filterUserCart = await UserAddedCart.find({},async (err,result)=>{
        if(err){
            res.status(500).jsonp( {error:"Something Went Wrong"});
        }
        else {
            let finalCartInfo:any = [];
            await Promise.map(result, async (cartItem:any,index:number)=>{

                await Promise.map(cartItem['carts']['prodcuts'],async (item: any, index: number) => {
                    const getOrderDate = new Date(item.orderDate);
                    let todayDate = new Date();
                    if(getOrderDate.getDate() == todayDate.getDate()){

                        finalCartInfo.push(item);
                    }

                }).catch(e=>{
                    console.log(e)
                })
                await Promise.map(finalCartInfo,async  (item:any,index:number)=>{
                    let userCheck = true;
                    userCheck &&  await Promise.map(item.prodcucts,async (userInfo:any,index:number)=>{
                        let userDetails = await User.findOne({phone:userInfo.userId});
                        item['userInfo'] = userDetails;
                        userCheck = false;
                    })

                })
            })







            res.status(200).jsonp( finalCartInfo);

        }
    })


    // first filter by user id

}