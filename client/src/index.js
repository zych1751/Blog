import React from 'react';
import ReactDOM from 'react-dom';
import history from './history/history';
import { Provider } from 'react-redux';
import { Route, Switch, Router } from 'react-router-dom';

import store from './store';
import { App } from './components';

import '../resources/style.scss';
import './clean-blog-templage/scss/clean-blog.scss';
import './clean-blog-templage/js/clean-blog';

ReactDOM.render(
    <Router history={history}>
        <Provider store={store}>
            <Switch>
                <Route path="/" component={App} />
            </Switch>
        </Provider>
    </Router>,
    document.getElementById('root')
);
