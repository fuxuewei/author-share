import React from 'react';
import Home from './Home';

const map = {
    '/': Home,
};

export default function Wrapper(props) {
    let path = props.location.pathname;
    if (path !== '/') {
        path = path.replace(/\/$/, '');
    }

    let Page = map[path];
    return <Page {...props} />;
}