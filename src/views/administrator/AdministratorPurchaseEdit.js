import React, {Component} from "react";
import {Button, Form, Input, message} from "antd";
import {putData} from "../../http";

class AdministratorPurchaseEdit extends Component {
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.purchase.supplier = values.supplier;
                this.props.purchase.status = 'IN_PROGRESS';
                putData(`api/purchase/${this.props.purchase.id}`, this.props.purchase)
                    .then(result => {
                        // console.log(result);
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
                <Form.Item label="Number">
                    <span
                        className="ant-form-text">{this.props.purchase.id}</span>
                </Form.Item>
                <Form.Item label="Supplier" hasFeedback>
                    {getFieldDecorator('supplier', {
                        initialValue: this.props.purchase.supplier,
                        rules: [{required: true}],
                    })(
                        <Input/>,
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

const AdministratorPurchase = Form.create({name: 'administrator_purchase'})(AdministratorPurchaseEdit);

export default AdministratorPurchase
