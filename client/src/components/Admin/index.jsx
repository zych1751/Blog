import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import sessionStorage from 'sessionstorage';

import { PostForm } from '../../components/Post';

class Admin extends React.Component {
    constructor(props) {
        super(props);

        this.handleDelete = this.handleDelete.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
    }

    componentDidMount() {
        const { onLoad } = this.props;

        axios(API_SERVER_URL+'/api/post/list').then((res) => {
            onLoad(res.data);
        });
    }

    handleDelete(id) {
        const { onDelete } = this.props;

        return axios.delete(`${API_SERVER_URL}/api/post/${id}`, {
            token: sessionStorage.getItem('jwtToken')
        })
        .then(() => onDelete(id))
    }

    handleEdit(post) {
        const { setEdit } = this.props;

        setEdit(post);
    }

    render() {
        if(!this.props.admin) {
            return (<Redirect to="/" />)
        }

        const posts = (typeof this.props.posts === 'undefined') ? [] : this.props.posts;

        return (
            <div>
                <PostForm />
                <div>
                    {posts.map((post) => {
                        return (
                            <div key={post._id}>
                                <div>
                                    {post.title}
                                </div>
                                <div>
                                    {post.contents}
                                </div>
                                <div>
                                    {new Date(post.date.created).toLocaleDateString()}
                                </div>
                                <div>
                                    <button onClick={() => this.handleEdit(post)}>
                                        Edit
                                    </button>
                                    <button onClick={() => this.handleDelete(post._id)}>
                                        Delete
                                    </button>
                                </div>
                            </div>
                        );
                    })} 
                </div>
            </div>
        );
    }
};

const mapStateToProps = (state) => {
    return ({
        posts: state.admin.posts,
        admin: state.account.admin
    });
}

const mapDispatchToProps = (dispatch) => {
    return ({
        onLoad: (data) => {
            return dispatch({ type: 'HOME_PAGE_LOADED', data });
        },
        onDelete: (id) => dispatch({ type: 'DELETE_POST', id }),
        setEdit: (post) => dispatch({ type: 'SET_EDIT', post })
    });
}

export default connect(mapStateToProps, mapDispatchToProps)(Admin);
