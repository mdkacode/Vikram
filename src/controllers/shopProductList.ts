import Axios from "axios";
import fs from "fs";
import { IMAGE_URI, SERVER_IP, NOT_FOUND_IMAGE } from "../util/secrets";
import { Types } from "mongoose";
import { Request, Response, NextFunction } from "express";
import { infoLog, errorLog } from "../util/loggerInfo";
import { ShopProductsList } from "../models/ShopProductListModel";
import { ShopKeeper } from "../models/shopKeeperModel";
import { Promise } from "bluebird";
import sendTeleegramNotification from "../util/telegram.bot";

/**
 * @description | Add ShopProductsList with Image, Name & slug
 * @param req
 * @param res
 */
export const addShopProductsList = async (
  req: Request = null,
  res: Response = null
) => {
  const shopProductsList = new ShopProductsList({
    ...req.body,
  });
  infoLog("addShopProductsList", [req.body, req.query]);
  shopProductsList.save((err, doc) => {
    if (err) {
      errorLog("addShopProductsList", err, req.method);
      res
        .status(500)
        .jsonp({ message: "Field Validation Failed !!", error: err });
    } else {
      infoLog("addShopProductsList => RESPONSE SUCCESS", [
        req.body,
        req.query,
        doc,
      ]);
      res.status(200).jsonp({ message: doc });
    }
  });
};

/**
 * Pass _id to delete the element
 * @param req |
 * @param res
 */
export const deleteShopProductsList = async (
  req: Request = null,
  res: Response = null,
  next: NextFunction
) => {
  infoLog("deleteShopProductsList", [req.body, req.query]);
  if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
    return res.status(500).jsonp({ message: "Body is Not Defined" });
  }
  try {
    const doc = await ShopProductsList.deleteOne({ ...req.body });
    if (doc.deletedCount > 0) {
      infoLog("deleteShopProductsList => SUCCESS", [req.body, req.query, doc]);
      res
        .status(200)
        .jsonp({ message: "Item Deleted Successfully", data: doc });
      next();
    } else {
      infoLog("deleteShopProductsList => NO RECORD FOUND", [
        req.body,
        req.query,
        doc,
      ]);
      res.status(204).jsonp({ message: "Item Not Found !!", data: doc });
    }
  } catch (error) {
    errorLog("deleteShopProductsList => PARAMETER ERROR", error, req.body);
    return res.status(500).jsonp({ mssage: "Please check parameter/s", error });
  }
};

/**
 * Pass _id to as KEY
 * @param req | any Body Parameter which wants to get updated
 * @param res |
 */
export const updateShopProductsList = async (
  req: Request = null,
  res: Response = null
) => {
  infoLog("updateShopProductsList", [req.body, req.query]);
  ShopProductsList.findOneAndUpdate(
    { ...req.query },
    { $addToSet: { products: req.body.products } },
    (err: object) => {
      if (err) {
        errorLog("deleteShopProductsList => UPDATE FAILED ", err, req.method);
        return res.status(500).json({ message: "Something went Wrong" });
      }
    }
  ).then((doc: object) => {
    if (!doc) {
      infoLog("updateShopProductsList", [req.body, req.query, doc]);
      return res
        .status(204)
        .json({ message: "Requested Element Not Found !!", item: doc });
    } else {
      infoLog("updateShopProductsList", [req.body, req.query, doc]);
      sendTeleegramNotification("447233341", "Hello");
      return res
        .status(200)
        .json({ message: "Updated Successfuly!!", item: doc });
    }
  });
};

export const getShopProductsList = async (
  req: Request = null,
  res: Response = null
) => {
  infoLog("getShopProductsList", [req.body, req.query]);
  const pageOptions = {
    page: parseInt(req.body.page, 10) || 0,
    limit: parseInt(req.body.limit, 10) || 10,
  };

  ShopProductsList.find()
    .skip(pageOptions.page * pageOptions.limit)
    .limit(pageOptions.limit)
    .exec((err, doc) => {
      if (err) {
        errorLog("getShopProductsList => GET FAILED ", err, req.method);
        return res
          .status(500)
          .jsonp({ messge: "Something Went Wrong !!", error: err });
      } else {
        infoLog("getShopProductsList ==> SUCCESS", [req.body, req.query]);
        res.status(200).jsonp(doc[0]);
      }
    });
};

