import {createContext, useContext} from 'react';
import decodeJwt from 'jwt-decode';

export const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function tokenIsValid(token) {
    return !!token
}

export function updateToken(data) {
    if (data) {
        localStorage.setItem("tokens", JSON.stringify(data));
    } else {
        localStorage.removeItem("tokens")
    }
}

export function getToken() {
    const tokens = localStorage.getItem("tokens");
    if (!tokens) return null;
    const parsed = JSON.parse(tokens);
    return decodeJwt(parsed.accessToken)
}

export function parseToken(data) {
    return decodeJwt(data.accessToken)
}

export function rawToken() {
    const tokens = localStorage.getItem("tokens");
    if (!tokens) return null;
    const parsed = JSON.parse(tokens);
    return parsed.accessToken
}
