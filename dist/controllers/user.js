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
const Product_1 = require("./../models/Product");
const async_1 = __importDefault(require("async"));
const crypto_1 = __importDefault(require("crypto"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const passport_1 = __importDefault(require("passport"));
const User_1 = require("../models/User");
const Message_1 = require("../models/Message");
const fs_1 = __importDefault(require("fs"));
const express_validator_1 = require("express-validator");
const message_1 = __importDefault(require("../util/message"));
require("../config/passport");
/**
 * GET /login
 * Login page.
 */
exports.getLogin = (req, res) => {
	if (req.user) {
		return res.redirect("/");
	}
	res.render("account/login", {
		title: "Login",
	});
};
exports.uploadProduct = (req, res, next) =>
	__awaiter(void 0, void 0, void 0, function* () {
		const {
			id,
			productName,
			quantity,
			mPrice,
			sPrice,
			imagePath,
			category,
			sku,
		} = req.query;
		const product = new Product_1.Product({
			id,
			productName,
			quantity,
			mPrice,
			sPrice,
			imagePath,
			category,
			sku,
		});
		product.save((err, doc) => {
			if (err) return res.status(500).jsonp({ error: err });
			else {
				res.status(200).json({
					message: "Data recived Successfully",
					document: doc,
				});
			}
		});
	});
exports.listProduct = (req, res, next) => {
	// const UPLOAD_PATH = "/Users/anrag/Documents/saumi/TypeScript-Node-Starter/imagesPublic/";
	const UPLOAD_PATH = " /home/anragkush/anil-backend/imagesPublic";
	Product_1.Product.find((err, value) => {
		for (const t in value) {
			fs_1.default
				.readdirSync(UPLOAD_PATH + value[t].imagePath)
				.forEach((file) => {
					value[t].imagePath = `http://192.168.0.101:3000/static/${
						value[t].imagePath + "/" + file
					}`;
				});
		}
		if (err) console.log(err);
		else return res.status(200).json(value);
	});
};
exports.deleteProduct = (req, res, next) =>
	__awaiter(void 0, void 0, void 0, function* () {
		const deletedRecord = yield Product_1.Product.deleteOne({
			id: req.query.id,
		});
		if (deletedRecord) return res.status(200).jsonp({ item: deletedRecord });
		else {
			return res.status(500).jsonp({ message: "Something went Wrong" });
		}
	});
exports.updateProduct = (req, res, next) =>
	__awaiter(void 0, void 0, void 0, function* () {
		const query = { id: req.query.id };
		const {
			_id,
			id,
			productName,
			quantity,
			mPrice,
			sPrice,
			imagePath,
			category,
			sku,
		} = req.query;
		const product = new Product_1.Product({
			id,
			productName,
			quantity,
			mPrice,
			sPrice,
			imagePath,
			category,
			sku,
		});
		const filter = { id };
		const updateValue = {
			productName,
			quantity,
			mPrice,
			sPrice,
			imagePath,
			category,
			sku,
		};
		const doc = yield Product_1.Product.findOneAndUpdate(filter, updateValue, {
			useFindAndModify: false,
		});
		res.jsonp(doc);
	});
exports.otpCheck = (req, res, next) =>
	__awaiter(void 0, void 0, void 0, function* () {
		yield express_validator_1
			.check("phoneNumber", "PhoneLenght is 10")
			.isLength({ min: 10, max: 10 })
			.run(req);
		// await check("phoneNumber", "PhoneLenght is 10").isNumeric().run(req);
		yield express_validator_1
			.check("code", "Password cannot be blank")
			.isLength({ min: 4, max: 4 })
			.run(req);
		// await check("code", "Password cannot be blank").isNumeric().run(req);
		console.log(req.body);
		req.setEncoding("hello");
	});
exports.sendMessageApi = (req, res, next) => {
	const num = Math.floor(1000 + Math.random() * 9000);
	const message = new Message_1.Message({
		phoneNumber: req.body.phoneNumber,
		code: num,
		status: false,
	});
	Message_1.Message.findOne(
		{ phoneNumber: req.body.phoneNumber },
		(err, existingUser) => {
			if (err) {
				return next(err);
			}
			if (existingUser) {
				req.flash("errors", {
					msg: "Account with that phoneNumber address already exists.",
				});
				return res.status(409).json({ Message: "Account Already Exists !!" });
			}
			message.save((err) => {
				if (err) {
					return next(err);
				}
				req.logIn(message, (err) => {
					if (err) {
						return next(err);
					}
					message_1.default({ code: num, userNumber: req.body.phoneNumber });
					res.status(200).json({ Message: "Account Created Succesfully !!" });
				});
			});
		},
	);
};
/**
 * POST /login
 * Sign in using email and password.
 */
exports.postLogin = (req, res, next) =>
	__awaiter(void 0, void 0, void 0, function* () {
		yield express_validator_1
			.check("phoneNumber", "phoneNumber is not valid")
			.isString()
			.run(req);
		yield express_validator_1
			.check("password", "Password cannot be blank")
			.isString()
			.run(req);
		// eslint-disable-next-line @typescript-eslint/camelcase
		// await sanitize("phoneNumber").normalizeEmail({ gmail_remove_dots: false }).run(req);
		console.log(req.body);
		const errors = express_validator_1.validationResult(req);
		if (!errors.isEmpty()) {
			console.log(errors.array());
			req.flash("errors", errors.array());
			return res.redirect("/login");
		}
		passport_1.default.authenticate("local", (err, user, info) => {
			if (err) {
				return next(err);
			}
			if (!user) {
				console.log("ERROR", user);
				// res.send(errors.array());
				// req.flash("errors", {msg: info.message});
				return res.status(401).json({ Message: "Invalid Used" });
			}
			req.logIn(user, (err) => {
				if (err) {
					return next(err);
				}
				res.status(200).json({ Message: "Login Successfully !!" });
				// req.flash("success", { msg: "Success! You are logged in." });
				// res.redirect(req.session.returnTo || "/");
			});
		})(req, res, next);
	});
/**
 * GET /logout
 * Log out.
 */
exports.logout = (req, res) => {
	req.logout();
	res.redirect("/");
};
/**
 * GET /signup
 * Signup page.
 */
exports.getSignup = (req, res) => {
	if (req.user) {
		return res.redirect("/");
	}
	res.render("account/signup", {
		title: "Create Account",
	});
};
/**
 * POST /signup
 * Create a new local account.
 */
exports.postSignup = (req, res, next) =>
	__awaiter(void 0, void 0, void 0, function* () {
		yield express_validator_1
			.check("phoneNumber", "phoneNumber is not valid")
			.isMobilePhone("any")
			.run(req);
		yield express_validator_1
			.check("password", "Password must be at least 4 characters long")
			.isLength({ min: 4, max: 4 })
			.run(req);
		// await check("confirmPassword", "Passwords do not match").equals(req.body.password).run(req);
		// eslint-disable-next-line @typescript-eslint/camelcase
		// await sanitize("phoneNumber").normalizeEmail({ gmail_remove_dots: false }).run(req);
		console.log(req.body);
		const errors = express_validator_1.validationResult(req);
		if (!errors.isEmpty()) {
			console.log(errors.array());
			return res.status(400).json({ Message: "Something Went Wrong" });
		}
		const user = new User_1.User({
			phoneNumber: req.body.phoneNumber,
			password: req.body.password,
		});
		User_1.User.findOne(
			{ phoneNumber: req.body.phoneNumber },
			(err, existingUser) => {
				if (err) {
					return next(err);
				}
				if (existingUser) {
					req.flash("errors", {
						msg: "Account with that phoneNumber address already exists.",
					});
					return res.status(409).json({ Message: "Account Already Exists !!" });
				}
				user.save((err) => {
					if (err) {
						return next(err);
					}
					req.logIn(user, (err) => {
						if (err) {
							return next(err);
						}
						res.status(400).json({ Message: "Account Created Succesfully !!" });
					});
				});
			},
		);
	});
/**
 * GET /account
 * Profile page.
 */
exports.getAccount = (req, res) => {
	res.render("account/profile", {
		title: "Account Management",
	});
};
/**
 * POST /account/profile
 * Update profile information.
 */
exports.postUpdateProfile = (req, res, next) =>
	__awaiter(void 0, void 0, void 0, function* () {
		yield express_validator_1
			.check("phoneNumber", "Please enter a valid phoneNumber address.")
			.isMobilePhone("en-IN")
			.run(req);
		// eslint-disable-next-line @typescript-eslint/camelcase
		// await sanitize("email").normalizeEmail({ gmail_remove_dots: false }).run(req);
		const errors = express_validator_1.validationResult(req);
		if (!errors.isEmpty()) {
			req.flash("errors", errors.array());
			return res.redirect("/account");
		}
		const user = req.user;
		User_1.User.findById(user.id, (err, user) => {
			if (err) {
				return next(err);
			}
			user.phoneNumber = req.body.phoneNumber || "";
			user.profile.name = req.body.name || "";
			user.profile.gender = req.body.gender || "";
			user.profile.mobileNumber = req.body.mobileNumber || "";
			user.profile.website = req.body.website || "";
			user.save((err) => {
				if (err) {
					if (err.code === 11000) {
						req.flash("errors", {
							msg:
								"The phoneNumber you have entered is already associated with an account.",
						});
						return res.redirect("/account");
					}
					return next(err);
				}
				req.flash("success", { msg: "Profile information has been updated." });
				res.redirect("/account");
			});
		});
	});
/**
 * POST /account/password
 * Update current password.
 */
exports.postUpdatePassword = (req, res, next) =>
	__awaiter(void 0, void 0, void 0, function* () {
		yield express_validator_1
			.check("password", "Password must be at least 4 characters long")
			.isLength({ min: 4 })
			.run(req);
		yield express_validator_1
			.check("confirmPassword", "Passwords do not match")
			.equals(req.body.password)
			.run(req);
		const errors = express_validator_1.validationResult(req);
		if (!errors.isEmpty()) {
			req.flash("errors", errors.array());
			return res.redirect("/account");
		}
		const user = req.user;
		User_1.User.findById(user.id, (err, user) => {
			if (err) {
				return next(err);
			}
			user.password = req.body.password;
			user.save((err) => {
				if (err) {
					return next(err);
				}
				req.flash("success", { msg: "Password has been changed." });
				res.redirect("/account");
			});
		});
	});
/**
 * POST /account/delete
 * Delete user account.
 */
exports.postDeleteAccount = (req, res, next) => {
	const user = req.user;
	User_1.User.remove({ _id: user.id }, (err) => {
		if (err) {
			return next(err);
		}
		req.logout();
		req.flash("info", { msg: "Your account has been deleted." });
		res.redirect("/");
	});
};
/**
 * GET /account/unlink/:provider
 * Unlink OAuth provider.
 */
exports.getOauthUnlink = (req, res, next) => {
	const provider = req.params.provider;
	const user = req.user;
	User_1.User.findById(user.id, (err, user) => {
		if (err) {
			return next(err);
		}
		user[provider] = undefined;
		user.tokens = user.tokens.filter((token) => token.kind !== provider);
		user.save((err) => {
			if (err) {
				return next(err);
			}
			req.flash("info", { msg: `${provider} account has been unlinked.` });
			res.redirect("/account");
		});
	});
};
/**
 * GET /reset/:token
 * Reset Password page.
 */
exports.getReset = (req, res, next) => {
	if (req.isAuthenticated()) {
		return res.redirect("/");
	}
	User_1.User.findOne({ passwordResetToken: req.params.token })
		.where("passwordResetExpires")
		.gt(Date.now())
		.exec((err, user) => {
			if (err) {
				return next(err);
			}
			if (!user) {
				req.flash("errors", {
					msg: "Password reset token is invalid or has expired.",
				});
				return res.redirect("/forgot");
			}
			res.render("account/reset", {
				title: "Password Reset",
			});
		});
};
/**
 * POST /reset/:token
 * Process the reset password request.
 */
exports.postReset = (req, res, next) =>
	__awaiter(void 0, void 0, void 0, function* () {
		yield express_validator_1
			.check("password", "Password must be at least 4 characters long.")
			.isLength({ min: 4 })
			.run(req);
		yield express_validator_1
			.check("confirm", "Passwords must match.")
			.equals(req.body.password)
			.run(req);
		const errors = express_validator_1.validationResult(req);
		if (!errors.isEmpty()) {
			req.flash("errors", errors.array());
			return res.redirect("back");
		}
		async_1.default.waterfall(
			[
				function resetPassword(done) {
					User_1.User.findOne({ passwordResetToken: req.params.token })
						.where("passwordResetExpires")
						.gt(Date.now())
						.exec((err, user) => {
							if (err) {
								return next(err);
							}
							if (!user) {
								req.flash("errors", {
									msg: "Password reset token is invalid or has expired.",
								});
								return res.redirect("back");
							}
							user.password = req.body.password;
							user.passwordResetToken = undefined;
							user.passwordResetExpires = undefined;
							user.save((err) => {
								if (err) {
									return next(err);
								}
								req.logIn(user, (err) => {
									done(err, user);
								});
							});
						});
				},
				function sendResetPasswordEmail(user, done) {
					const transporter = nodemailer_1.default.createTransport({
						service: "SendGrid",
						auth: {
							user: process.env.SENDGRID_USER,
							pass: process.env.SENDGRID_PASSWORD,
						},
					});
					const mailOptions = {
						to: user.phoneNumber,
						from: "express-ts@starter.com",
						subject: "Your password has been changed",
						text: `Hello,\n\nThis is a confirmation that the password for your account ${user.phoneNumber} has just been changed.\n`,
					};
					transporter.sendMail(mailOptions, (err) => {
						req.flash("success", {
							msg: "Success! Your password has been changed.",
						});
						done(err);
					});
				},
			],
			(err) => {
				if (err) {
					return next(err);
				}
				res.redirect("/");
			},
		);
	});
/**
 * GET /forgot
 * Forgot Password page.
 */
exports.getForgot = (req, res) => {
	if (req.isAuthenticated()) {
		return res.redirect("/");
	}
	res.render("account/forgot", {
		title: "Forgot Password",
	});
};
/**
 * POST /forgot
 * Create a random token, then the send user an email with a reset link.
 */
exports.postForgot = (req, res, next) =>
	__awaiter(void 0, void 0, void 0, function* () {
		yield express_validator_1
			.check("phoneNumber", "Please enter a valid email address.")
			.isEmail()
			.run(req);
		// eslint-disable-next-line @typescript-eslint/camelcase
		// await sanitize("email").normalizeEmail({ gmail_remove_dots: false }).run(req);
		const errors = express_validator_1.validationResult(req);
		if (!errors.isEmpty()) {
			req.flash("errors", errors.array());
			return res.redirect("/forgot");
		}
		async_1.default.waterfall(
			[
				function createRandomToken(done) {
					crypto_1.default.randomBytes(16, (err, buf) => {
						const token = buf.toString("hex");
						done(err, token);
					});
				},
				function setRandomToken(token, done) {
					User_1.User.findOne(
						{ phoneNumber: req.body.phoneNumber },
						(err, user) => {
							if (err) {
								return done(err);
							}
							if (!user) {
								req.flash("errors", {
									msg: "Account with that phoneNumber address does not exist.",
								});
								return res.redirect("/forgot");
							}
							user.passwordResetToken = token;
							user.passwordResetExpires = Date.now() + 3600000; // 1 hour
							user.save((err) => {
								done(err, token, user);
							});
						},
					);
				},
				function sendForgotPasswordEmail(token, user, done) {
					const transporter = nodemailer_1.default.createTransport({
						service: "SendGrid",
						auth: {
							user: process.env.SENDGRID_USER,
							pass: process.env.SENDGRID_PASSWORD,
						},
					});
					const mailOptions = {
						to: user.phoneNumber,
						from: "hackathon@starter.com",
						subject: "Reset your password on Hackathon Starter",
						text: `You are receiving this phoneNumber because you (or someone else) have requested the reset of the password for your account.\n\n
          Please click on the following link, or paste this into your browser to complete the process:\n\n
          http://${req.headers.host}/reset/${token}\n\n
          If you did not request this, please ignore this email and your password will remain unchanged.\n`,
					};
					transporter.sendMail(mailOptions, (err) => {
						req.flash("info", {
							msg: `An e-mail has been sent to ${user.phoneNumber} with further instructions.`,
						});
						done(err);
					});
				},
			],
			(err) => {
				if (err) {
					return next(err);
				}
				res.redirect("/forgot");
			},
		);
	});
//# sourceMappingURL=user.js.map
