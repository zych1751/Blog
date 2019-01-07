import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import hist from '../../../history/history';

import './CategoryList.scss';

class CategoryList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mainCategory: null
    }
  }

  componentDidMount() {
    const { onLoad } = this.props;

    axios.get(API_SERVER_URL + '/api/category/list').then((res) => {
      onLoad(res.data);
    });
  }

  handleCategoryChange(categoryId, categoryName) {
    const { categorySelect } = this.props;

    axios.get(API_SERVER_URL + '/api/post/list', {
      params: {
        categoryId: categoryId
      }
    }).then((res) => {
      res.data["categoryId"] = categoryId;
      res.data["categoryName"] = categoryName;
      categorySelect(res.data);
      hist.push('/blog');
    });
  }

  render() {
    const { categoryList } = this.props;
    if(typeof categoryList === 'undefined') {
      return null;
    }
    const mainCategoryList = [...new Set(categoryList.map((item) => {
      return item.category;
    }))];
    const subCategoryList = categoryList.filter((item) => { return item.category === this.state.mainCategory});

    return (
      <div className="category-list">
        <div className="category-nav">
          <ul className="list-tab">
          { mainCategoryList.map((mainCategory) => {
            return (
              <li key={mainCategory} className={`main-category-item ${mainCategory===this.state.mainCategory?'active':''}`}
                    onClick={() => {this.setState({mainCategory: mainCategory})}}>
                {mainCategory}
              </li>
            );
          })}
          </ul>
        </div>
        {subCategoryList.length > 0 ?
          (<div className="sub-category-list">
            {subCategoryList.map((item => {
              return (<span key={item._id} className="sub-category-item" onClick={() => this.handleCategoryChange(item._id, item.subCategory)}>
              {item.subCategory}
              </span>)
            }))}
          </div>) :
          null
        }
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return ({
    categoryList: state.category.list,
  });
};

const mapDispatchToProps = (dispatch) => {
  return ({
    onLoad: (data) => {
      return dispatch({ type: 'CATEGORY_LOADED', data });
    }, categorySelect: (data) => {
      return dispatch({ type: 'POST_LIST_LOADED', data});
    }
  });
};

export default connect(mapStateToProps, mapDispatchToProps)(CategoryList);
