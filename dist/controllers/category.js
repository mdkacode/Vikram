"use strict";
var __awaiter =
	(this && this.__awaiter) ||
	function (thisArg, _arguments, P, generator) {
		function adopt(value) {
			return value instanceof P
				? value
				: new P(function (resolve) {
						resolve(value);
				  });
		}
		return new (P || (P = Promise))(function (resolve, reject) {
			function fulfilled(value) {
				try {
					step(generator.next(value));
				} catch (e) {
					reject(e);
				}
			}
			function rejected(value) {
				try {
					step(generator["throw"](value));
				} catch (e) {
					reject(e);
				}
			}
			function step(result) {
				result.done
					? resolve(result.value)
					: adopt(result.value).then(fulfilled, rejected);
			}
			step((generator = generator.apply(thisArg, _arguments || [])).next());
		});
	};
var __importDefault =
	(this && this.__importDefault) ||
	function (mod) {
		return mod && mod.__esModule ? mod : { default: mod };
	};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const loggerInfo_1 = require("../util/loggerInfo");
const Category_1 = require("../models/Category");
exports.addCategory = (req = null, res = null) =>
	__awaiter(void 0, void 0, void 0, function* () {
		const Category = new Category_1.MasterCategory(Object.assign({}, req.body));
		loggerInfo_1.infoLog("addCategory", [req.body, req.query]);
		Category.save((err, doc) => {
			if (err) {
				loggerInfo_1.errorLog("addCategory", err, req.method);
				res
					.status(500)
					.jsonp({ message: "Field Validation Failed !!", error: err });
			} else {
				loggerInfo_1.infoLog("addCategory => RESPONSE SUCCESS", [
					req.body,
					req.query,
					doc,
				]);
				res.status(200).jsonp({ message: doc });
			}
		});
	});
exports.deleteCategory = (req = null, res = null) =>
	__awaiter(void 0, void 0, void 0, function* () {
		loggerInfo_1.infoLog("deleteCategory", [req.body, req.query]);
		Category_1.MasterCategory.deleteOne(
			Object.assign({}, req.body),
			(err, doc) => {
				if (err) {
					loggerInfo_1.errorLog(
						"deleteCategory => DELETE FAILED ",
						err,
						req.method,
					);
					return res.status(500).json({ message: "Something went Wrong" });
				} else
					return res
						.status(200)
						.json({ item: doc.deletedCount == 0 ? "No Item Found" : doc });
			},
		);
	});
exports.updateCategory = (req = null, res = null) =>
	__awaiter(void 0, void 0, void 0, function* () {
		loggerInfo_1.infoLog("deleteCategory", [req.body, req.query]);
		Category_1.MasterCategory.findOneAndUpdate(
			Object.assign({}, req.query),
			Object.assign({}, req.body),
			{ useFindAndModify: false },
			(err, doc) => {
				if (err) {
					loggerInfo_1.errorLog(
						"deleteCategory => UPDATE FAILED ",
						err,
						req.method,
					);
					return res.status(500).json({ message: "Something went Wrong" });
				} else return res.status(200).json({ item: doc });
			},
		);
	});
exports.getCategory = (req = null, res = null) =>
	__awaiter(void 0, void 0, void 0, function* () {
		// const UPLOAD_PATH = "/Users/anrag/Documents/saumi/TypeScript-Node-Starter/imagesPublic/";
		const UPLOAD_PATH = " /home/anragkush/anil-backend/imagesPublic";
		loggerInfo_1.infoLog("getCategory", [req.body, req.query]);
		let imageSource = [];
		const message = [];
		const pageOptions = {
			page: parseInt(req.query.page, 10) || 0,
			limit: parseInt(req.query.limit, 10) || 10,
		};
		Category_1.MasterCategory.find()
			.skip(pageOptions.page * pageOptions.limit)
			.limit(pageOptions.limit)
			.exec((err, doc) => {
				if (err) {
					loggerInfo_1.errorLog("getCategory => GET FAILED ", err, req.method);
					return res
						.status(500)
						.jsonp({ messge: "Something Went Wrong !!", error: err });
				} else {
					{
						console.log(doc.length);
						for (const t in doc) {
							if (doc[t].imagepath) {
								fs_1.default
									.readdirSync(UPLOAD_PATH + doc[t].imagepath)
									.forEach((file) => {
										imageSource.push(
											`http://192.168.0.102:3000/static/${
												doc[t].imagepath + "/" + file
											}`,
										);
									});
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
