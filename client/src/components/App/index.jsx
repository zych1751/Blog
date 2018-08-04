import React from 'react';
import { withRouter, Switch, Route } from 'react-router-dom';

import { Blog, Header, Login, Admin, Register, Confirm } from '../../components';
import './app.scss';

const App = (props) => {
    const history = props.history;

    return (
        <div className="app">
            <Header />
            <Switch>
                <Route history={history} exact path="/" component={Blog} />
                <Route path="/login" component={Login} />
                <Route history={history} path="/register" component={Register} />
                <Route path="/admin" component={Admin} />
                <Route history={history} path="/blog" component={Blog} />
                <Route history={history} path="/confirm/:username/:code" component={Confirm} />
            </Switch>
        </div>
    );
}

export default App;
