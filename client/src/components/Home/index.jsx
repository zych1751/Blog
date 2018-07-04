import React from 'react';
import { Route } from 'react-router-dom';
import { PostList, PostView } from '../Post';
import { CategoryList } from '../Category';
import './Home.scss';

class Home extends React.Component {

    constructor(props) {
        super(props);

        if(!props.location.pathname.startsWith('/blog'))
            props.history.push('/blog');
    }

    render() {
        const { history } = this.props;
        return (
            <div className="container">
                <div className="post">
                    <Route history={history} path="/blog/:id" component={PostView} />
                    <Route history={history} path="/blog" component={PostList} />
                </div>
                <div className="category">
                    <CategoryList history={history} />
                </div>
            </div>
        );
    }
};

export default Home;
