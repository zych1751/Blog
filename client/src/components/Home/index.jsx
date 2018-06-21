import React from 'react';
import { Route } from 'react-router-dom';
import { PostList, PostView } from '../Post';

class Home extends React.Component {
    render() {
        return (
            <div className="container">
                <Route path="/blog/:id" component={PostView} />
                <Route path="/blog" component={PostList} />
            </div>
        );
    }
};

export default Home;
