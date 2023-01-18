require("dotenv").config();
const UserModel = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");
const sgMail = require("@sendgrid/mail");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");

// const transporter = nodemailer.createTransport(
//     sendgridTransport({
//         auth: {
//             api_key: process.env.EMAIL_API_KEY,
//         },
//     })
// );

const signup = async (req, res) => {
    // console.log("-----------Inside signup-------------");
    const user = await UserModel.create({ ...req.body });
    // transporter.sendMail({
    //     to: user.email,
    //     from: "csi.sagar.thacker+sendgrid@gmail.com",
    //     subject: "Signup Successfull",
    //     html: "<h2>Welcome to InstaClone</h2>",
    // });
    const msg = {
        to: user.email, // Change to your recipient
        from: "csi.sagar.thacker+sendgrid@gmail.com", // Change to your verified sender
        subject: "Signup Successful",
        text: "and easy to do anywhere, even with Node.js",
        html: "<strong>Welcome to InstaClone</strong>",
    };
    sgMail
        .send(msg)
        .then(() => {
            console.log("Email sent");
        })
        .catch((error) => {
            console.error(error);
        });
    res.status(StatusCodes.CREATED).json({ message: "SUCCESS" });
};

const signin = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new BadRequestError("Please provide email and password.");
    }
    const user = await UserModel.findOne({ email });
    if (!user) {
        throw new UnauthenticatedError("Invalid Credentials");
    }
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
        throw new UnauthenticatedError("Invalid Credentials");
    }
    const token = await user.createJWT();

    return res.status(StatusCodes.OK).json({
        token,
        user: {
            name: user.name,
            email: user.email,
            userId: user._id,
            followings: user.followings,
            followers: user.followers,
            photo: user.photo,
        },
        message: "SUCCESS",
    });
};

const resetPassword = async (req, res) => {
    sgMail.setApiKey(process.env.SG_API_KEY);
    crypto.randomBytes(32, async (err, buffer) => {
        if (err) {
            console.log(err);
        }
        const token = buffer.toString("hex");
        const user = await UserModel.findOne({ email: req.body.email });
        if (!user) {
            throw new BadRequestError("Invalid Email");
        }
        user.resetToken = token;
        user.expireToken = Date.now() + 3600000;
        const result = await user.save();
        const msg = {
            to: user.email, // Change to your recipient
            from: "csi.sagar.thacker+sendgrid@gmail.com", // Change to your verified sender
            subject: "Password Reset",
            html: `<p>You requested for password reset</p>
            <h5>Click on this <a href="http://localhost:3000/reset/${token}>link</a> to reset password`,
        };
        await sgMail.send(msg);
        res.status(StatusCodes.OK).json({ message: "Check your email" });
    });
};

const newPassword = async (req, res) => {
    const newPassword = req.body.password;
    const sendToken = req.body.token;
    const user = await UserModel.findOne({
        resetToken: sendToken,
        expireToken: { $gt: Date.now() },
    });
    if (!user) {
        throw new BadRequestError("Token Expired");
    }
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.expireToken = undefined;
    await user.save();
    res.status(StatusCodes.OK).json({ message: "Update Password Success" });
};

module.exports = { signup, signin, resetPassword, newPassword };
