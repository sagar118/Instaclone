import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../App";
import { useParams } from "react-router-dom";

export const UserProfile = () => {
    const [userProfile, setProfile] = useState(null);
    const { state, dispatch } = useContext(UserContext);
    const { userid } = useParams();
    const [showFollow, setShowFollow] = useState(
        state ? !state.followings.includes(userid) : true
    );

    useEffect(() => {
        fetch(`/api/user/${userid}`, {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("jwt"),
            },
        })
            .then((res) => res.json())
            .then((result) => {
                // console.log(result);
                setProfile(result);
                // console.log(userProfile.user.name);
            })
            .catch((err) => console.log(err));
    }, []);

    const followUser = () => {
        fetch("/api/user/follow", {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("jwt"),
            },
            body: JSON.stringify({
                followId: userid,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                // console.log(data);
                dispatch({
                    type: "UPDATE",
                    payload: {
                        followings: data.following.followings,
                        followers: data.following.followers,
                    },
                });
                localStorage.setItem("user", JSON.stringify(data.following));
                setProfile((prevState) => {
                    return {
                        ...prevState,
                        user: {
                            ...prevState.user,
                            followers: [
                                ...prevState.user.followers,
                                data.following._id,
                            ],
                        },
                    };
                });
                setShowFollow(false);
            })
            .catch((err) => console.log(err));
    };

    const unfollowUser = () => {
        fetch("/api/user/unfollow", {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("jwt"),
            },
            body: JSON.stringify({
                unfollowId: userid,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                // console.log(data);
                dispatch({
                    type: "UPDATE",
                    payload: {
                        followings: data.following.followings,
                        followers: data.following.followers,
                    },
                });
                localStorage.setItem("user", JSON.stringify(data.following));
                setProfile((prevState) => {
                    const newFollower = prevState.user.followers.filter(
                        (item) => item !== data.following._id
                    );
                    return {
                        ...prevState,
                        user: {
                            ...prevState.user,
                            followers: newFollower,
                        },
                    };
                });
                setShowFollow(true);
            })
            .catch((err) => console.log(err));
    };

    return (
        <>
            {userProfile ? (
                <div style={{ maxWidth: "550px", margin: "0px auto" }}>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-round",
                            margin: "18px 0px",
                            borderBottom: "1px solid grey",
                        }}
                    >
                        <div>
                            <img
                                style={{
                                    width: "160px",
                                    height: "160px",
                                    borderRadius: "80px",
                                }}
                                src={userProfile.user.photo}
                                alt=""
                            />
                        </div>
                        <div>
                            <h4>{userProfile.user.name}</h4>
                            <h5>{userProfile.user.email}</h5>
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    width: "108%",
                                }}
                            >
                                <h6>{userProfile.post.length} posts</h6>
                                <h6>
                                    {userProfile.user.followers.length}{" "}
                                    followers
                                </h6>
                                <h6>
                                    {userProfile.user.followings.length}{" "}
                                    followings
                                </h6>
                            </div>
                            {showFollow ? (
                                <button
                                    style={{ margin: "10px" }}
                                    className="btn waves-effect waves-light #64b5f6 blue darken-1"
                                    onClick={() => followUser()}
                                >
                                    Follow
                                </button>
                            ) : (
                                <button
                                    style={{ margin: "10px" }}
                                    className="btn waves-effect waves-light #64b5f6 blue darken-1"
                                    onClick={() => unfollowUser()}
                                >
                                    UnFollow
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="gallery">
                        {userProfile.post.map((item) => {
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
            ) : (
                <h2>Loading...</h2>
            )}
        </>
    );
};

export default UserProfile;
