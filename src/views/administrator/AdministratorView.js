import React, {Component} from 'react';
import {Empty, Layout, Menu} from 'antd';
import {getData} from "../../http";
import AdministratorPurchasesTable from "./AdministratorPurchasesTable";

class AdministratorView extends Component {

    state = {
        selected_menu: null,
        administrator: null,
    };

    getData = callback => {
        getData(`api/administrator/${this.props.user.login}`)
            .then(result => {
                if (result.status === 200) {
                    callback(result.data)
                }
            })
    };

    componentDidMount() {
        this.getData(res => {
            this.setState({
                administrator: res,
            });
        });
    }

    menuClick = (e) => {
        this.setState({
            selected_menu: e.key
        });
        this.getData(res => {
            this.setState({
                administrator: res,
            });
        });
    };

    render_content = () => {
        const {selected_menu} = this.state;
        if (selected_menu === "purchase") {
            return this.render_purchase()
        } else {
            return <Empty/>
        }
    };

    render_purchase = () => {
        return <AdministratorPurchasesTable user={this.state.administrator}/>
    };

    render() {
        return <div>
            <Layout>
                <Layout.Sider>
                    <Menu
                        onClick={this.menuClick}
                        style={{width: 256}}
                        defaultSelectedKeys={['purchase']}
                        defaultOpenKeys={['purchase']}
                        mode="inline"
                    >
                        <Menu.Item key="purchase">Purchases</Menu.Item>
                    </Menu>
                </Layout.Sider>
                <Layout.Content>
                    {this.render_content()}
                </Layout.Content>
            </Layout>
        </div>
    }
}

export default AdministratorView
