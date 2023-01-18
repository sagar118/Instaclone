import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import M from "materialize-css";

const Signup = () => {
    const history = useHistory();
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [image, setImage] = useState("");
    const [photo, setPhoto] = useState(undefined);

    useEffect(() => {
        if (photo) {
            uploadFields();
        }
    }, [photo]);

    const uploadPic = () => {
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

    const uploadFields = () => {
        fetch("/api/auth/signup", {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name,
                email,
                password,
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
                        html: data.message,
                        classes: "#43a047 green darken-1",
                    });
                    history.push("/signin");
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const PostData = () => {
        if (image) {
            uploadPic();
        } else {
            uploadFields();
        }
    };

    return (
        <div className="mycard">
            <div className="card auth-card input-field">
                <h2>InstaClone</h2>
                <input
                    type="text"
                    placeholder="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                ></input>
                <input
                    type="text"
                    placeholder="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                ></input>
                <input
                    type="password"
                    placeholder="password "
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                ></input>
                <div className="file-field input-field">
                    <div className="btn #64b5f6 blue darken-1">
                        <span>Upload Profile Pic</span>
                        <input
                            type="file"
                            onChange={(e) => setImage(e.target.files[0])}
                        ></input>
                    </div>
                    <div className="file-path-wrapper">
                        <input
                            className="file-path validate"
                            type="text"
                        ></input>
                    </div>
                </div>
                <button
                    className="btn waves-effect waves-light #64b5f6 blue darken-1"
                    onClick={() => PostData()}
                >
                    Singup
                </button>
                <h5>
                    <Link to="/signin">Already have an account</Link>
                </h5>
            </div>
        </div>
    );
};

export default Signup;
