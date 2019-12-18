import {Table} from 'antd';
import React, {Component} from 'react';
import {getData} from "../../http";

class ManagerClientsTable extends Component {

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
            title: 'Document',
            dataIndex: 'document',
            key: 'document',
        },
        {
            title: 'Birthday',
            dataIndex: 'birthday',
            key: 'birthday',
            defaultSortOrder: 'descend',
            sorter: (a, b) => a.birthday - b.birthday,
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <span>
                <a>Confirm</a>
              </span>
            ),
        },
    ];

    getData = callback => {
        getData('api/client/')
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

export default ManagerClientsTable