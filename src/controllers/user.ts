import { ProductProps, Product } from "./../models/Product";
import async from "async";
import crypto from "crypto";
import nodemailer from "nodemailer";
import passport from "passport";
import { User, UserDocument, AuthToken } from "../models/User";
import { MessageProps, Message } from "../models/Message";
import { Request, Response, NextFunction } from "express";
import { IVerifyOptions } from "passport-local";
import { WriteError } from "mongodb";
import fs from "fs";
import { check, sanitize, validationResult } from "express-validator";
import sendMessage from "../util/message";
import "../config/passport";

/**
 * GET /login
 * Login page.
 */
export const getLogin = (req: Request, res: Response) => {
    if (req.user) {
        return res.redirect("/");
    }
    res.render("account/login", {
        title: "Login"
    });
};





export const uploadProduct = async (req: Request, res: Response, next: NextFunction) => {
    const { id, productName, quantity, mPrice, sPrice, imagePath, category, sku } = req.query;

    const product = new Product({
        id,
        productName,
        quantity,
        mPrice,
        sPrice,
        imagePath,
        category,
        sku

    });
    product.save((err, doc) => {
        if (err) return res.status(500).jsonp({ error: err });
        else {
            res.status(200).json({
                message: "Data recived Successfully",
                document: doc
            });
        }
    });
};

export const listProduct = (req: Request, res: Response, next: NextFunction) => {
    // const UPLOAD_PATH = "/Users/anrag/Documents/saumi/TypeScript-Node-Starter/imagesPublic/";
    const UPLOAD_PATH = " /home/anragkush/anil-backend/imagesPublic/";

    Product.find((err: any, value: any) => {
        for (const t in value) {
            fs.readdirSync(UPLOAD_PATH + value[t].imagePath).forEach(file => {
                value[t].imagePath = `http://52.186.14.151/static/${value[t].imagePath + "/" + file}`;
            });
        }
        if (err) console.log(err);
        else return res.status(200).json(value);
    });
};

export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {

    const deletedRecord = await Product.deleteOne({ id: req.query.id });
    if (deletedRecord) return res.status(200).jsonp({ item: deletedRecord });
    else {
        return res.status(500).jsonp({ message: "Something went Wrong" });
    }
};

export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
    const query = { "id": req.query.id };
    const { _id, id, productName, quantity, mPrice, sPrice, imagePath, category, sku } = req.query;
    const product = new Product({
        id,
        productName,
        quantity,
        mPrice,
        sPrice,
        imagePath,
        category,
        sku

    });
    const filter = { id };
    const updateValue = { productName, quantity, mPrice, sPrice, imagePath, category, sku };

    const doc = await Product.findOneAndUpdate(filter, updateValue, { useFindAndModify: false });

    res.jsonp(doc);

};



export const otpCheck = async (req: Request, res: Response, next: NextFunction) => {
    await check("phoneNumber", "PhoneLenght is 10").isLength({ min: 10, max: 10 }).run(req);
    // await check("phoneNumber", "PhoneLenght is 10").isNumeric().run(req);
    await check("code", "Password cannot be blank").isLength({ min: 4, max: 4 }).run(req);
    // await check("code", "Password cannot be blank").isNumeric().run(req);

    console.log(req.body);
    req.setEncoding("hello");


};
export const sendMessageApi = (req: Request, res: Response, next: NextFunction) => {
    const num = Math.floor(1000 + Math.random() * 9000);

    const message = new Message({
        phoneNumber: req.body.phoneNumber,
        code: num,
        status: false
    });
    Message.findOne({ phoneNumber: req.body.phoneNumber }, (err, existingUser) => {
        if (err) { return next(err); }
        if (existingUser) {
            req.flash("errors", { msg: "Account with that phoneNumber address already exists." });
            return res.status(409).json({ Message: "Account Already Exists !!" });;
        }
        message.save((err) => {
            if (err) { return next(err); }
            req.logIn(message, (err) => {
                if (err) {
                    return next(err);
                }
                sendMessage({ code: num, userNumber: req.body.phoneNumber });
                res.status(200).json({ Message: "Account Created Succesfully !!" });;
            });
        });
    });


};

/**
 * POST /login
 * Sign in using email and password.
 */
export const postLogin = async (req: Request, res: Response, next: NextFunction) => {
    await check("phoneNumber", "phoneNumber is not valid").isString().run(req);
    await check("password", "Password cannot be blank").isString().run(req);
    // eslint-disable-next-line @typescript-eslint/camelcase
    // await sanitize("phoneNumber").normalizeEmail({ gmail_remove_dots: false }).run(req);
    console.log(req.body);
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.log(errors.array());
        req.flash("errors", errors.array());
        return res.redirect("/login");
    }

    passport.authenticate("local", (err: Error, user: UserDocument, info: IVerifyOptions) => {
        if (err) { return next(err); }
        if (!user) {
            console.log("ERROR", user);
            // res.send(errors.array());
            // req.flash("errors", {msg: info.message});
            return res.status(401).json({ Message: "Invalid Used" });
        }
        req.logIn(user, (err) => {
            if (err) { return next(err); }
            res.status(200).json({ Message: "Login Successfully !!" });
            // req.flash("success", { msg: "Success! You are logged in." });
            // res.redirect(req.session.returnTo || "/");
        });
    })(req, res, next);
};

