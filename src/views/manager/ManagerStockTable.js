import {Table} from 'antd';
import React, {Component} from 'react';
import {getData} from "../../http";

class ManagerStockTable extends Component {

    state = {
        loading: true,
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
            title: 'Description',
            dataIndex: 'features',
            key: 'features',
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <span>
                <a>Added {record.name} into order</a>
                    {/*<Divider type="vertical"/>*/}
                    {/*<a>Delete</a>*/}
              </span>
            ),
        },
    ];

    getData = callback => {
        getData('api/product/')
            .then(result => {
                if (result.status === 200) {
                    callback(result.data)
                }
            })
    };

    render_table = () => {
        const {loading, list} = this.state;
        return <Table loading={loading} columns={this.columns}
                      dataSource={list} rowKey={(record) => record.id}/>
    };

    render() {
        // this.setState({
        //     loading: true
        // });
        this.getData(res => {
            this.setState({
                loading: false,
                list: res,
            });
        });
        return this.render_table()
    };

}

export default ManagerStockTable