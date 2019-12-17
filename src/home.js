import React from 'react';

import {Button, Layout, PageHeader} from 'antd';
import {Row, Col} from 'antd';
import {Link} from "react-router-dom";

const {Header} = Layout;

class Home extends React.Component {
    render() {
        return <div
            style={{
                backgroundColor: '#F5F5F5',
                padding: 24,
            }}
        >
            <PageHeader
                ghost={false}
                title="Wine shop"
                extra={[
                    <Button key="login" href={"/login"}>Login/Register</Button>,
                    <Button key="lc" href={"/private"}>User cabinet</Button>,
                ]}
            >
            </PageHeader>
        </div>
    }
}

export default Home
