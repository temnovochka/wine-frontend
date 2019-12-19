import {Table, Divider, Button, message} from 'antd';
import React, {Component} from 'react';
import {getData, putData} from "../../http";

class ClientOrderList extends Component {

    state = {
        loading: true,
        list: [],
    };

    columns = [
        {
            title: 'Number',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Products',
            dataIndex: 'products',
            key: 'products',
            render: products => Object.entries(products)
                .map(([key, value], i) => <span key={i}> {`${key}: ${value}`} </span>),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: 'Payment status',
            dataIndex: 'paymentStatus',
            key: 'paymentStatus',
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <div>
                    {record.paymentStatus === 'NOT_PAID' && <Button onClick={this.payOrder(record)}>Pay</Button>}
                </div>

            ),
        },
    ];

    payOrder = (order) => (e) => {
        console.log('Pay order: ', order)
        order.paymentStatus = 'PAID'
        putData(`api/order/${order.id}`, order)
            .then(result => {
                if (result.status === 200) {
                   this.refreshTableData()
                } else {
                    message.warning(`Unable to pay order ${order.id}`)
                }
            })
            .catch(ex => message.error(`Error when pay order ${ex}`))
    };

    refreshTableData = () => {
        this.getData(res => {
            this.setState({
                loading: false,
                list: res,
            });
        });
    }

    getData = callback => {
        getData('api/order/')
            .then(result => {
                if (result.status === 200) {
                    callback(result.data)
                }
            })
    };

    componentDidMount() {
      this.refreshTableData()
    }

    render_table = () => {
        const {loading, list} = this.state;
        return <Table loading={loading} columns={this.columns}
                      dataSource={list} rowKey={(record) => record.id}/>
    };

    render() {
        return this.render_table()
    };

}

export default ClientOrderList