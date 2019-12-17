import axios from 'axios';
import * as AxiosLogger from 'axios-logger';
import {rawToken, updateToken} from "./context/auth";
import {BASE_URL} from "./urls";
import {message} from "antd";

const instance = axios.create();
instance.interceptors.request.use((request) => {
    return AxiosLogger.requestLogger(request);
});
instance.interceptors.response.use((response) => {
    return AxiosLogger.responseLogger(response);
});

export const service = instance;

function request(method, path, data) {
    const authOptions = {
        method: method,
        url: path,
        headers: {
            'Authorization': rawToken(),
            'Content-Type': 'application/json'
        },
        json: true
    };
    let result = null;
    if (method === 'GET') {
        result = axios.get(path, authOptions)
    } else if (method === 'PUT') {
        result = axios.put(path, data, authOptions)
    } else if (method === 'POST') {
        result = axios.post(path, data, authOptions)
    }
    if (result === null) {
        return Promise.reject("Unknown method " + method)
    }
    return result.then((response) => {
        if (response.status === 403) {
            updateToken(null);
            message.warning('Unauthorized');
            return Promise.reject("Unauthorized")
        }
        return response
    })
    .catch(error => {
        if (error.response) {
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
            if (error.response.status === 403) {
                updateToken(null);
                message.warning('Unauthorized');
            }
        } else if (error.request) {
            console.log(error.request);
        } else {
            console.log('Error', error.message);
        }
        console.log(error.config);
        return Promise.reject("Exception occurred")
    })
}

export function getData(path) {
    return request('GET', BASE_URL + path, null)
}

export function putData(path, data) {
    return request('PUT', BASE_URL + path, data)
}

export function postData(path, data) {
    return request('POST', BASE_URL + path, data)
}
