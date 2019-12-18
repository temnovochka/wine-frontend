import React from 'react';
import {useAuth} from "./context/auth";
import {Button, PageHeader} from "antd";
import AdminView from "./views/admin/Admin";
import UserView from "./views/UserView";
import {ROLE_CLIENT, ROLE_MANAGER, ROLE_SYSTEM_ADMIN} from "./constants";
import ClientView from "./views/client/ClientView";
import ManagerView from "./views/manager/ManagerView";

function PrivateApp(props) {
    const {setAuthTokens} = useAuth();

    function logOut() {
        setAuthTokens();
        props.history.push("/");
    }

    function dispatch_views(role) {
        if (role === ROLE_SYSTEM_ADMIN) {
            return <AdminView {...props}/>
        } else if (role === ROLE_CLIENT) {
            return <ClientView {...props}/>
        } else if (role === ROLE_MANAGER) {
            return <ManagerView {...props}/>
        } else {
            return <UserView {...props}/>
        }
    }

    return <div>
        <PageHeader
            ghost={false}
            title="Private app"
            extra={[
                <Button key={0} onClick={logOut}>Log out</Button>
            ]}
        >
        </PageHeader>
        {dispatch_views(props.user.role)}
    </div>
}

export default PrivateApp
