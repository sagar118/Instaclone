import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import M from "materialize-css";

const Reset = () => {
    const history = useHistory();
    const [email, setEmail] = useState("");

    const PostData = () => {
        fetch("/api/auth/reset-password", {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                // console.log(data);
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

    return (
        <div className="mycard">
            <div className="card auth-card input-field">
                <h2>InstaClone</h2>
                <input
                    type="text"
                    placeholder="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                ></input>
                <button
                    className="btn waves-effect waves-light #64b5f6 blue darken-1"
                    onClick={() => PostData()}
                >
                    Reset Password
                </button>
            </div>
        </div>
    );
};

export default Reset;
