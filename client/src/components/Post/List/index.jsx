import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { Route, Link } from 'react-router-dom';
import './List.scss';

class List extends React.Component {
    componentDidMount() {
        const { onLoad } = this.props;

        if(typeof this.props.postList === "undefined") {
            axios.get(API_SERVER_URL+'/api/post/list')
            .then((res) => {
                onLoad(res.data);
            });
        }

        this.handlePostChange = this.handlePostChange.bind(this);
    }

    handlePostChange(postId) {
        const { postChange } = this.props;

        axios.get(API_SERVER_URL+'/api/post', {
            params: {
                id: postId
            }
        })
        .then((res) => {
            postChange(res.data);
        });
    }

    render() {
        var { postList } = this.props;

        if(typeof postList === "undefined") {
            postList = [];
        }

        return (
            <div className="post-list-container">
                <h2>글 목록</h2>
                <ul>
                    { 
                        postList.map((post) => {
                            return (<li key={post._id}>
                                <Link to={`/blog/${post._id}`} onClick={()=>this.handlePostChange(post._id)}>{post.title}</Link>
                            </li>);
                        })
                    }
                </ul>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return ({
        postList: state.post.list
    });
}

const mapDispatchToProps = (dispatch) => {
    return ({
        onLoad: (data) => {
            return dispatch({ type: 'POST_LIST_LOADED', data });
        },
        postChange: (data) => {
            return dispatch({ type: 'POST_CHANGED', data })
        }
    });
}

export default connect(mapStateToProps, mapDispatchToProps)(List);
