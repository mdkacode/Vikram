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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const loggerInfo_1 = require("./util/loggerInfo");
const express_1 = __importDefault(require("express"));
const compression_1 = __importDefault(require("compression")); // compresses requests
const express_session_1 = __importDefault(require("express-session"));
const body_parser_1 = __importDefault(require("body-parser"));
const multer_1 = __importDefault(require("multer"));
const cors_1 = __importDefault(require("cors"));
const fs_1 = __importDefault(require("fs"));
const lusca_1 = __importDefault(require("lusca"));
const connect_mongo_1 = __importDefault(require("connect-mongo"));
const express_flash_1 = __importDefault(require("express-flash"));
const path_1 = __importDefault(require("path"));
const mongoose_1 = __importDefault(require("mongoose"));
const passport_1 = __importDefault(require("passport"));
const bluebird_1 = __importDefault(require("bluebird"));
const secrets_1 = require("./util/secrets");
const MongoStore = connect_mongo_1.default(express_session_1.default);
// Controllers (route handlers)
const categoryController = __importStar(require("./controllers/category"));
const productController = __importStar(require("./controllers/product"));
const shopKeeperController = __importStar(require("./controllers/shopKeeper"));
const shopProductListController = __importStar(require("./controllers/shopProductList"));
// API keys and Passport configuration
const imageDownload_1 = __importDefault(require("./util/imageDownload"));
// Create Express server
const app = express_1.default();
// Connect to MongoDB
const mongoUrl = secrets_1.MONGODB_URI;
mongoose_1.default.Promise = bluebird_1.default;
mongoose_1.default.connect(mongoUrl, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }).then(() => { }).catch(err => {
    console.log("MongoDB connection error. Please make sure MongoDB is running. " + err);
    // process.exit();
});
const UPLOAD_PATH = "imagesPublic/";
// Express configuration
app.set("port", process.env.PORT || 3001);
app.use(express_1.default.static(__dirname + UPLOAD_PATH));
app.use("/api/static", express_1.default.static(UPLOAD_PATH));
app.use(compression_1.default());
app.use(cors_1.default());
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(express_session_1.default({
    resave: true,
    saveUninitialized: true,
    secret: secrets_1.SESSION_SECRET,
    store: new MongoStore({
        url: mongoUrl,
        autoReconnect: true
    })
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use(express_flash_1.default());
app.use(lusca_1.default.xframe("SAMEORIGIN"));
app.use(lusca_1.default.xssProtection(true));
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, UPLOAD_PATH);
    },
    filename: function (req, file, cb) {
        const fileName = file.originalname;
        const lastExtenstion = fileName.substring(fileName.lastIndexOf("."));
        const folderName = req.query.name;
        !fs_1.default.existsSync(UPLOAD_PATH + folderName.toString()) && fs_1.default.mkdirSync(UPLOAD_PATH + folderName.toString());
        cb(null, `${folderName.toString()}/${new Date().getTime()}${lastExtenstion}`);
    }
});
const upload = multer_1.default({ limits: { fileSize: 8000000 }, storage: storage });
app.use((req, res, next) => {
    console.log(req.method);
    console.log(req.url);
    res.locals.user = req.user;
    next();
});
app.use((req, res, next) => {
    // After successful login, redirect back to the intended page
    if (!req.user &&
        req.path !== "/login" &&
        req.path !== "/signup" &&
        !req.path.match(/^\/auth/) &&
        !req.path.match(/\./)) {
        req.session.returnTo = req.path;
    }
    else if (req.user &&
        req.path == "/account") {
        req.session.returnTo = req.path;
    }
    next();
});
app.use(express_1.default.static(path_1.default.join(__dirname, "public"), { maxAge: 31557600000 }));
/**
 * Primary app routes.
 */
app.post("/api/productImage", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.query.image) {
        loggerInfo_1.infoLog("productImageURL", [req.query, req.body]);
        const imageUrl = req.query.image.toString();
        const imgUrls = imageUrl.split(",");
        console.log(imgUrls);
        !fs_1.default.existsSync("imagesPublic/" + req.query.name.toString()) && fs_1.default.mkdirSync("imagesPublic/" + req.query.name.toString());
        for (const t in imgUrls) {
            const lastExtenstion = imgUrls[t].substring(imgUrls[t].lastIndexOf("."));
            console.log("GET IMAGE TYPE", lastExtenstion);
            yield imageDownload_1.default({ name: `${req.query.name}/${new Date().getTime()}${lastExtenstion}`, link: imgUrls[t], folder: "imagesPublic" });
        }
        res.status(200).jsonp({ message: "uploaded Succesfully" });
    }
    else {
        loggerInfo_1.infoLog("productImageFILE", [req.query, req.body]);
        upload.any()(req, res, (err) => {
            if (err instanceof multer_1.default.MulterError) {
                console.log(err);
                return res.send(err);
            }
            else if (err) {
                return res.status(500).send(err);
            }
            res.status(200).jsonp({ message: "Files Uploaded Succcesfully" });
        });
    }
}));
//category Routes Here START
/**
 * Four Routes
 * Add Updated and Delete (Will Only Deactivate it)
 */
//Category APIs
app.post("/api/category/add", categoryController.addCategory);
app.post("/api/category/update", categoryController.updateCategory);
app.post("/api/category/delete", categoryController.deleteCategory);
app.get("/api/category", categoryController.getCategory);
//Category APIs
// Product APIS
app.post("/api/product/add", productController.addProduct);
app.post("/api/product/update", productController.updateProduct);
app.post("/api/product/delete", productController.deleteProduct);
app.get("/api/product", productController.getProduct);
app.get("/api/product/one", productController.getSingleProduct);
app.get("/api/product/many", productController.getManyProduct);
// Product APIS
// Product APIS
app.post("/api/shopkeeper/add", shopKeeperController.addShopKeeper);
app.post("/api/shopkeeper/update", shopKeeperController.updateShopKeeper);
app.post("/api/shopkeeper/delete", shopKeeperController.deleteShopKeeper);
app.get("/api/shopkeeper", shopKeeperController.getShopKeeper);
app.post("/api/shopkeeper/validate", shopKeeperController.validateShopKeeper);
// Product APIS
// ShopProducts APIS
app.post("/api/ShopProducts/add", shopProductListController.addShopProductsList);
app.post("/api/ShopProducts/update", shopProductListController.updateShopProductsList);
app.post("/api/ShopProducts/delete", shopProductListController.deleteShopProductsList);
app.get("/api/ShopProducts", shopProductListController.getShopProductsList);
app.get("/api/ShopProducts/namelist", shopProductListController.getNamedShopProductsList);
exports.default = app;
//# sourceMappingURL=app.js.map