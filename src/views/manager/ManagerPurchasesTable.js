import {Table} from 'antd';
import React, {Component} from 'react';
import {getData} from "../../http";

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
            title: 'Is already in stock',
            dataIndex: 'isAddedIntoStock',
            key: 'isAddedIntoStock',
            render: isAddedIntoStock => `${isAddedIntoStock.toString()}`,
        },
        {
            title: 'Action',
            key: 'action',
            render: () => (
                <span>
                <a>Add into stock</a>
                    {/*<Divider type="vertical"/>*/}
                    {/*<a>Delete</a>*/}
              </span>
            ),
        },
    ];

    getData = callback => {
        getData('api/purchase/')
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

export default ManagerPurchasesTable