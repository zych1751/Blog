import React from 'react';
import { withRouter, Switch, Route } from 'react-router-dom';

import { Home, Header, Login, Admin, Register } from '../../components';
import './app.scss';

const App = (props) => {
    const history = props.history;

    return (
        <div className="app">
            <Header />
            <Switch>
                <Route history={history} exact path="/" component={Home} />
                <Route path="/login" component={Login} />
                <Route path="/register" component={Register} />
                <Route path="/admin" component={Admin} />
                <Route history={history} path="/blog" component={Home} />
            </Switch>
        </div>
    );
}

export default App;
