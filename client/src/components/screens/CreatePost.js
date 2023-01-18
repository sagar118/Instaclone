import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import M from "materialize-css";

const CreatePost = () => {
    const history = useHistory();
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [image, setImage] = useState("");
    // Matches photo in Post Schema, although is used to save the url of the photo
    const [photo, setPhoto] = useState("");

    useEffect(() => {
        if (photo) {
            fetch("/api/post/createpost", {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + localStorage.getItem("jwt"),
                },
                body: JSON.stringify({
                    title,
                    body,
                    photo,
                }),
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.msg) {
                        M.toast({
                            html: data.msg,
                            classes: "#c62828 red darken-3",
                        });
                    } else {
                        M.toast({
                            html: "Created Post Successfully",
                            classes: "#43a047 green darken-1",
                        });
                        history.push("/");
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }, [photo]);

    const postDetails = () => {
        const data = new FormData();
        data.append("file", image);
        data.append("upload_preset", "insta-clone");
        data.append("cloud_name", "dscymmdeq");
        fetch("https://api.cloudinary.com/v1_1/dscymmdeq/image/upload", {
            method: "post",
            body: data,
        })
            .then((res) => res.json())
            .then((data) => {
                setPhoto(data.secure_url);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return (
        <div
            className="card input-filed"
            style={{
                margin: "30px auto",
                maxWidth: "500px",
                padding: "20px",
                textAlign: "center",
            }}
        >
            <input
                type="text"
                placeholder="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            ></input>
            <input
                type="text"
                placeholder="body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
            ></input>
            <div className="file-field input-field">
                <div className="btn #64b5f6 blue darken-1">
                    <span>Upload Image</span>
                    <input
                        type="file"
                        onChange={(e) => setImage(e.target.files[0])}
                    ></input>
                </div>
                <div className="file-path-wrapper">
                    <input className="file-path validate" type="text"></input>
                </div>
            </div>
            <button
                className="btn waves-effect waves-light #64b5f6 blue darken-1"
                onClick={() => postDetails()}
            >
                Submit Post
            </button>
        </div>
    );
};

export default CreatePost;
