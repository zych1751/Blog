import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import sessionStorage from 'sessionstorage';

import CategoryEditForm from './CategoryEditForm';

class CategoryEdit extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const { onLoad } = this.props;

        axios.get(API_SERVER_URL + '/api/category/list', {
            params: {
                token: sessionStorage.getItem('jwtToken')
            }
        }).then((res) => {
            onLoad(res.data);
        });
    }

    render() {
        if(this.props.admin === false) {
            return (<Redirect to="/" />)
        }

        const { categoryList } = this.props;
        if(typeof categoryList === 'undefined') {
            return null;
        }

        return (
            <div>
                <CategoryEditForm />
                { categoryList.map((category) => {
                    return (<div key={category._id}>
                        {category.category}
                        <br />
                        {category.subCategory}
                    </div>);
                })}
            </div>
        );
    }
};

const mapStateToProps = (state) => {
    return ({
        categoryList: state.admin.categoryList,
        admin: state.account.admin
    });
}

const mapDispatchToProps = (dispatch) => {
    return ({
        onLoad: (data) => {
            return dispatch({ type: 'ADMIN_CATEGORY_LOADED', data });
        }
    });
}

export default connect(mapStateToProps, mapDispatchToProps)(CategoryEdit);
