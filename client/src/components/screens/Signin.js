import React, { useState, useContext } from "react";
import { UserContext } from "../../App";
import { Link, useHistory } from "react-router-dom";
import M from "materialize-css";

const Signin = () => {
    const { state, dispatch } = useContext(UserContext);
    const history = useHistory();
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");

    const PostData = () => {
        fetch("/api/auth/signin", {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email,
                password,
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
                    localStorage.setItem("jwt", data.token);
                    localStorage.setItem("user", JSON.stringify(data.user));
                    dispatch({ type: "USER", payload: data.user });
                    M.toast({
                        html: "Signin Successfully",
                        classes: "#43a047 green darken-1",
                    });
                    history.push("/");
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
                <input
                    type="password"
                    placeholder="password "
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                ></input>
                <button
                    className="btn waves-effect waves-light #64b5f6 blue darken-1"
                    onClick={() => PostData()}
                >
                    Singin
                </button>
                <h5>
                    <Link to="/signup">Don't have an account?</Link>
                </h5>
                <h6>
                    <Link to="/reset">Forgot Password</Link>
                </h6>
            </div>
        </div>
    );
};

export default Signin;
