import { infoLog } from "./util/loggerInfo";

import express from "express";
import compression from "compression";  // compresses requests
import session from "express-session";
import bodyParser from "body-parser";
import multer from "multer";
import cloudinary from "cloudinary";
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



// const token = '1175820596:AAFVkht4TXOiQOE0aiRbII4iU4DmnYYBjBM';

// const bot = new TelegramBot(token, { polling: true });

// //telegram connect Start
// bot.onText(/\/echo (.+)/, (msg, match) => {
//     // 'msg' is the received Message from Telegram
//     // 'match' is the result of executing the regexp above on the text content
//     // of the message

//     const chatId = msg.chat.id;
//     const resp = match[1]; // the captured "whatever"

//     // send back the matched "whatever" to the chat
//     bot.sendMessage(chatId, resp);
// });

// // Listen for any kind of message. There are different kinds of
// // messages.
// bot.on('message', (msg) => {
//     const chatId = msg.chat.id;

//     // send a message to the chat acknowledging receipt of their message
//     console.log("GET CHAT id", chatId)
//     bot.sendMessage(chatId, 'Received your messagesss');
// });
// // telegram end



const MongoStore = mongo(session);

// Controllers (route handlers)
import * as categoryController from "./controllers/category";
import * as productController from "./controllers/product";
import * as shopKeeperController from "./controllers/shopKeeper";
import * as userServiceController from "./controllers/userServiceController";
import * as shopProductListController from "./controllers/shopProductList";
import * as userAddedCartController from "./controllers/userAddedCartController";

import * as geoController from "./controllers/geoController";
// API keys and Passport configuration
import downloadImage from "./util/imageDownload";

// Create Express server
const app = express();
const imageCdn = cloudinary.v2;
imageCdn.config({
    cloud_name: "vikrant-prod",
    api_key: "286381342612435",
    api_secret: "m-ug_mc6cHb8pXzthCIh92I5tbc"
});

const imageuploadUrl = "cloudinary://286381342612435:m-ug_mc6cHb8pXzthCIh92I5tbc@vikrant-prod";
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
app.set("port", process.env.PORT || 3001);
app.use(express.static(__dirname + UPLOAD_PATH));
app.use("/api/static", express.static(UPLOAD_PATH));

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


app.post("/api/productImage", async (req, res) => {
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
app.post("/api/category/add", categoryController.addCategory);
app.post("/api/category/update", categoryController.updateCategory);
app.post("/api/category/delete", categoryController.deleteCategory);
app.get("/api/category", categoryController.getCategory);
//Category APIs


//USER CART API 

app.post("/api/usercart/add", userAddedCartController.addUserAddedCart);
app.put("/api/usercart/update", userAddedCartController.updateUserAddedCart);
app.get("/api/usercart/find", userAddedCartController.findUserAddedCart);

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
app.get("/api/shopkeeper/bygeo", shopProductListController.nearByShops);
// Product APIS

// ShopProducts APIS
app.post("/api/ShopProducts/add", shopProductListController.addShopProductsList);
app.post("/api/ShopProducts/update", shopProductListController.updateShopProductsList);
app.post("/api/ShopProducts/delete", shopProductListController.deleteShopProductsList);
app.get("/api/ShopProducts", shopProductListController.getShopProductsList);
app.get("/api/ShopProducts/namelist", shopProductListController.getNamedShopProductsList);
app.get("/api/ShopProducts/allProducts", shopProductListController.allProducts);

// ShopProducts APIS

// USER ACCOUNT API START
app.post("/api/user/add", userServiceController.adduserService);
app.post("/api/user/update", userServiceController.updateuserService);
app.post("/api/user/delete", userServiceController.deleteuserService);
app.get("/api/user", userServiceController.getuserService);
app.get("/api/user/one", userServiceController.userInfoService);
app.post("/api/user/validate", userServiceController.validateuserService);
// USER ACCOUNT API END

// LOCATION API
app.get("/api/area", geoController.areaSuggestion);
app.get("/api/reverseGeoCode", geoController.reverseGeoCode);
app.get("/api/geoCode", geoController.geoCode);

export default app;
