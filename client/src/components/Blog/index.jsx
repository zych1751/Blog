import React from 'react';
import { Route } from 'react-router-dom';
import { PostList, PostView } from '../Post';
import { CategoryList } from '../Category';

class Blog extends React.Component {
  constructor(props) {
    super(props);

    if(!props.location.pathname.startsWith('/blog'))
      props.history.push('/blog');
  }

  render() {
    const { history } = this.props;
    return (
      <div className="container">
        <div>
          <CategoryList />
        </div>
        <div>
          <Route path="/blog/:id" component={PostView} />
          <Route path="/blog" component={PostList} />
        </div>
      </div>
    );
  }
}

export default Blog;
