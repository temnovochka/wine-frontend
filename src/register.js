import React, {useState} from 'react';
import {
    Form,
    Input,
    Tooltip,
    Icon,
    // Select,
    Button, message,
} from 'antd';
import {service} from "./http";
import {REGISTER_URL} from "./urls";
import {Redirect} from "react-router-dom";
import {tokenIsValid, useAuth} from "./context/auth";

// const {Option} = Select;

function NormalRegistrationForm(props) {
    const [confirmDirty, setConfirmDirty] = useState(false);
    const [isRegistered, setRegistered] = useState(false);
    const [isError, setIsError] = useState(false);
    const {authTokens} = useAuth();

    const postRegister = (values) => {
        console.log('Post values', values);
        service.post(REGISTER_URL, values)
            .then(result => {
                console.log('Service response ', result);
                if (result.status === 201) {
                    setRegistered(true);
                } else {
                    setIsError(true);
                    message.error('Unable to register');
                }
            })
            .catch(e => {
                console.log('Service exception ', e);
                setIsError(true);
                message.error('Service exception');
            });
    }

    const handleSubmit = e => {
        e.preventDefault();
        props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                postRegister(values)
            }
        });
    };

    const handleConfirmBlur = e => {
        const {value} = e.target;
        setConfirmDirty(confirmDirty || !!value);
    };

    const compareToFirstPassword = (rule, value, callback) => {
        const {form} = props;
        if (value && value !== form.getFieldValue('password')) {
            callback('Two passwords that you enter is inconsistent!');
        } else {
            callback();
        }
    };

    const validateToNextPassword = (rule, value, callback) => {
        const {form} = props;
        if (value && confirmDirty) {
            form.validateFields(['confirm'], {force: true});
        }
        callback();
    };


    const {getFieldDecorator} = props.form;
    const formItemLayout = {
        labelCol: {
            xs: {span: 24},
            sm: {span: 8},
        },
        wrapperCol: {
            xs: {span: 24},
            sm: {span: 16},
        },
    };
    const tailFormItemLayout = {
        wrapperCol: {
            xs: {
                span: 24,
                offset: 0,
            },
            sm: {
                span: 16,
                offset: 8,
            },
        },
    };
    // const prefixSelector = getFieldDecorator('prefix', {
    //     initialValue: '+7',
    // })(
    //     <Select style={{width: 70}}>
    //         <Option value="+7">+7</Option>
    //         <Option value="+38">+38</Option>
    //     </Select>,
    // );

    if (tokenIsValid(authTokens()) || isRegistered) {
        return <Redirect to="/login"/>;
    }

    return (
        <Form {...formItemLayout} onSubmit={handleSubmit} className="register-form">
            <Form.Item label="E-mail">
                {getFieldDecorator('email', {
                    rules: [
                        {
                            type: 'email',
                            message: 'The input is not valid E-mail!',
                        },
                        {
                            required: true,
                            message: 'Please input your E-mail!',
                        },
                    ],
                })(<Input/>)}
            </Form.Item>
            <Form.Item label="Password" hasFeedback>
                {getFieldDecorator('password', {
                    rules: [
                        {
                            required: true,
                            message: 'Please input your password!',
                        },
                        {
                            validator: validateToNextPassword,
                        },
                    ],
                })(<Input.Password/>)}
            </Form.Item>
            <Form.Item label="Confirm Password" hasFeedback>
                {getFieldDecorator('confirm', {
                    rules: [
                        {
                            required: true,
                            message: 'Please confirm your password!',
                        },
                        {
                            validator: compareToFirstPassword,
                        },
                    ],
                })(<Input.Password onBlur={handleConfirmBlur}/>)}
            </Form.Item>
            <Form.Item
                label={
                    <span>
              Nickname&nbsp;
                        <Tooltip title="What do you want others to call you?">
                <Icon type="question-circle-o"/>
              </Tooltip>
            </span>
                }
            >
                {getFieldDecorator('username', {
                    rules: [{required: true, message: 'Please input your nickname!', whitespace: true}],
                })(<Input/>)}
            </Form.Item>
            {/*<Form.Item label="Phone Number">*/}
            {/*    {getFieldDecorator('phone', {*/}
            {/*        rules: [{required: true, message: 'Please input your phone number!'}],*/}
            {/*    })(<Input addonBefore={prefixSelector} style={{width: '100%'}}/>)}*/}
            {/*</Form.Item>*/}
            <Form.Item {...tailFormItemLayout}>
                <Button type="primary" htmlType="submit" className="register-form-button">
                    Register
                </Button>
            </Form.Item>
        </Form>
    );
}


const RegistrationForm = Form.create({name: 'register'})(NormalRegistrationForm);

export default RegistrationForm
