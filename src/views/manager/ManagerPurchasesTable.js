import {Button, message, Table} from 'antd';
import React, {Component} from 'react';
import {getData, putData} from "../../http";

class ManagerPurchasesTable extends Component {

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
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: 'Administrator',
            dataIndex: 'administratorLogin',
            key: 'administratorLogin',
        },
        {
            title: 'Manager',
            dataIndex: 'managerLogin',
            key: 'managerLogin',
        },
        {
            title: 'Supplier',
            dataIndex: 'supplier',
            key: 'supplier',
        },
        {
            title: 'Products',
            dataIndex: 'products',
            key: 'products',
            render: products => Object.entries(products)
                .map(([key, value], i) => <span key={i}> {`${key}: ${value}`} </span>),
        },
        {
            title: 'Is already in stock',
            dataIndex: 'isAddedIntoStock',
            key: 'isAddedIntoStock',
            render: isAddedIntoStock => `${isAddedIntoStock.toString()}`,
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <div>
                    {record.status === 'DONE' && !record.isAddedIntoStock &&
                    <Button onClick={this.addIntoStock(record)}>Add into stock</Button>}
                </div>
            ),
        },
    ];

    addIntoStock = (purchase) => (e) => {
        purchase.isAddedIntoStock = true;
        purchase.status = 'CLOSED';
        putData(`api/purchase/${purchase.id}`, purchase)
            .then(result => {
                if (result.status === 200) {
                    this.refreshTableData()
                } else {
                    message.warning(`Unable to added into stock purchase ${purchase.id}`)
                }
            })
            .catch(ex => message.error(`Error when added into stock purchase ${ex}`))
    };

    getData = callback => {
        getData('api/purchase/')
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

export default ManagerPurchasesTable