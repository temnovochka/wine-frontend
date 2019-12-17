import React from 'react';

function UserView(props) {
    return <div>
        I am user
        {JSON.stringify(props.user)}
    </div>
}

export default UserView