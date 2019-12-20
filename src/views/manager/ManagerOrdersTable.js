import {Button, Divider, message, Table} from 'antd';
import React, {Component} from 'react';
import {getData, putData} from "../../http";

class ManagerOrdersTable extends Component {

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
            title: 'Client',
            dataIndex: 'clientLogin',
            key: 'clientLogin',
        },
        {
            title: 'Manager',
            dataIndex: 'managerLogin',
            key: 'managerLogin',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: 'Products',
            dataIndex: 'products',
            key: 'products',
            render: products => Object.entries(products)
                .map(([key, value], i) => <span key={i}> {`${key}: ${value}`} </span>),
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
                    {!(record.status === 'CLOSED' || (record.status === 'DONE' && record.paymentStatus === 'NOT_PAID')) &&
                    <Button onClick={this.closeOrder(record)}>Close</Button>}
                    <Divider type="vertical"/>
                    {record.status === 'NEW' &&
                    <Button type='primary' onClick={this.takeOrder(record)}>Take order</Button>}
                    <Divider type="vertical"/>
                    {(record.status === 'IN_PROGRESS' || record.status === 'NOT_DONE') &&
                    <Button onClick={this.checkOrder(record)}>Get from stock</Button>}
                </div>
            ),
        },
    ];

    checkOrder = (order) => (e) => {
        putData(`api/order/check/${order.id}`, order)
            .then(result => {
                if (result.status === 200) {
                    this.refreshTableData()
                } else {
                    message.warning(`Unable to check in stock order ${order.id}`)
                }
            })
            .catch(ex => message.error(`Error when check in stock order ${ex}`))
    };

    takeOrder = (order) => (e) => {
        order.status = 'IN_PROGRESS';
        order.managerId = this.props.user.id;
        putData(`api/order/${order.id}`, order)
            .then(result => {
                if (result.status === 200) {
                    this.refreshTableData()
                } else {
                    message.warning(`Unable to take order ${order.id}`)
                }
            })
            .catch(ex => message.error(`Error when take order ${ex}`))
    };

    closeOrder = (order) => (e) => {
        order.status = 'CLOSED';
        putData(`api/order/${order.id}`, order)
            .then(result => {
                if (result.status === 200) {
                    this.refreshTableData()
                } else {
                    message.warning(`Unable to close order ${order.id}`)
                }
            })
            .catch(ex => message.error(`Error when close order ${ex}`))
    };

    getData = callback => {
        getData('api/order/')
            .then(result => {
                if (result.status === 200) {
                    callback(result.data)
                }
            })
    };

    refreshTableData = () => {
        this.getData(res => {
            this.setState({
                loading: false,
                list: res,
            });
        });
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

export default ManagerOrdersTable