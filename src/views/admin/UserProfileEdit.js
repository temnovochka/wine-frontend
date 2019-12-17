import React, {Component} from "react";
import {Button, Form, message, Select} from "antd";
import {putData} from "../../http";
import {USER_ROLES} from "../../constants";

class UserProfileEdit extends Component {
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                putData(`api/user/${this.props.user.login}`, {
                    login: this.props.user.login,
                    email: this.props.user.email,
                    role: values.role
                })
                .then((result) => {
                    if (result.status === 200) {
                        message.info('Successfully updated');
                    } else {
                        message.info('Error in update');
                    }
                })
                .catch((ex) => {
                    message.error('Service exception ' + ex);
                })
            }
        });
    };

    render() {
        const {getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: {span: 6},
            wrapperCol: {span: 14},
        };
        return (
            <Form {...formItemLayout} onSubmit={this.handleSubmit}>
                <Form.Item label="Login">
                    <span
                        className="ant-form-text">{this.props.user.login}</span>
                </Form.Item>
                <Form.Item label="Email">
                    <span
                        className="ant-form-text">{this.props.user.email}</span>
                </Form.Item>
                <Form.Item label="Role" hasFeedback>
                    {getFieldDecorator('role', {
                        initialValue: this.props.user.role,
                        rules: [{required: true}],
                    })(
                        <Select>
                            {USER_ROLES.map(it => <Select.Option key={it}
                                                                 value={it}> {it} </Select.Option>)}
                        </Select>,
                    )}
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit"
                            className="user-profile-form-button">
                        Save
                    </Button>
                </Form.Item>
            </Form>

        )
    }
}

const UserProfile = Form.create({name: 'user_profile'})(UserProfileEdit);

export default UserProfile
