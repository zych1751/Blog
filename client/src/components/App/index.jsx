import React from 'react';
import { withRouter, Switch, Route } from 'react-router-dom';

import { Home, Header, Login, Admin } from '../../components';
import './app.scss';

const App = (props) => {
    return (
        <div className="app">
            <Header />
            <Switch>
                <Route exact path="/" component={Home} />
                <Route path="/login" component={Login} />
                <Route path="/admin" component={Admin} />
            </Switch>
        </div>
    );
}

export default App;
