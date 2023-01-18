const { StatusCodes } = require("http-status-codes");
const PostModel = require("../models/Post");
const User = require("../models/User");
const UserModel = require("../models/User");

const getUser = async (req, res) => {
    const user = await UserModel.findOne({ _id: req.params.id }).select(
        "-password"
    );
    const post = await PostModel.find({ postedBy: req.params.id }).populate(
        "postedBy",
        "_id name"
    );
    res.status(StatusCodes.OK).json({ user, post });
};

const actionFollow = async (req, res) => {
    const follower = await UserModel.findByIdAndUpdate(
        req.body.followId,
        {
            $push: { followers: req.user.userId },
        },
        { new: true }
    ).select("-password");

    const following = await UserModel.findByIdAndUpdate(
        req.user.userId,
        {
            $push: { followings: req.body.followId },
        },
        { new: true }
    ).select("-password");

    res.status(StatusCodes.OK).json({ following });
};

const actionUnFollow = async (req, res) => {
    const follower = await UserModel.findByIdAndUpdate(
        req.body.unfollowId,
        {
            $pull: { followers: req.user.userId },
        },
        { new: true }
    ).select("-password");

    const following = await UserModel.findByIdAndUpdate(
        req.user.userId,
        {
            $pull: { followings: req.body.unfollowId },
        },
        { new: true }
    ).select("-password");

    res.status(StatusCodes.OK).json({ follower, following });
};

const actionUpdatePic = async (req, res) => {
    const user = await UserModel.findByIdAndUpdate(
        req.user.userId,
        {
            $set: { photo: req.body.photo },
        },
        { new: true }
    ).select("-password");
    res.status(StatusCodes.OK).json({ user });
};

const searchUser = async (req, res) => {
    let userPattern = new RegExp("^" + req.body.query);
    const user = await UserModel.find({
        email: { $regex: userPattern },
    }).select("_id email");
    res.status(StatusCodes.OK).json({ user });
};

module.exports = {
    getUser,
    actionFollow,
    actionUnFollow,
    actionUpdatePic,
    searchUser,
};
