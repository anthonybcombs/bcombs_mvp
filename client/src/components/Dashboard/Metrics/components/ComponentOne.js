import React, { useEffect, useState } from 'react'

const apiCall = async (id) => {

    // Default options are marked with *
    const response = await fetch('http://localhost:3001/api/metrics', {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify({
            id
        }) // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects


}

const ComponentOne = props => {
    const { auth } = props;
    const [currentUser, setCurrentUser] = useState(null);
    useEffect(() => {
        const triggerApi = async (id) => {
            try {
                const res = await apiCall(id);
                console.log('apiCall rees', res)
                if (res && res.user) {

                    setCurrentUser(res.user);
                }
            } catch (err) {
                console.log('Error', err)
            }
        };
        if (auth && auth.user_id) {
            triggerApi(auth.user_id)
        }
    }, [auth]);
    console.log('Current User', currentUser);

    return <div style={{ padding: 24 }}>
        Menu One
        <span>Value {currentUser && currentUser.id2}</span>
    </div>
}

export default ComponentOne;