require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide a name"],
    },
    email: {
        type: String,
        required: [true, "Please provide an email"],
        unique: true,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            "Please povide valid email",
        ],
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
        minLength: 6,
    },
    resetToken: String,
    expireToken: Date,
    photo: {
        type: String,
        default:
            "https://res.cloudinary.com/dscymmdeq/image/upload/v1665953942/samples/landscapes/beach-boat.jpg",
    },
    followers: [{ type: mongoose.Types.ObjectId, ref: "User" }],
    followings: [{ type: mongoose.Types.ObjectId, ref: "User" }],
});

UserSchema.pre("save", async function () {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePassword = async function (candidatePassword) {
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;
};

UserSchema.methods.createJWT = async function () {
    return jwt.sign(
        {
            userId: this._id,
            name: this.name,
            email: this.email,
            followers: this.followers,
            followings: this.followings,
            photo: this.photo,
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_LIFETIME }
    );
};

module.exports = mongoose.model("User", UserSchema);
