import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { PostList, PostView } from '../Post';

class Home extends React.Component {
  render() {
    if(location.pathname === '/') {
      return <Redirect to="/blog"/>;
    }

    return (
      <div className="container">
        <Route path="/blog/:id" component={PostView} />
        <Route path="/blog" component={PostList} />
      </div>
    );
  }
}

export default Home;
