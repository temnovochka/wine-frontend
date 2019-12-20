import React, {Component} from 'react';
import {Button, Divider, Empty, Layout, Menu, message, Table} from 'antd';
import {getData, putData} from "../../http";
import AdministratorPurchaseEdit from "./AdministratorPurchaseEdit";

class AdministratorView extends Component {

    state = {
        loading: true,
        list: [],
        selected_purchase: null,
        selected_menu: null
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
            width: '30%',
            editable: true,
        },
        {
            title: 'Products',
            dataIndex: 'products',
            key: 'products',
            render: products => Object.entries(products)
                .map(([key, value], i) => <span key={i}> {`${key}: ${value}`} </span>),
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <div>
                    {record.status !== 'CLOSED' && record.status !== 'DONE' &&
                    <Button onClick={() => this.setState({selected_menu: null, selected_purchase: record})}>Update</Button>}
                    <Divider type="vertical"/>
                    {record.status === 'IN_PROGRESS' &&
                    <Button type='primary' onClick={this.completePurchase(record)}>Complete purchase</Button>}
                    <Divider type="vertical"/>
                    {record.status === 'IN_PROGRESS' &&
                    <Button type='danger' onClick={this.failPurchase(record)}>Close purchase with fail</Button>}
                </div>
            ),
        },
    ];

    completePurchase = (purchase) => (e) => {
        purchase.status = 'DONE';
        putData(`api/purchase/${purchase.id}`, purchase)
            .then(result => {
                if (result.status === 200) {
                    this.refreshTableData()
                } else {
                    message.warning(`Unable to complete purchase ${purchase.id}`)
                }
            })
            .catch(ex => {
                message.error(`Error when complete purchase ${ex}`)
                // this.refreshTableData()
            })
    };

    failPurchase = (purchase) => (e) => {
        purchase.status = 'NOT_DONE';
        putData(`api/purchase/${purchase.id}`, purchase)
            .then(result => {
                if (result.status === 200) {
                    this.refreshTableData()
                } else {
                    message.warning(`Unable to complete purchase ${purchase.id}`)
                }
            })
            .catch(ex => {
                message.error(`Error when complete purchase ${ex}`)
                // this.refreshTableData()
            })
    };

    getData = callback => {
        getData(`api/purchase/`)
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

    menuClick = (e) => {
        this.setState({
            selected_menu: e.key,
            loading: true
        });
        this.refreshTableData()
    };

    render_content = () => {
        const {selected_menu, selected_purchase} = this.state;
        if (selected_menu === "1") {
            return this.render_table()
        } else if (selected_purchase) {
            return this.render_purchase_edit(selected_purchase)
        } else {
            return <Empty/>
        }
    };

    render_table = () => {
        const {loading, list} = this.state;
        return <Table loading={loading} columns={this.columns}
                      dataSource={list} rowKey={(record) => record.id}/>
    };

    render() {
        return <div>
            <Layout>
                <Layout.Sider>
                    <Menu
                        onClick={this.menuClick}
                        style={{width: 200}}
                        defaultSelectedKeys={['1']}
                        defaultOpenKeys={['1']}
                        mode="inline"
                    >
                        <Menu.Item key="1" className='menu'>Purchases</Menu.Item>
                    </Menu>
                </Layout.Sider>
                <Layout.Content>
                    {this.render_content()}
                </Layout.Content>
            </Layout>
        </div>
    }

    render_purchase_edit = (selected_purchase) => {
        return <AdministratorPurchaseEdit purchase={selected_purchase}/>
    };

    componentDidMount() {
        this.getData(res => {
            this.setState({
                list: res,
            });
        });
    }
}

export default AdministratorView
