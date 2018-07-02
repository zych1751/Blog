import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';

import './CategoryList.scss';

class CategoryList extends Component {

    componentDidMount() {
        const { onLoad } = this.props;

        axios.get(API_SERVER_URL + '/api/category/list').then((res) => {
            onLoad(res.data);
        });
    }

    handleCategoryChange(categoryId) {
        const { history, categorySelect } = this.props;

        axios.get(API_SERVER_URL + '/api/post/list', {
            params: {
                categoryId: categoryId
            }
        }).then((res) => {
            res.data["categoryId"] = categoryId;
            categorySelect(res.data);
            history.push('/blog');
        });
    }

    render() {
        const { categoryList } = this.props;
        if(typeof categoryList === 'undefined') {
            return null;
        }
        const mainCategoryList = [...new Set(categoryList.map((item) => {
                return item.category
            }))];

        return (
            <div className="category-list">
                { mainCategoryList.map((mainCategory) => {
                    return (
                        <ul key={mainCategory}>
                            <li className="category-list root">
                                {mainCategory}
                            </li>
                            { 
                                categoryList.filter((item) => {
                                    return item.category == mainCategory;
                                }).map((item) => {
                                    return (<li key={item._id} className="category-list-item" onClick={()=>this.handleCategoryChange(item._id)}>{item.subCategory}</li>);
                                })
                            }
                        </ul>  
                    );
                })}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return ({
        categoryList: state.category.list,
    });
}

const mapDispatchToProps = (dispatch) => {
    return ({
        onLoad: (data) => {
            return dispatch({ type: 'CATEGORY_LOADED', data });
        }, categorySelect: (data) => {
            return dispatch({ type: 'POST_LIST_LOADED', data});
        }
    });
}

export default connect(mapStateToProps, mapDispatchToProps)(CategoryList);
