import { infoLog } from "./util/loggerInfo";

import express from "express";
import compression from "compression";  // compresses requests
import session from "express-session";
import bodyParser from "body-parser";
import multer from "multer";
import cors from "cors";
import fs from "fs";
import lusca from "lusca";
import mongo from "connect-mongo";
import flash from "express-flash";
import path from "path";
import mongoose from "mongoose";
import passport from "passport";
import bluebird from "bluebird";
import { MONGODB_URI, SESSION_SECRET } from "./util/secrets";

const MongoStore = mongo(session);

// Controllers (route handlers)
import * as categoryController from "./controllers/category";
import * as productController from "./controllers/product";
import * as shopKeeperController from "./controllers/shopKeeper";
import * as shopProductListController from "./controllers/shopProductList";

// API keys and Passport configuration
import downloadImage from "./util/imageDownload";

// Create Express server
const app = express();

// Connect to MongoDB
const mongoUrl = MONGODB_URI;
mongoose.Promise = bluebird;

mongoose.connect(mongoUrl, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }).then(
    () => { /** ready to use. The `mongoose.connect()` promise resolves to undefined. */ },
).catch(err => {
    console.log("MongoDB connection error. Please make sure MongoDB is running. " + err);
    // process.exit();
});

const UPLOAD_PATH = "imagesPublic/";
// Express configuration
app.set("port", process.env.PORT || 3000);
app.use(express.static(__dirname + UPLOAD_PATH));
app.use("/static", express.static(UPLOAD_PATH));

app.use(compression());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: SESSION_SECRET,
    store: new MongoStore({
        url: mongoUrl,
        autoReconnect: true
    })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(lusca.xframe("SAMEORIGIN"));
app.use(lusca.xssProtection(true));
const storage = multer.diskStorage({

    destination: function (req, file, cb) {
        cb(null, UPLOAD_PATH);
    },
    filename: function (req, file, cb) {
        const fileName = file.originalname;
        const lastExtenstion = fileName.substring(fileName.lastIndexOf("."));
        const folderName = req.query.name;
        !fs.existsSync(UPLOAD_PATH + folderName.toString()) && fs.mkdirSync(UPLOAD_PATH + folderName.toString());
        cb(null, `${folderName.toString()}/${new Date().getTime()}${lastExtenstion}`);
    }
});

const upload = multer({ limits: { fileSize: 8000000 }, storage: storage });

app.use((req, res, next) => {
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
    } else if (req.user &&
        req.path == "/account") {
        req.session.returnTo = req.path;
    }
    next();
});

app.use(
    express.static(path.join(__dirname, "public"), { maxAge: 31557600000 })
);

/**
 * Primary app routes.
 */


app.post("/productImage", async (req, res) => {
    if (req.query.image) {
        infoLog("productImageURL", [req.query, req.body]);
        const imageUrl = req.query.image.toString();
        const imgUrls = imageUrl.split(",");
        console.log(imgUrls);
        !fs.existsSync("imagesPublic/" + req.query.name.toString()) && fs.mkdirSync("imagesPublic/" + req.query.name.toString());
        for (const t in imgUrls) {
            const lastExtenstion = imgUrls[t].substring(imgUrls[t].lastIndexOf("."));
            console.log("GET IMAGE TYPE", lastExtenstion);
            await downloadImage({ name: `${req.query.name}/${new Date().getTime()}${lastExtenstion}`, link: imgUrls[t], folder: "imagesPublic" });
        }
        res.status(200).jsonp({ message: "uploaded Succesfully" });
    }
    else {
        infoLog("productImageFILE", [req.query, req.body]);
        upload.any()(req, res, (err: unknown) => {
            if (err instanceof multer.MulterError) {
                console.log(err);
                return res.send(err);
            } else if (err) {
                return res.status(500).send(err);
            }
            res.status(200).jsonp({ message: "Files Uploaded Succcesfully" });
        });
    }
});



//category Routes Here START
/**
 * Four Routes 
 * Add Updated and Delete (Will Only Deactivate it)
 */


//Category APIs
app.post("/category/add", categoryController.addCategory);
app.post("/category/update", categoryController.updateCategory);
app.post("/category/delete", categoryController.deleteCategory);
app.get("/category", categoryController.getCategory);
//Category APIs

// Product APIS
app.post("/product/add", productController.addProduct);
app.post("/product/update", productController.updateProduct);
app.post("/product/delete", productController.deleteProduct);
app.get("/product", productController.getProduct);
app.get("/product/one", productController.getSingleProduct);
// Product APIS


// Product APIS
app.post("/shopkeeper/add", shopKeeperController.addShopKeeper);
app.post("/shopkeeper/update", shopKeeperController.updateShopKeeper);
app.post("/shopkeeper/delete", shopKeeperController.deleteShopKeeper);
app.get("/shopkeeper", shopKeeperController.getShopKeeper);
app.post("/shopkeeper/validate", shopKeeperController.validateShopKeeper);
// Product APIS

// ShopProducts APIS
app.post("/ShopProducts/add", shopProductListController.addShopProductsList);
app.post("/ShopProducts/update", shopProductListController.updateShopProductsList);
app.post("/ShopProducts/delete", shopProductListController.deleteShopProductsList);
app.get("/ShopProducts", shopProductListController.getShopProductsList);

app.get("/ShopProducts/namelist", shopProductListController.getNamedShopProductsList);


// ShopProducts APIS

export default app;
