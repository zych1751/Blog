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
        this.handlePageChange = this.handlePageChange.bind(this);
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

    handlePageChange(num) {
        const { categoryId, onLoad } = this.props;
        const params = {
            page: num,
        };
        if(typeof categoryId !== "undefined") {
            params["categoryId"] = categoryId;
        }

        axios.get(API_SERVER_URL+'/api/post/list', {params: params})
        .then((res) => {
            onLoad(res.data);
        });
    }

    render() {
        let { postList } = this.props;
        const { endPage } = this.props;
        const pageNumberList = [];

        if(typeof endPage !== "undefined") {
            for(var i = 1; i <= this.props.endPage; i++) {
                pageNumberList.push(i);
            }
        }

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
                <nav>
                    <ul className="pagination justify-content-center">
                        {
                            pageNumberList.map((num) => {
                                const active = (num == this.props.currentPage) ? "active" : "";
                                return (<li key={num} className={"page-item " + active}><a className="page-link" href="#" onClick={()=>this.handlePageChange(num)}>
                                    {num}
                                </a></li>);
                            })
                        }
                    </ul>
                </nav>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return ({
        postList: state.post.list,
        currentPage: state.post.currentPage,
        endPage: state.post.endPage,
        postNumInPage: state.post.postNumInPage,
        categoryId: state.post.categoryId
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
