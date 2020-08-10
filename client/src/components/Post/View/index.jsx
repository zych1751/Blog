import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import {MarkdownWithCodeHighlightView} from '../../Util';
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
    const { title, contents } = this.props;
    const category = this.props.category;
    if(!this.props.date)
      return null;
    const d = new Date(this.props.date);
    const utc = d.getTime() + (d.getTimezoneOffset() * 60000);
    const date = new Date(utc + (3600000*9)).toLocaleString(); // KST

    return (
      <div className="post-view-container">
        <div className="post-view-title">
          {title}
          <div className="post-view-category">
            {category ? (category.mainCategory.name + " > " + category.subCategory.name) : null}
            <br/>
            <i className="far fa-calendar" />{" " + date}
          </div>
        </div>
        <div className="post-view-contents">
          <MarkdownWithCodeHighlightView source={contents}/>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return ({
    title: state.post.title,
    contents: state.post.contents,
    category: state.post.category,
    date: state.post.date
  });
};

const mapDispatchToProps = (dispatch) => {
  return ({
    postChange: (data) => {
      return dispatch({ type: 'POST_CHANGED', data })
    }
  });
};

export default connect(mapStateToProps, mapDispatchToProps)(View);
