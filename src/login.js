import React, {useState} from 'react';
import {Button, Form, Icon, Input, message} from 'antd';
import {Link, Redirect} from "react-router-dom";
import {useAuth} from "./context/auth";
import {LOGIN_URL} from "./urls";
import {service} from "./http";

function NormalLoginForm(props) {
    const {setAuthTokens} = useAuth();
    const [isLoggedIn, setLoggedIn] = useState(false);
    const [isError, setIsError] = useState(false);
    const referer = props?.location?.state?.referer || '/';

    const postLogin = (values) => {
        console.log('Post values', values);
        service.post(LOGIN_URL, values)
            .then(result => {
                if (result.status === 200) {
                    setAuthTokens(result.data);
                    setLoggedIn(true);
                } else {
                    setIsError(true);
                    message.error('Incorrect login or password');
                }
            })
            .catch(e => {
                console.log(e)
                setIsError(true);
                message.error('Service exception');
            });
    };

    const handleSubmit = e => {
        e.preventDefault();
        props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                postLogin(values);
            }
        });
    };

    if (isLoggedIn) {
        return <Redirect to={referer}/>;
    }

    const {getFieldDecorator} = props.form;
    return (
        <Form onSubmit={handleSubmit} className="login-form">
            <Form.Item>
                {getFieldDecorator('usernameOrEmail', {
                    rules: [{required: true, message: 'Please input your username!'}],
                })(
                    <Input
                        prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>}
                        placeholder="Username"
                    />,
                )}
            </Form.Item>
            <Form.Item>
                {getFieldDecorator('password', {
                    rules: [{required: true, message: 'Please input your Password!'}],
                })(
                    <Input
                        prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}}/>}
                        type="password"
                        placeholder="Password"
                    />,
                )}
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit" className="login-form-button">
                    Log in
                </Button>
                Or <Link to="/register"> register now!</Link>
            </Form.Item>
        </Form>
    );
}


const LoginForm = Form.create({name: 'normal_login'})(NormalLoginForm);

export default LoginForm
