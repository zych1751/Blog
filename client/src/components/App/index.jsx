import React from 'react';
import { Switch, Route } from 'react-router-dom';

import { Blog, Header, Login, Admin, Register, Confirm, Footer } from '../../components';

const App = (props) => {
  return (
    <div className="app">
      <Header />
      <Switch>
        <Route exact path="/" component={Blog} />
        <Route path="/blog" component={Blog} />
        <Route path="/login" component={Login} />
        <Route path="/admin" component={Admin} />
      </Switch>
      <Footer />
    </div>
  );
};

export default App;
