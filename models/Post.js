const mongoose = require("mongoose");

const PostSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Please provide title of the post"],
        },
        body: {
            type: String,
            required: [true, "Please provide body of the post"],
        },
        photo: {
            type: String,
            required: [true, "Please upload a photo"],
        },
        likes: [{ type: mongoose.Types.ObjectId, ref: "User" }],
        comments: [
            {
                text: String,
                postedBy: { type: mongoose.Types.ObjectId, ref: "User" },
            },
        ],
        postedBy: {
            type: mongoose.Types.ObjectId,
            ref: "User",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);
