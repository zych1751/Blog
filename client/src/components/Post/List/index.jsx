import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { Route, Link } from 'react-router-dom';
import './List.scss';

class List extends React.Component {
  componentDidMount() {
    const { onLoad } = this.props;

    axios.get(API_SERVER_URL+'/api/post/list')
      .then((res) => {
        onLoad(res.data);
      });
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
    const { categoryId, categoryName, onLoad } = this.props;
    const params = {
      page: num,
    };
    if(typeof categoryId !== "undefined") {
      params["categoryId"] = categoryId;
    }

    axios.get(API_SERVER_URL+'/api/post/list', {params: params})
      .then((res) => {
        res.data["categoryId"] = categoryId;
        res.data["categoryName"] = categoryName;
        onLoad(res.data);
      });
  }

  render() {
    let { postList } = this.props;
    const { endPage } = this.props;
    const pageNumberList = [];

    if(typeof endPage !== "undefined") {
      for(let i = 1; i <= this.props.endPage; i++) {
        pageNumberList.push(i);
      }
    }

    if(typeof postList === "undefined") {
      postList = [];
    }

    return (
      <div className="post-list-container">
        <h3>{this.props.categoryName ? this.props.categoryName : "전체 글"}</h3>
        <div className="post-list">
          {
            postList.map((post) => {
              // TODO: contens를 대신할 preview를 만들기
              let contents = post.contents;
              if(contents.length >= 150) {
                contents = contents.slice(0, 150) + '...';
              }

              return (<div key={post._id} className="post-list-item">
                <h4><Link to={`/blog/${post._id}`} onClick={()=>this.handlePostChange(post._id)}>{post.title}</Link></h4>
                <div className="post-list-calendar">
                  <i className="far fa-calendar" />{" " + post.date.created.slice(0, 10)}
                </div>
                <div className="post-list-contents">
                  <Link to={`/blog/${post._id}`} onClick={()=>this.handlePostChange(post._id)}>
                    {contents}
                  </Link>
                </div>
              </div>);
            })
          }
        </div>
        <nav>
          <ul className="pagination justify-content-center modal-3">
            {
              pageNumberList.map((num) => {
                const active = (num === this.props.currentPage) ? "active" : "";
                return (<li key={num}>
                  <a className={active} href="#" onClick={(e)=>{
                    e.preventDefault();
                    this.handlePageChange(num);
                  }}>
                    {num}
                  </a>
                </li>);
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
    categoryId: state.post.categoryId,
    categoryName: state.post.categoryName
  });
};

const mapDispatchToProps = (dispatch) => {
  return ({
    onLoad: (data) => {
      return dispatch({ type: 'POST_LIST_LOADED', data });
    },
    postChange: (data) => {
      return dispatch({ type: 'POST_CHANGED', data })
    }
  });
};

export default connect(mapStateToProps, mapDispatchToProps)(List);
