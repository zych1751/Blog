import React from 'react';
import { withRouter, Switch, Route } from 'react-router-dom';

import { Home, Header, Login, Admin } from '../../components';
import './app.scss';

const App = (props) => {
    return (
        <div className="app container">
            <Header />
            <Switch>
                <Route exact path="/" component={Home} />
                <Route path="/login" component={Login} />
                <Route path="/admin" component={Admin} />
                <Route path="/blog" component={Home} />
            </Switch>
        </div>
    );
}

export default App;
