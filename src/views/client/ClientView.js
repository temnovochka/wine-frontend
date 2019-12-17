import React, {Component} from 'react';
import {Empty, Layout, Menu} from 'antd';
import {getData} from "../../http";
import ClientProfile from "./ClientProfile";

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
        } else {
            return <Empty/>
        }
    };

    render_profile = () => {
        return <ClientProfile user={this.state.client}/>
    };

    render() {
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
