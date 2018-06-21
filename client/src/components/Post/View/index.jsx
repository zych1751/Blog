import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import ReactMarkdown from 'react-markdown';
import './View.scss';

class View extends React.Component {
    componentDidMount() {
        const postId = this.props.match.params.id;
        const { postChange } = this.props;

        axios.get(API_SERVER_URL+'/api/post', {
            params: {
                id: postId
            }
        })
        .then((res) => {
            postChange(res.data);
        }).catch((err) => {
            console.log(err);
        });
    }

    render() {
        const { title, contents } = this.props
        return (
            <div className="post-view-container">
                <div className="post-view-title">
                    {title}
                </div>
                <div className="post-view-contents">
                    <ReactMarkdown source={contents}/>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return ({
        title: state.post.title,
        contents: state.post.contents
    });
}

const mapDispatchToProps = (dispatch) => {
    return ({
        postChange: (data) => {
            return dispatch({ type: 'POST_CHANGED', data })
        }
    });
}

export default connect(mapStateToProps, mapDispatchToProps)(View);
