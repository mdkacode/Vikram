"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const secrets_1 = require("../util/secrets");
const fs_1 = __importDefault(require("fs"));
const loggerInfo_1 = require("../util/loggerInfo");
const Category_1 = require("../models/Category");
/**
 * @description | Add Category with Image, Name & slug
 * @param req
 * @param res
 */
exports.addCategory = (req = null, res = null) => __awaiter(void 0, void 0, void 0, function* () {
    const Category = new Category_1.MasterCategory(Object.assign({}, req.body));
    loggerInfo_1.infoLog("addCategory", [req.body, req.query]);
    Category.save((err, doc) => {
        if (err) {
            loggerInfo_1.errorLog("addCategory", err, req.method);
            res.status(500).jsonp({ message: "Field Validation Failed !!", error: err });
        }
        else {
            loggerInfo_1.infoLog("addCategory => RESPONSE SUCCESS", [req.body, req.query, doc]);
            res.status(200).jsonp({ message: doc });
        }
    });
});
/**
 * Pass _id to delete the element
 * @param req |
 * @param res
 */
exports.deleteCategory = (req = null, res = null, next) => __awaiter(void 0, void 0, void 0, function* () {
    loggerInfo_1.infoLog("deleteCategory", [req.body, req.query]);
    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
        return res.status(500).jsonp({ message: "Body is Not Defined" });
    }
    try {
        const doc = yield Category_1.MasterCategory.deleteOne(Object.assign({}, req.body));
        if (doc.deletedCount > 0) {
            loggerInfo_1.infoLog("deleteCategory => SUCCESS", [req.body, req.query, doc]);
            res.status(200).jsonp({ message: "Item Deleted Successfully", data: doc });
            next();
        }
        else {
            loggerInfo_1.infoLog("deleteCategory => NO RECORD FOUND", [req.body, req.query, doc]);
            res.status(204).jsonp({ message: "Item Not Found !!", data: doc });
        }
    }
    catch (error) {
        loggerInfo_1.errorLog("deleteCategory => PARAMETER ERROR", error, req.body);
        return res.status(500).jsonp({ mssage: "Please check parameter/s", error });
    }
});
/**
 * Pass _id to as KEY
 * @param req | any Body Parameter which wants to get updated
 * @param res |
 */
exports.updateCategory = (req = null, res = null) => __awaiter(void 0, void 0, void 0, function* () {
    loggerInfo_1.infoLog("updateCategory", [req.body, req.query]);
    Category_1.MasterCategory.findOneAndUpdate(Object.assign({}, req.query), Object.assign({}, req.body), (err) => {
        if (err) {
            loggerInfo_1.errorLog("deleteCategory => UPDATE FAILED ", err, req.method);
            return res.status(500).json({ message: "Something went Wrong" });
        }
    }).then((doc) => {
        if (!doc) {
            loggerInfo_1.infoLog("updateCategory", [req.body, req.query, doc]);
            return res.status(204).json({ message: "Requested Element Not Found !!", item: doc });
        }
        else {
            loggerInfo_1.infoLog("updateCategory", [req.body, req.query, doc]);
            return res.status(200).json({ message: "Updated Successfuly!!", item: doc });
        }
    });
});
exports.getCategory = (req = null, res = null) => __awaiter(void 0, void 0, void 0, function* () {
    loggerInfo_1.infoLog("getCategory", [req.body, req.query]);
    const pageOptions = {
        page: parseInt(req.body.page, 10) || 0,
        limit: parseInt(req.body.limit, 10) || 10
    };
    Category_1.MasterCategory.find()
        .skip(pageOptions.page * pageOptions.limit)
        // .limit(pageOptions.limit)
        .exec((err, doc) => {
        if (err) {
            loggerInfo_1.errorLog("getCategory => GET FAILED ", err, req.method);
            return res.status(500).jsonp({ "messge": "Something Went Wrong !!", error: err });
        }
        else {
            {
                let imageSource = []; // Pushing Image to it
                for (const t in doc) {
                    if (doc[t]._id) {
                        loggerInfo_1.infoLog("getCategory => IMAGE FOUND", [req.body, req.query]);
                        console.log(doc[t]._id, "GETIMAGE");
                        if (fs_1.default.existsSync(secrets_1.IMAGE_URI + doc[t]._id)) {
                            console.log(doc[t]._id, "GETIMAGE");
                            console.log(`image FOUND ${secrets_1.IMAGE_URI + doc[t]._id}`);
                            fs_1.default.readdirSync(secrets_1.IMAGE_URI + doc[t]._id).forEach(file => {
                                imageSource.push(`${secrets_1.SERVER_IP}static/${doc[t]._id + "/" + file}`);
                            });
                        }
                        else {
                            imageSource.push(secrets_1.NOT_FOUND_IMAGE);
                        }
                    }
                    doc[t].imageList = imageSource;
                    imageSource = [];
                }
            }
            res.status(200).jsonp({ message: doc, size: doc.length });
        }
    });
});
//# sourceMappingURL=category.js.map