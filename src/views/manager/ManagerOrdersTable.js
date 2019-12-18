import {Divider, Table} from 'antd';
import React, {Component} from 'react';
import {getData} from "../../http";

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
                <span>
                <a>View details</a>
                <Divider type="vertical" />
                <a>Change status</a>
                <Divider type="vertical" />
                <a>Check availability</a>
              </span>
            ),
        },
    ];

    getData = callback => {
        getData('api/order/')
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