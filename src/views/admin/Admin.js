import React, {Component} from 'react';
import {Button, Empty, Layout, Menu, Table, Tag} from 'antd';
import {getData} from "../../http";
import UserProfileEdit from "./UserProfileEdit";
import {
    ROLE_ADMINISTRATOR,
    ROLE_CLIENT,
    ROLE_MANAGER,
    ROLE_SYSTEM_ADMIN
} from "../../constants";

class AdminView extends Component {

    state = {
        loading: true,
        list: [],
        selected_user: null,
        selected_menu: null
    };

    columns = [
        {
            title: 'Login',
            dataIndex: 'login',
            key: 'login',
            render: text => <a>{text}</a>,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Role',
            key: 'role',
            dataIndex: 'role',
            render: tag => {
                const color_map = {};
                color_map[ROLE_SYSTEM_ADMIN] = 'volcano';
                color_map[ROLE_CLIENT] = 'green';
                color_map[ROLE_MANAGER] = 'geekblue';
                color_map[ROLE_ADMINISTRATOR] = 'yellow';
                const color = color_map[tag];
                return (
                    <Tag color={color} key={tag}>
                        {tag.toUpperCase()}
                    </Tag>
                );
            }
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <span>
        <Button onClick={() => this.setState({
            selected_menu: null,
            selected_user: record
        })}>
            Upgrade
        </Button>
      </span>
            ),
        },
    ];

    getData = callback => {
        getData('api/user/')
        .then(result => {
            if (result.status === 200) {
                callback(result.data)
            }
        })
    };

    menuClick = (e) => {
        this.setState({
            selected_menu: e.key,
            loading: true
        });
        this.getData(res => {
            this.setState({
                loading: false,
                list: res,
            });
        });
    };

    render_content = () => {
        const {selected_menu, selected_user} = this.state;
        if (selected_menu === "1") {
            return this.render_table()
        } else if (selected_user) {
            return this.render_user_edit(selected_user)
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
                        <Menu.Item key="1" className='menu'>Edit users</Menu.Item>
                    </Menu>
                </Layout.Sider>
                <Layout.Content>
                    {this.render_content()}
                </Layout.Content>
            </Layout>
        </div>
    }

    render_user_edit = (selected_user) => {
        return <UserProfileEdit user={selected_user}/>
    }
}

export default AdminView