/**
 * GET /logout
 * Log out.
 */
export const logout = (req: Request, res: Response) => {
    req.logout();
    res.redirect("/");
};

/**
 * GET /signup
 * Signup page.
 */
export const getSignup = (req: Request, res: Response) => {
    if (req.user) {
        return res.redirect("/");
    }
    res.render("account/signup", {
        title: "Create Account"
    });
};

/**
 * POST /signup
 * Create a new local account.
 */
export const postSignup = async (req: Request, res: Response, next: NextFunction) => {
    await check("phoneNumber", "phoneNumber is not valid").isMobilePhone("any").run(req);
    await check("password", "Password must be at least 4 characters long").isLength({ min: 4, max: 4 }).run(req);
    // await check("confirmPassword", "Passwords do not match").equals(req.body.password).run(req);
    // eslint-disable-next-line @typescript-eslint/camelcase
    // await sanitize("phoneNumber").normalizeEmail({ gmail_remove_dots: false }).run(req);
    console.log(req.body);
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.log(errors.array());
        return res.status(400).json({ Message: "Something Went Wrong" });
    }

    const user = new User({
        phoneNumber: req.body.phoneNumber,
        password: req.body.password
    });

    User.findOne({ phoneNumber: req.body.phoneNumber }, (err, existingUser) => {
        if (err) { return next(err); }
        if (existingUser) {
            req.flash("errors", { msg: "Account with that phoneNumber address already exists." });
            return res.status(409).json({ Message: "Account Already Exists !!" });;
        }
        user.save((err) => {
            if (err) { return next(err); }
            req.logIn(user, (err) => {
                if (err) {
                    return next(err);
                }
                res.status(400).json({ Message: "Account Created Succesfully !!" });;
            });
        });
    });
};

/**
 * GET /account
 * Profile page.
 */
export const getAccount = (req: Request, res: Response) => {
    res.render("account/profile", {
        title: "Account Management"
    });
};

/**
 * POST /account/profile
 * Update profile information.
 */
export const postUpdateProfile = async (req: Request, res: Response, next: NextFunction) => {
    await check("phoneNumber", "Please enter a valid phoneNumber address.").isMobilePhone("en-IN").run(req);
    // eslint-disable-next-line @typescript-eslint/camelcase
    // await sanitize("email").normalizeEmail({ gmail_remove_dots: false }).run(req);

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        req.flash("errors", errors.array());
        return res.redirect("/account");
    }

    const user = req.user as UserDocument;
    User.findById(user.id, (err, user: UserDocument) => {
        if (err) { return next(err); }
        user.phoneNumber = req.body.phoneNumber || "";
        user.profile.name = req.body.name || "";
        user.profile.gender = req.body.gender || "";
        user.profile.mobileNumber = req.body.mobileNumber || "";
        user.profile.website = req.body.website || "";
        user.save((err: WriteError) => {
            if (err) {
                if (err.code === 11000) {
                    req.flash("errors", { msg: "The phoneNumber you have entered is already associated with an account." });
                    return res.redirect("/account");
                }
                return next(err);
            }
            req.flash("success", { msg: "Profile information has been updated." });
            res.redirect("/account");
        });
    });
};

/**
 * POST /account/password
 * Update current password.
 */
export const postUpdatePassword = async (req: Request, res: Response, next: NextFunction) => {
    await check("password", "Password must be at least 4 characters long").isLength({ min: 4 }).run(req);
    await check("confirmPassword", "Passwords do not match").equals(req.body.password).run(req);

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        req.flash("errors", errors.array());
        return res.redirect("/account");
    }

    const user = req.user as UserDocument;
    User.findById(user.id, (err, user: UserDocument) => {
        if (err) { return next(err); }
        user.password = req.body.password;
        user.save((err: WriteError) => {
            if (err) { return next(err); }
            req.flash("success", { msg: "Password has been changed." });
            res.redirect("/account");
        });
    });
};

/**
 * POST /account/delete
 * Delete user account.
 */
export const postDeleteAccount = (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as UserDocument;
    User.remove({ _id: user.id }, (err) => {
        if (err) { return next(err); }
        req.logout();
        req.flash("info", { msg: "Your account has been deleted." });
        res.redirect("/");
    });
};

/**
 * GET /account/unlink/:provider
 * Unlink OAuth provider.
 */
export const getOauthUnlink = (req: Request, res: Response, next: NextFunction) => {
    const provider = req.params.provider;
    const user = req.user as UserDocument;
    User.findById(user.id, (err, user: any) => {
        if (err) { return next(err); }
        user[provider] = undefined;
        user.tokens = user.tokens.filter((token: AuthToken) => token.kind !== provider);
        user.save((err: WriteError) => {
            if (err) { return next(err); }
            req.flash("info", { msg: `${provider} account has been unlinked.` });
            res.redirect("/account");
        });
    });
};

