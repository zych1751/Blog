import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Header from './Header';
import PostEdit from './PostEdit';
import CategoryEdit from './CategoryEdit';
import ImageUpload from './ImageUpload';

const Admin = (props) => {
    return (
        <div className="container">
            <Header />
            <Switch>
                <Route exact path="/admin" component={PostEdit} />
                <Route path="/admin/category" component={CategoryEdit} />
                <Route path="/admin/image-upload" component={ImageUpload} />
            </Switch>
        </div>
    );
};

export default Admin;
