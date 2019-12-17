import React, {useState} from 'react';
import {BrowserRouter as Router, Route} from "react-router-dom";
import Home from "./home";
import LoginForm from "./login";
import RegistrationForm from "./register";
import PrivateRoute from "./privateRoute";
import PrivateApp from "./privateApp";
import {AuthContext, getToken, parseToken, updateToken} from "./context/auth";
import './App.css';

const App = () => {
    const [authTokens, setAuthTokens] = useState();

    const setTokens = (data) => {
        if (data) {
            updateToken(data);
            setAuthTokens(parseToken(data))
        } else {
            updateToken(data);
            setAuthTokens(data);
        }
    };

    const getTokens = () => authTokens || getToken();

    return (
        <AuthContext.Provider value={{authTokens: getTokens, setAuthTokens: setTokens}}>
            <Router>
                <Route exact path="/" component={Home}/>
                <Route path="/login" component={LoginForm}/>
                <Route path="/register" component={RegistrationForm}/>
                <PrivateRoute path="/private" component={PrivateApp}/>
            </Router>
        </AuthContext.Provider>
    );
};

export default App;
