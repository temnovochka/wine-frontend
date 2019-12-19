import {Button, message, Table} from 'antd';
import React, {Component} from 'react';
import {getData, putData} from "../../http";

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
                <div>
                    {!record.isConfirmed && <Button onClick={this.confirmClient(record)}>Confirm</Button>}
                </div>

            ),
        },
    ];

    confirmClient = (client) => (e) => {
        client.isConfirmed = true;
        putData(`api/client/${client.login}`, client)
            .then(result => {
                if (result.status === 200) {
                    this.refreshTableData()
                } else {
                    message.warning(`Unable to confirm client ${client.id}`)
                }
            })
            .catch(ex => message.error(`Error when confirm client ${ex}`))
    };

    getData = callback => {
        getData('api/client/')
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

export default ManagerClientsTable