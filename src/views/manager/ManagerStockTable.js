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
        },
        {
            title: 'Number',
            dataIndex: 'number',
            key: 'number',
        },
        {
            title: 'Action',
            key: 'action',
            render: () => (
                <span>
                <a>Add into purchase</a>
              </span>
            ),
        },
    ];

    getData = callback => {
        getData('api/stock/')
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

export default ManagerStockTable