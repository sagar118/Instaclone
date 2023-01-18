const { StatusCodes } = require("http-status-codes");
const PostModel = require("../models/Post");

const createPost = async (req, res) => {
    const postedBy = req.user.userId;
    // console.log(req.body);
    await PostModel.create({ ...req.body, postedBy });
    res.status(StatusCodes.OK).json({ message: "SUCCESS", post: req.body });
};

const getAllPosts = async (req, res) => {
    const posts = await PostModel.find({})
        .populate("postedBy", "_id name")
        .populate("comments.postedBy", "_id name")
        .sort("-createdAt");
    res.status(StatusCodes.OK).json({ posts });
};

const getSubPosts = async (req, res) => {
    // console.log(req.user);
    const posts = await PostModel.find({
        postedBy: { $in: req.user.followings },
    })
        .populate("postedBy", "_id name")
        .populate("comments.postedBy", "_id name")
        .sort("-createdAt");
    res.status(StatusCodes.OK).json({ posts });
};

const myPost = async (req, res) => {
    // console.log(req.user);
    const posts = await PostModel.find({ postedBy: req.user.userId })
        .populate("postedBy", "_id name")
        .populate("comments.postedBy", "_id name")
        .sort("-createdAt");
    res.status(StatusCodes.OK).json({ posts });
};

const actionLike = async (req, res) => {
    const like = await PostModel.findByIdAndUpdate(
        req.body.postId,
        {
            $push: { likes: req.user.userId },
        },
        { new: true }
    )
        .populate("postedBy", "_id name")
        .populate("comments.postedBy", "_id name")
        .sort("-createdAt");
    res.status(StatusCodes.OK).json(like);
};

const actionUnLike = async (req, res) => {
    const like = await PostModel.findByIdAndUpdate(
        req.body.postId,
        {
            $pull: { likes: req.user.userId },
        },
        { new: true }
    )
        .populate("postedBy", "_id name")
        .populate("comments.postedBy", "_id name")
        .sort("-createdAt");
    res.status(StatusCodes.OK).json(like);
};

const actionComment = async (req, res) => {
    const comment = {
        text: req.body.text,
        postedBy: req.user.userId,
    };
    const like = await PostModel.findByIdAndUpdate(
        req.body.postId,
        {
            $push: { comments: comment },
        },
        { new: true }
    )
        .populate("postedBy", "_id name")
        .populate("comments.postedBy", "_id name")
        .sort("-createdAt");
    res.status(StatusCodes.OK).json(like);
};

const deletePost = async (req, res) => {
    const post = await PostModel.findOneAndRemove({
        _id: req.params.postId,
    })
        .populate("postedBy", "_id name")
        .populate("comments.postedBy", "_id name")
        .sort("-createdAt");
    // if (post.postedBy._id.toString() === req.user.userId.toString()) {
    //     const result = post.remove();
    // }
    res.status(StatusCodes.OK).json({ post });
};

module.exports = {
    createPost,
    getAllPosts,
    getSubPosts,
    myPost,
    actionLike,
    actionUnLike,
    actionComment,
    deletePost,
};
