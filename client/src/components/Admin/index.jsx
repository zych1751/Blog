import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Header from './Header';
import PostEdit from './PostEdit';
import CategoryEdit from './CategoryEdit';

const Admin = (props) => {
    return (
        <div className="container">
            <Header />
            <Switch>
                <Route exact path="/admin" component={PostEdit} />
                <Route path="/admin/category" component={CategoryEdit} />
            </Switch>
        </div>
    );
};

export default Admin;
