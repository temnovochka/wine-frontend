import React from "react";
import {Route, Redirect} from "react-router-dom";
import {useAuth, tokenIsValid} from "./context/auth";

function PrivateRoute({component: Component, ...rest}) {
    const {authTokens} = useAuth();
    const token = authTokens();
    return (
        <Route
            {...rest}
            render={props =>
                tokenIsValid(token) ? (
                    <Component user={token} {...props} />
                ) : (
                    <Redirect to={{pathname: "/login", state: {referer: props.location}}}/>
                )
            }
        />
    );
}

export default PrivateRoute;