/**
 * GET /reset/:token
 * Reset Password page.
 */
export const getReset = (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) {
        return res.redirect("/");
    }
    User
        .findOne({ passwordResetToken: req.params.token })
        .where("passwordResetExpires").gt(Date.now())
        .exec((err, user) => {
            if (err) { return next(err); }
            if (!user) {
                req.flash("errors", { msg: "Password reset token is invalid or has expired." });
                return res.redirect("/forgot");
            }
            res.render("account/reset", {
                title: "Password Reset"
            });
        });
};

/**
 * POST /reset/:token
 * Process the reset password request.
 */
export const postReset = async (req: Request, res: Response, next: NextFunction) => {
    await check("password", "Password must be at least 4 characters long.").isLength({ min: 4 }).run(req);
    await check("confirm", "Passwords must match.").equals(req.body.password).run(req);

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        req.flash("errors", errors.array());
        return res.redirect("back");
    }

    async.waterfall([
        function resetPassword(done: Function) {
            User
                .findOne({ passwordResetToken: req.params.token })
                .where("passwordResetExpires").gt(Date.now())
                .exec((err, user: any) => {
                    if (err) { return next(err); }
                    if (!user) {
                        req.flash("errors", { msg: "Password reset token is invalid or has expired." });
                        return res.redirect("back");
                    }
                    user.password = req.body.password;
                    user.passwordResetToken = undefined;
                    user.passwordResetExpires = undefined;
                    user.save((err: WriteError) => {
                        if (err) { return next(err); }
                        req.logIn(user, (err) => {
                            done(err, user);
                        });
                    });
                });
        },
        function sendResetPasswordEmail(user: UserDocument, done: Function) {
            const transporter = nodemailer.createTransport({
                service: "SendGrid",
                auth: {
                    user: process.env.SENDGRID_USER,
                    pass: process.env.SENDGRID_PASSWORD
                }
            });
            const mailOptions = {
                to: user.phoneNumber,
                from: "express-ts@starter.com",
                subject: "Your password has been changed",
                text: `Hello,\n\nThis is a confirmation that the password for your account ${user.phoneNumber} has just been changed.\n`
            };
            transporter.sendMail(mailOptions, (err) => {
                req.flash("success", { msg: "Success! Your password has been changed." });
                done(err);
            });
        }
    ], (err) => {
        if (err) { return next(err); }
        res.redirect("/");
    });
};

/**
 * GET /forgot
 * Forgot Password page.
 */
export const getForgot = (req: Request, res: Response) => {
    if (req.isAuthenticated()) {
        return res.redirect("/");
    }
    res.render("account/forgot", {
        title: "Forgot Password"
    });
};

/**
 * POST /forgot
 * Create a random token, then the send user an email with a reset link.
 */
export const postForgot = async (req: Request, res: Response, next: NextFunction) => {
    await check("phoneNumber", "Please enter a valid email address.").isEmail().run(req);
    // eslint-disable-next-line @typescript-eslint/camelcase
    // await sanitize("email").normalizeEmail({ gmail_remove_dots: false }).run(req);

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        req.flash("errors", errors.array());
        return res.redirect("/forgot");
    }

    async.waterfall([
        function createRandomToken(done: Function) {
            crypto.randomBytes(16, (err, buf) => {
                const token = buf.toString("hex");
                done(err, token);
            });
        },
        function setRandomToken(token: AuthToken, done: Function) {
            User.findOne({ phoneNumber: req.body.phoneNumber }, (err, user: any) => {
                if (err) { return done(err); }
                if (!user) {
                    req.flash("errors", { msg: "Account with that phoneNumber address does not exist." });
                    return res.redirect("/forgot");
                }
                user.passwordResetToken = token;
                user.passwordResetExpires = Date.now() + 3600000; // 1 hour
                user.save((err: WriteError) => {
                    done(err, token, user);
                });
            });
        },
        function sendForgotPasswordEmail(token: AuthToken, user: UserDocument, done: Function) {
            const transporter = nodemailer.createTransport({
                service: "SendGrid",
                auth: {
                    user: process.env.SENDGRID_USER,
                    pass: process.env.SENDGRID_PASSWORD
                }
            });
            const mailOptions = {
                to: user.phoneNumber,
                from: "hackathon@starter.com",
                subject: "Reset your password on Hackathon Starter",
                text: `You are receiving this phoneNumber because you (or someone else) have requested the reset of the password for your account.\n\n
          Please click on the following link, or paste this into your browser to complete the process:\n\n
          http://${req.headers.host}/reset/${token}\n\n
          If you did not request this, please ignore this email and your password will remain unchanged.\n`
            };
            transporter.sendMail(mailOptions, (err) => {
                req.flash("info", { msg: `An e-mail has been sent to ${user.phoneNumber} with further instructions.` });
                done(err);
            });
        }
    ], (err) => {
        if (err) { return next(err); }
        res.redirect("/forgot");
    });
};
