import React, {Component} from 'react';
import {Empty, Layout, Menu} from 'antd';
import {getData} from "../../http";
import ManagerStockTable from "./ManagerStockTable";
import ManagerClientsTable from "./ManagerClientsTable";
import ManagerOrdersTable from "./ManagerOrdersTable";
import ManagerPurchasesTable from "./ManagerPurchasesTable";
import ManagerNewPurchase from "./ManagerNewPurchase";

class ManagerView extends Component {

    state = {
        selected_menu: null,
        manager: null,
    };

    getData = callback => {
        getData(`api/manager/${this.props.user.login}`)
            .then(result => {
                if (result.status === 200) {
                    callback(result.data)
                }
            })
    };

    componentDidMount() {
        this.getData(res => {
            this.setState({
                manager: res,
            });
        });
    }

    menuClick = (e) => {
        this.setState({
            selected_menu: e.key
        });
        this.getData(res => {
            this.setState({
                manager: res,
            });
        });
    };

    render_content = () => {
        const {selected_menu} = this.state;
        if (selected_menu === "order") {
            return this.render_order()
        } else if (selected_menu === "stock") {
            return this.render_stock()
        } else if (selected_menu === "clients") {
            return this.render_clients()
        } else if (selected_menu === "purchase") {
            return this.render_purchase()
        } else if (selected_menu === "newPurchase") {
            return this.render_new_purchase()
        } else {
            return <Empty/>
        }
    };

    render_order = () => {
        return <ManagerOrdersTable user={this.state.manager}/>
    };

    render_stock = () => {
        return <ManagerStockTable user={this.state.manager}/>
    };

    render_clients = () => {
        return <ManagerClientsTable user={this.state.manager}/>
    };

    render_purchase = () => {
        return <ManagerPurchasesTable user={this.state.manager}/>
    };

    render_new_purchase = () => {
        return <ManagerNewPurchase user={this.state.manager}/>
    };

    render() {
        return <div>
            <Layout>
                <Layout.Sider>
                    <Menu
                        onClick={this.menuClick}
                        style={{width: 200}}
                        defaultSelectedKeys={['order']}
                        defaultOpenKeys={['order']}
                        mode="inline"
                    >
                        <Menu.Item key="order" className='menu'>Orders</Menu.Item>
                        <Menu.Item key="stock" className='menu'>Stock</Menu.Item>
                        <Menu.Item key="clients" className='menu'>Clients</Menu.Item>
                        <Menu.Item key="purchase" className='menu'>Purchases</Menu.Item>
                        <Menu.Item key="newPurchase" className='menu'>Create a purchase</Menu.Item>
                    </Menu>
                </Layout.Sider>
                <Layout.Content>
                    {this.render_content()}
                </Layout.Content>
            </Layout>
        </div>
    }
}

export default ManagerView
