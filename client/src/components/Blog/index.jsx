import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { PostList, PostView } from '../Post';
import { CategoryList } from '../Category';

class Blog extends React.Component {
  constructor(props) {
    super(props);

    if(!props.location.pathname.startsWith('/blog'))
      props.history.push('/blog');
  }

  render() {
    return (
      <div className="container">
        <div>
          <CategoryList />
        </div>
        <div>
          <Switch>
            <Route path="/blog/:id" component={PostView} />
            <Route path="/blog" component={PostList} />
          </Switch>
        </div>
      </div>
    );
  }
}

export default Blog;
