const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const User = require("../models/User");
const AppError = require("../utils/AppError");
const {
	generateAccessToken,
	generateRefreshToken,
	hashToken,
} = require("../utils/tokenUtils");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/email");

const signup = async (req, res, next) => {
	try {
		const {
			firstName,
			secondName,
			thirdName,
			fourthName,
			email,
			phone,
			password,
			role,
			gender,
			governorate,
			dateOfBirth,
			isStudent,
			college,
			year,
			occupation,
			alternativePhone,
		} = req.body;

		if (!email && !phone) {
			throw new AppError("Email or phone number is required", 400);
		}

		if (email) {
			const existingEmail = await User.findOne({ email: email.toLowerCase() });
			if (existingEmail) {
				throw new AppError("This email is already registered", 409);
			}
		}

		if (phone) {
			const existingPhone = await User.findOne({ phone });
			if (existingPhone) {
				throw new AppError("This phone number is already registered", 409);
			}
		}

		const hashedPassword = await bcrypt.hash(password, 12);

		const verificationCode = Math.floor(
			100000 + Math.random() * 900000,
		).toString();
		console.log("verificationCode : ", verificationCode);
		const verificationCodeExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

		let normalizedRole = role || "user";
		if (normalizedRole === "student") {
			normalizedRole = "user";
		}

		const user = await User.create({
			firstName,
			secondName,
			thirdName: thirdName || undefined,
			fourthName: fourthName || undefined,
			email: email ? email.toLowerCase() : undefined,
			phone,
			password: hashedPassword,
			role: normalizedRole,
			gender,
			governorate,
			dateOfBirth,
			isStudent:
				normalizedRole === "user"
					? isStudent !== "false" && isStudent !== false
					: undefined,
			college:
				normalizedRole === "user" &&
				isStudent !== "false" &&
				isStudent !== false
					? college
					: undefined,
			year:
				normalizedRole === "user" &&
				isStudent !== "false" &&
				isStudent !== false
					? year
					: undefined,
			occupation:
				normalizedRole === "user" &&
				(isStudent === "false" || isStudent === false)
					? occupation
					: undefined,
			alternativePhone:
				normalizedRole === "owner" ? alternativePhone : undefined,
			verificationCode,
			verificationCodeExpires,
		});

		const target = email || phone;
		const isEmail = target.includes("@");

		if (isEmail) {
			await sendEmail({
				to: target,
				subject: "LivingHub - Verify Your Account",
				message: `Welcome to LivingHub, ${user.fullName}!\n\Your verification code is: ${verificationCode}\nThis code will expire in 15 minutes.`,
			});
		} else {
			if (process.env.NODE_ENV === "production") {
				// SMS Gateway not implemented in MVP, so we explicitly fail instead of silently succeeding
				throw new AppError(
					"SMS service is not configured in production. Please use an email address to sign up.",
					501,
				);
			} else {
				console.log(
					`\n[DEV MODE - SMS SIMULATION]\nTo: ${target}\nMessage: Your verification code is: ${verificationCode}\n`,
				);
			}
		}

		res.status(201).json({
			message: "Account created. Please verify with the OTP sent to you.",
			userId: user._id,
		});
	} catch (error) {
		next(error);
	}
};

const verifyAccount = async (req, res, next) => {
	try {
		const { email, code } = req.body;

		const user = await User.findOne({ email: email.toLowerCase() });

		if (!user) {
			throw new AppError("User not found", 404);
		}

		if (user.accountStatus !== "pending_verification") {
			throw new AppError("Account is already verified", 400);
		}

		if (user.verificationCode !== code) {
			throw new AppError("Invalid verification code", 400);
		}

		if (user.verificationCodeExpires < new Date()) {
			throw new AppError(
				"Verification code has expired. Please request a new one.",
				400,
			);
		}

		user.accountStatus = "active";
		user.verificationCode = undefined;
		user.verificationCodeExpires = undefined;
		await user.save();

		res.json({ message: "Account verified successfully. You can now log in." });
	} catch (error) {
		next(error);
	}
};

const login = async (req, res, next) => {
	try {
		const { email, password } = req.body;

		const user = await User.findOne({ email: email.toLowerCase() });

		if (!user) {
			throw new AppError("Invalid email or password", 401);
		}

		if (user.accountStatus === "pending_verification") {
			throw new AppError("Please verify your account before logging in", 403);
		}
		if (user.accountStatus === "banned") {
			throw new AppError(
				"Your account has been banned. Contact support for assistance.",
				403,
			);
		}
		if (user.accountStatus === "rejected") {
			throw new AppError(
				"Your account has been rejected. Contact support for assistance.",
				403,
			);
		}

		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			throw new AppError("Invalid email or password", 401);
		}

		const accessToken = generateAccessToken(user);
		const refreshToken = generateRefreshToken(user);

		user.refreshTokens.push(hashToken(refreshToken));
		await user.save();

		res.cookie("refreshToken", refreshToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
			maxAge: 7 * 24 * 60 * 60 * 1000,
		});

		res.json({
			accessToken,
			user: {
				_id: user._id,
				fullName: user.fullName,
				firstName: user.firstName,
				secondName: user.secondName,
				thirdName: user.thirdName,
				fourthName: user.fourthName,
				email: user.email,
				phone: user.phone,
				role: user.role === "user" ? "student" : user.role,
				gender: user.gender,
				governorate: user.governorate,
				dateOfBirth: user.dateOfBirth,
				isStudent: user.isStudent,
				college: user.college,
				year: user.year,
				occupation: user.occupation,
				alternativePhone: user.alternativePhone,
				profileImage: user.profileImage,
			},
		});
	} catch (error) {
		next(error);
	}
};

