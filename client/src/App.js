import React, { createContext, useEffect, useReducer, useContext } from "react";
import "./App.css";
import NavBar from "./components/Navbar";
import Home from "./components/screens/Home";
import Signin from "./components/screens/Signin";
import Profile from "./components/screens/Profile";
import Signup from "./components/screens/Signup";
import CreatePost from "./components/screens/CreatePost";
import UserProfile from "./components/screens/UserProfile";
import SubscribedUserPost from "./components/screens/SubscribedUserPost";
import Reset from "./components/screens/Reset";
import Newpassword from "./components/screens/Newpassword";
import { BrowserRouter, Route, Switch, useHistory } from "react-router-dom";
import { reducer, initialState } from "./reducers/userReducer";

export const UserContext = createContext();

const Routing = () => {
    // console.log("Front end start");
    const history = useHistory();
    const { state, dispatch } = useContext(UserContext);
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user) {
            dispatch({ type: "USER", payload: user });
        } else {
            if (!history.location.pathname.startsWith("/reset")) {
                history.push("/signin");
            }
        }
    }, []);

    return (
        <Switch>
            <Route exact path="/">
                <Home />
            </Route>
            <Route path="/signin">
                <Signin />
            </Route>
            <Route path="/signup">
                <Signup />
            </Route>
            <Route exact path="/profile">
                <Profile />
            </Route>
            <Route path="/create">
                <CreatePost />
            </Route>
            <Route path="/profile/:userid">
                <UserProfile />
            </Route>
            <Route path="/myfollowingpost">
                <SubscribedUserPost />
            </Route>
            <Route exact path="/reset">
                <Reset />
            </Route>
            <Route path="/reset/:token">
                <Newpassword />
            </Route>
        </Switch>
    );
};

function App() {
    const [state, dispatch] = useReducer(reducer, initialState);
    return (
        <UserContext.Provider value={{ state, dispatch }}>
            <BrowserRouter basename="/">
                <NavBar />
                <Routing />
            </BrowserRouter>
        </UserContext.Provider>
    );
}

export default App;