export const getNamedShopProductsList = async (
  req: Request = null,
  res: Response = null
) => {
  infoLog("getNamedShopProductsList", [req.body, req.query]);

  const pageOptions = {
    page: parseInt(req.body.page, 10) || 0,
    limit: parseInt(req.body.limit, 10) || 10,
  };
  if (req.query._id) {
    const { _id } = req.query as { _id: string };
    const allProjection = [
      { $match: { _id: Types.ObjectId(_id) } },
      { $unwind: "$products" },
      { $group: { _id: "$_id", products: { $push: "$products" } } },
    ];
    const catProjection = [
      { $match: { _id: Types.ObjectId(_id) } },
      { $unwind: "$products" },
      { $match: { "products.cIds": req.query["products.cIds"] } },
      { $group: { _id: "$_id", products: { $push: "$products" } } },
    ];

    // taking out Product id from the array
    ShopProductsList.aggregate(
      req.query["products.cIds"] ? catProjection : allProjection
    )
      // find({ ...req.query }, req.query["products.cIds"] && projection)
      // .skip(pageOptions.page * pageOptions.limit)
      // .limit(pageOptions.limit)
      .exec(async (err, doc) => {
        console.log(err, "GET DATA ERRO");
        console.log(doc, "GET DATA");
        if (err || doc.length == 0) {
          errorLog("getNamedShopProductsList => GET FAILED ", err, req.method);
          return res.status(500).jsonp({
            messge: [],
            error: "Something Went Wrong !!",
            suggestion: "Please try with storeProductListId",
          });
        } else {
          const productList: object[] = [];

          infoLog("getNamedShopProductsList ==> SUCCESS", [
            req.body,
            req.query,
          ]);

          if (doc[0]["products"].length > 0) {
            let tempIds = "";
            for (let i = 0, len = doc[0]["products"].length; i < len; i++) {
              tempIds =
                tempIds + `${tempIds ? "," : ""}` + doc[0]["products"][i].pId;
            }

            console.log(tempIds, "GET PIDS ");
            const elementLength = doc[0]["products"].length;
            console.log("GETPROUCSLENGTH", doc[0]["products"].length);
            console.log(doc[0]["products"], "asdfghjklkjhgfdsa");
            const data = await Axios(
              "http://localhost:3000/api/product/many?ids=" + tempIds
            );

            const merged = [];
            const reponseData = data.data.data;
            for (let i = 0; i < doc[0]["products"].length; i++) {
              merged.push({
                ...doc[0]["products"][i],
                ...reponseData.find(
                  (itmInner: unknown) =>
                    itmInner._id === doc[0]["products"][i].pId
                ),
              });
            }
            // let arr3 = arr1.map((item, i) => Object.assign({}, item, arr2[i]));
            res.status(200).jsonp({ products: merged, length: elementLength });
          } else
            res
              .status(500)
              .jsonp({ products: [], message: "No Product Found" });
        }
      });
  } else {
    res
      .status(500)
      .jsonp({ message: "Please check Shop ID", error: "shopId not Found" });
  }
};

export const allProducts = async (
  req: Request = null,
  res: Response = null
) => {
  const shopIds = req.query.shopIds;

  ShopProductsList.find({ _id: shopIds.split(",") }).then(async (doc) => {
    const aggregatedProdcutList = [];
    const productIds: string[] = [];
    const pidshopList: {
      pId: string;
      cIds: string;
      shop_id: any;
      price: object;
    }[] = [];

    doc.map(async (e) => {
      e.products["shopId"] = e._id;
      e.products.map((q) => {
        q["shop_id"] = e._id;
        productIds.push(q.pId);
        aggregatedProdcutList.push(q);
        pidshopList.push({ ...q });
      });
    });

    console.log("qwerty" + productIds.join());
    // console.log(e.products)
    const dataa = await Axios(
      "http://localhost:3000/api/product/many?ids=" + productIds.join()
    );

    const masterarry: unknown[] = [];

    const areaProducts = await Promise.map(dataa.data.data, (e: unknown) => {
      pidshopList.find((item) => {
        if (item.pId === e._id) {
          e.shopId = item.shop_id;

          masterarry.push({ ...item, ...e });
        }
      });
      return masterarry;
    });
    // let dataaaa = await Promise.all(dataa.data.data.map(e =>));
    res.status(200).json({ products: masterarry, length: areaProducts.length });
  });
};

export const nearByShops = async (
  req: Request = null,
  res: Response = null
) => {
  const longitude = req.query.long;
  const lattitude = req.query.lat;
  const distance = req.query.distance;
  const doc = await ShopKeeper.find();

  let imageSource: string[] = []; // Pushing Image to it
  for (const t in doc) {
    if (doc[t]._id) {
      infoLog("getShopKeeper => IMAGE FOUND", [req.body, req.query]);
      if (fs.existsSync(IMAGE_URI + doc[t]._id)) {
        fs.readdirSync(IMAGE_URI + doc[t]._id).forEach((file) => {
          imageSource.push(`${SERVER_IP}static/${doc[t]._id + "/" + file}`);
        });
      } else {
        imageSource.push(NOT_FOUND_IMAGE);
      }
    }
    doc[t].imageList = imageSource;
    imageSource = [];
  }
  res.status(200).jsonp({ message: doc });
};
