require("dotenv").config();
require("express-async-errors");
const express = require("express");
const cors = require("cors");

// Config
const app = express();
const connectDB = require("./db/connect");
const port = process.env.PORT || 5500;
const notFoundMiddleware = require("./middlewares/not-found");
const errorHandlerMiddleware = require("./middlewares/error-handler");
const authenticateUser = require("./middlewares/authentication");

// Middlewares
app.use(cors());
app.use(express.json());

// Router
const authRouter = require("./routes/auth");
const postRouter = require("./routes/post");
const userRouter = require("./routes/user");

// Routes
app.use("/api/auth", authRouter);
app.use("/api/post", authenticateUser, postRouter);
app.use("/api/user", authenticateUser, userRouter);

// Error handling middleware
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        app.listen(port, () => {
            console.log(`Server is running on port: ${port}...`);
        });

        if (process.env.NODE_ENV == "production") {
            const path = require("path");
            app.use(express.static(path.resolve(__dirname, "client", "build")));
            app.get("*", function (_, res) {
                res.sendFile(
                    path.join(__dirname, " ./client/build/index.html"),
                    function (err) {
                        if (err) {
                            res.status(500).send(err);
                        }
                    }
                );
            });
        }
    } catch (error) {
        console.log(error);
    }
};

start();
