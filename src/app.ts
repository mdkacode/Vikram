import { infoLog } from "./util/loggerInfo";
import crypto from "crypto";
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
import * as homeController from "./controllers/home";
import * as userController from "./controllers/user";
import * as categoryController from "./controllers/category";
import * as apiController from "./controllers/api";
import * as contactController from "./controllers/contact";


// API keys and Passport configuration
import * as passportConfig from "./config/passport";
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

app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "pug");
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


app.post("/productImage", async (req, res, next) => {
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
        upload.any()(req, res, function (err) {
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



app.post("/category/add", categoryController.addCategory);
app.post("/category/update", categoryController.updateCategory);
app.post("/category/delete", categoryController.deleteCategory);
app.get("/category", categoryController.getCategory);


//category Routes Here START

app.get("/uploadProduct", userController.uploadProduct);
app.delete("/deleteProduct", userController.deleteProduct);
app.get("/listProduct", userController.listProduct);
app.post("/updateProduct", userController.updateProduct);


app.get("/", homeController.index);
app.get("/login", userController.getLogin);
app.get("/sendMessage", userController.sendMessageApi);
app.post("/checkMessage", userController.otpCheck);
app.post("/login", userController.postLogin);
app.get("/logout", userController.logout);
app.get("/forgot", userController.getForgot);
app.post("/forgot", userController.postForgot);
app.get("/reset/:token", userController.getReset);
app.post("/reset/:token", userController.postReset);
app.get("/signup", userController.getSignup);
app.post("/signup", userController.postSignup);
app.get("/contact", contactController.getContact);
app.post("/contact", contactController.postContact);
app.get("/account", passportConfig.isAuthenticated, userController.getAccount);
app.post("/account/profile", passportConfig.isAuthenticated, userController.postUpdateProfile);
app.post("/account/password", passportConfig.isAuthenticated, userController.postUpdatePassword);
app.post("/account/delete", passportConfig.isAuthenticated, userController.postDeleteAccount);
app.get("/account/unlink/:provider", passportConfig.isAuthenticated, userController.getOauthUnlink);

/**
 * API examples routes.
 */
app.get("/api", apiController.getApi);
app.get("/api/facebook", passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getFacebook);

/**
 * OAuth authentication routes. (Sign in)
 */
app.get("/auth/facebook", passport.authenticate("facebook", { scope: ["email", "public_profile"] }));
app.get("/auth/facebook/callback", passport.authenticate("facebook", { failureRedirect: "/login" }), (req, res) => {
    res.redirect(req.session.returnTo || "/");
});

export default app;
