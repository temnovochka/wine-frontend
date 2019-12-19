import React, {Component} from "react";
import {Button, DatePicker, Form, Icon, Input, message} from "antd";
import {putData} from "../../http";
import moment from "moment";

class ClientProfileForm extends Component {
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                putData(`api/client/${this.props.user.login}`, {
                    login: this.props.user.login,
                    email: this.props.user.email,
                    role: this.props.user.role,
                    name: values.name,
                    document: values.document,
                    birthday: values.birthday.format(),
                    card: values.card,
                    isConfirmed: this.props.user.isConfirmed
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
                <Form.Item label="Confirmed">
                    {this.props.user.isConfirmed && <Icon type="check-circle" theme="filled" style={{color: "green"}}/>}
                    {!this.props.user.isConfirmed && <Icon type="close-circle" theme="filled" style={{color: "red"}}/>}
                </Form.Item>
                <Form.Item label="Name">
                    {getFieldDecorator('name', {
                        initialValue: this.props.user.name
                    })(<Input placeholder={"name"}/>)}
                </Form.Item>
                <Form.Item label="Card">
                    {getFieldDecorator('card', {
                        initialValue: this.props.user.card
                    })(<Input placeholder={"card"}/>)}
                </Form.Item>
                <Form.Item label="Document">
                    {getFieldDecorator('document', {
                        initialValue: this.props.user.document
                    })(<Input placeholder={"document"}/>)}
                </Form.Item>
                <Form.Item label="Birthday">
                    {getFieldDecorator('birthday', {
                        initialValue: moment(this.props.user.birthday,
                            "YYYY-MM-DD")
                    })(<DatePicker placeholder={"Your birthday"}/>)}
                </Form.Item>
                <Form.Item >
                    <Button type="primary" htmlType="submit" className="client-profile-form-button">
                        Save
                    </Button>
                </Form.Item>
            </Form>

        )
    }
}

const ClientProfile = Form.create({name: 'client_profile'})(ClientProfileForm);

export default ClientProfile
