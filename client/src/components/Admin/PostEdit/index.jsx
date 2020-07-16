import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import sessionStorage from 'sessionstorage';

import PostEditForm from './PostEditForm';

class PostEdit extends React.Component {
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

        if(!confirm("지우시겠습니까?")) {
            return;
        }

        return axios.delete(`${API_SERVER_URL}/api/post/${id}`, {
            data: {
                token: sessionStorage.getItem('jwtToken')
            }
        })
        .then(() => onDelete(id))
    }

    async handleEdit(post) {
        const { setEdit } = this.props;

        const res = await axios.get(API_SERVER_URL + '/api/category', {
            params: {
                id: post.subCategory.id
            }
        });

        setEdit({
            ...post,
            category: res.data.category.name,
            subCategory: res.data.subCategory.name
        });
    }

    render() {
        if(this.props.admin === false) {
            return (<Redirect to="/" />)
        }

        const posts = (typeof this.props.posts === 'undefined') ? [] : this.props.posts;

        return (
            <div>
                <PostEditForm />
                <div>
                    {posts.map((post) => {
                        return (
                            <div key={post.id}>
                                <div>
                                    {post.title}
                                </div>
                                <div>
                                    {post.contents}
                                </div>
                                <div>
                                    {new Date(post.createdAt).toLocaleDateString()}
                                </div>
                                <div>
                                    <button onClick={() => this.handleEdit(post)}>
                                        Edit
                                    </button>
                                    <button onClick={() => this.handleDelete(post.id)}>
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
        posts: state.post.list,
        admin: state.account.admin
    });
}

const mapDispatchToProps = (dispatch) => {
    return ({
        onLoad: (data) => {
            return dispatch({ type: 'POST_LIST_LOADED', data });
        },
        onDelete: (id) => dispatch({ type: 'DELETE_POST', id }),
        setEdit: (post) => dispatch({ type: 'SET_EDIT', post })
    });
}

export default connect(mapStateToProps, mapDispatchToProps)(PostEdit);