const refreshAccessToken = async (req, res, next) => {
	try {
		const token = req.cookies.refreshToken;
		if (!token) {
			throw new AppError("Refresh token not found. Please log in again.", 401);
		}

		let decoded;
		try {
			decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
		} catch {
			throw new AppError(
				"Invalid or expired refresh token. Please log in again.",
				401,
			);
		}

		const user = await User.findById(decoded.userId);
		if (!user) {
			throw new AppError("User not found", 401);
		}

		const hashedToken = hashToken(token);
		const tokenIndex = user.refreshTokens.indexOf(hashedToken);
		if (tokenIndex === -1) {
			throw new AppError(
				"Refresh token is no longer valid. Please log in again.",
				401,
			);
		}

		// Rotate: remove old, issue new
		user.refreshTokens.splice(tokenIndex, 1);

		const newAccessToken = generateAccessToken(user);
		const newRefreshToken = generateRefreshToken(user);
		user.refreshTokens.push(hashToken(newRefreshToken));
		await user.save();

		res.cookie("refreshToken", newRefreshToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
			maxAge: 7 * 24 * 60 * 60 * 1000,
		});

		res.json({ accessToken: newAccessToken });
	} catch (error) {
		next(error);
	}
};

const logout = async (req, res, next) => {
	try {
		const token = req.cookies.refreshToken;
		if (token) {
			const user = await User.findById(req.user._id);
			if (user) {
				user.refreshTokens = user.refreshTokens.filter(
					(t) => t !== hashToken(token),
				);
				await user.save();
			}
		}

		res.clearCookie("refreshToken");
		res.json({ message: "Logged out successfully" });
	} catch (error) {
		next(error);
	}
};

const forgotPassword = async (req, res, next) => {
	try {
		const { identifier } = req.body;

		const user = await User.findOne({
			$or: [{ email: identifier.toLowerCase() }, { phone: identifier }],
		});

		// Always return success to prevent email enumeration
		if (!user) {
			return res.json({
				message:
					"If an account exists with this email/phone, a reset link has been sent.",
			});
		}

		const resetToken = crypto.randomBytes(32).toString("hex");
		user.resetPasswordToken = hashToken(resetToken);
		user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000);
		await user.save();

		const isEmail = identifier.includes("@");

		if (isEmail) {
			await sendEmail({
				to: user.email,
				subject: "LivingHub - Password Reset",
				message: `You requested a password reset.\nYour reset token is: ${resetToken}\nThis token will expire in 15 minutes.`,
			});
		} else {
			if (process.env.NODE_ENV === "production") {
				throw new AppError("SMS service is not configured in production.", 501);
			} else {
				console.log(
					`\n[DEV MODE - SMS SIMULATION]\nTo: ${identifier}\nMessage: Your password reset token is: ${resetToken}\n`,
				);
			}
		}

		res.json({
			message:
				"If an account exists with this email/phone, a reset link has been sent.",
		});
	} catch (error) {
		next(error);
	}
};

const resetPassword = async (req, res, next) => {
	try {
		const { token, newPassword } = req.body;

		const hashedToken = hashToken(token);
		const user = await User.findOne({
			resetPasswordToken: hashedToken,
			resetPasswordExpires: { $gt: new Date() },
		});

		if (!user) {
			throw new AppError("Invalid or expired reset token", 400);
		}

		user.password = await bcrypt.hash(newPassword, 12);
		user.resetPasswordToken = undefined;
		user.resetPasswordExpires = undefined;
		user.refreshTokens = [];
		await user.save();

		res.json({
			message:
				"Password reset successful. Please log in with your new password.",
		});
	} catch (error) {
		next(error);
	}
};

const resendOTP = async (req, res, next) => {
	try {
		const { email } = req.body;

		const user = await User.findOne({ email: email.toLowerCase() });

		if (!user) {
			throw new AppError("User not found", 404);
		}

		if (user.accountStatus !== "pending_verification") {
			throw new AppError("Account is already verified", 400);
		}

		const verificationCode = Math.floor(
			100000 + Math.random() * 900000,
		).toString();
		user.verificationCode = verificationCode;
		user.verificationCodeExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
		await user.save();

		await sendEmail({
			to: user.email,
			subject: "LivingHub - New Verification Code",
			message: `Your new verification code is: ${verificationCode}\nThis code will expire in 15 minutes.`,
		});

		res.json({ message: "A new verification code has been sent." });
	} catch (error) {
		next(error);
	}
};

module.exports = {
	signup,
	verifyAccount,
	login,
	refreshAccessToken,
	logout,
	forgotPassword,
	resetPassword,
	resendOTP,
};
