import React, {Component} from 'react';
import {Empty, Layout, Menu, Badge, Icon} from 'antd';
import {getData} from "../../http";
import ClientProfile from "./ClientProfile";
import ClientStockTable from "./ClientStockTable";
import ClientOrderList from "./ClientOrderList";

class ClientView extends Component {

    state = {
        selected_menu: null,
        client: null,
    };

    getData = callback => {
        getData(`api/client/${this.props.user.login}`)
            .then(result => {
                if (result.status === 200) {
                    callback(result.data)
                }
            })
    };

    componentDidMount() {
        this.getData(res => {
            this.setState({
                client: res,
            });
        });
    }

    menuClick = (e) => {
        this.setState({
            selected_menu: e.key
        });
        this.getData(res => {
            this.setState({
                client: res,
            });
        });
    };

    render_content = () => {
        const {selected_menu} = this.state;
        if (selected_menu === "profile") {
            return this.render_profile()
        } else if (selected_menu === "order") {
            return this.render_order()
        } else if (selected_menu === "stock") {
            return this.render_stock()
        } else {
            return <Empty/>
        }
    };

    render_profile = () => {
        return <ClientProfile user={this.state.client}/>
    };

    render_order = () => {
        return <ClientOrderList user={this.state.client}/>
    };

    render_stock = () => {
        return <ClientStockTable user={this.state.client}/>
    };

    render() {
        const {client} = this.state;
        return <div>
            <Layout>
                <Layout.Sider>
                    <Menu
                        onClick={this.menuClick}
                        style={{width: 256}}
                        defaultSelectedKeys={['profile']}
                        defaultOpenKeys={['profle']}
                        mode="inline"
                    >
                        <Menu.Item key="profile">My profile</Menu.Item>
                        {client?.isConfirmed && <Menu.Item key="order">My Orders</Menu.Item>}
                        {client?.isConfirmed && <Menu.Item key="stock">Create a new order</Menu.Item>}
                    </Menu>
                </Layout.Sider>
                <Layout.Content>
                    {this.render_content()}
                </Layout.Content>
            </Layout>
        </div>
    }
}

export default ClientView
