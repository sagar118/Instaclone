import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../App";

export const Profile = () => {
    const [mypics, setPics] = useState([]);
    const { state, dispatch } = useContext(UserContext);
    const [image, setImage] = useState("");

    useEffect(() => {
        // console.log(state);
        fetch("/api/post/myposts", {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("jwt"),
            },
        })
            .then((res) => res.json())
            .then((result) => {
                // console.log(result);
                setPics(result.posts);
            });
    }, []);

    useEffect(() => {
        if (image) {
            const data = new FormData();
            data.append("file", image);
            data.append("upload_preset", "insta-clone");
            data.append("cloud_name", "dscymmdeq");
            fetch("https://api.cloudinary.com/v1_1/dscymmdeq/image/upload", {
                method: "post",
                body: data,
            })
                .then((res) => res.json())
                .then((new_data) => {
                    // console.log(new_data);
                    fetch("/api/user/updatepic", {
                        method: "put",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization:
                                "Bearer " + localStorage.getItem("jwt"),
                        },
                        body: JSON.stringify({
                            photo: new_data.secure_url,
                        }),
                    })
                        .then((res) => res.json())
                        .then((result) => {
                            // console.log(result);
                            localStorage.setItem(
                                "user",
                                JSON.stringify({
                                    ...state,
                                    photo: result.user.photo,
                                })
                            );
                            dispatch({
                                type: "UPDATEPIC",
                                payload: result.user.photo,
                            });
                        })
                        .catch((err) => console.log(err));
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }, [image]);

    const updloadPhoto = (file) => {
        setImage(file);
    };

    return (
        <div style={{ maxWidth: "550px", margin: "0px auto" }}>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-round",
                    margin: "18px auto",
                    borderBottom: "1px solid grey",
                }}
            >
                <div>
                    <div>
                        <img
                            style={{
                                width: "160px",
                                height: "160px",
                                borderRadius: "80px",
                            }}
                            src={state ? state.photo : "Loading"}
                            alt=""
                        />
                    </div>
                    <div>
                        <div className="file-field input-field">
                            <div className="btn #64b5f6 blue darken-1">
                                <span>Update Profile Pic</span>
                                <input
                                    type="file"
                                    onChange={(e) =>
                                        updloadPhoto(e.target.files[0])
                                    }
                                ></input>
                            </div>
                            <div className="file-path-wrapper">
                                <input
                                    className="file-path validate"
                                    type="text"
                                ></input>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <h4>{state ? state.name : "loading"}</h4>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            width: "108%",
                        }}
                    >
                        <h6>{mypics.length} posts</h6>
                        <h6>
                            {state ? state.followers.length : "0"} followers
                        </h6>
                        <h6>
                            {state ? state.followings.length : "0"} followings
                        </h6>
                    </div>
                </div>
            </div>
            <div className="gallery">
                {mypics.map((item) => {
                    return (
                        <img
                            key={item._id}
                            className="item"
                            src={item.photo}
                            alt=""
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default Profile;
