import {Button, InputNumber, message, Table} from "antd";
import {getData, postData} from "../../http";
import React, {Component} from "react";

class ManagerNewPurchase extends Component {

    state = {
        loading: true,
        selected_rows: [],
        item_amount: {},
        list: [],
    };

    columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: text => <a>{text}</a>,
        },
        {
            title: 'Amount',
            render: (text, record) => <InputNumber onChange={this.editItemAmount(record)}/>,
        },
    ];

    editItemAmount = (item) => (e) => {
        const {item_amount} = this.state;
        item_amount[item.id] = e;
        this.setState({item_amount})
    };

    getData = callback => {
        getData('api/product/')
            .then(result => {
                if (result.status === 200) {
                    callback(result.data)
                }
            })
    };

    componentDidMount() {
        this.getData(res => {
            this.setState({
                loading: false,
                list: res,
            });
        });
    }

    rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            this.setState({selected_rows: selectedRows})
        },
        getCheckboxProps: record => ({
            name: record.name,
        }),
    };

    createOrder = () => {
        const {selected_rows, item_amount} = this.state;
        let itemsForOrder = {};
        selected_rows.map(item => {
            const amount = item_amount[item.id] || 1;
            itemsForOrder[item.id] = amount
        });
        postData('api/purchase/', {products: itemsForOrder})
            .then(result => {
                if (result.status === 200) {
                    message.info(`Purchase created (${result.data.id})`)
                } else {
                    message.warning(`Error while creating purchase`)
                }
            })
            .catch(ex => message.error("Exception while creating purchase: " + ex))
    };

    render_table = () => {
        const {loading, list} = this.state;
        return <div>
            <Button onClick={this.createOrder}>Create purchase</Button>
            <Table loading={loading} rowSelection={this.rowSelection} columns={this.columns}
                   dataSource={list} rowKey={(record) => record.id}/>
        </div>
    };

    render() {
        return this.render_table()
    };
}

export default ManagerNewPurchase