import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import sessionStorage from 'sessionstorage';
import './PostEditForm.scss';

class PostEditForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            title: '',
            body: '',
            category: '',
            subCategory: ''
        };

        this.handleChangeField = this.handleChangeField.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChangeCategory = this.handleChangeCategory.bind(this);

        const { onLoad } = this.props;

        axios.get(API_SERVER_URL + '/api/category/list', {
            params: {
                token: sessionStorage.getItem('jwtToken')
            }
        }).then((res) => {
            onLoad(res.data);
        });
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.postToEdit) {
            this.setState({
                title: nextProps.postToEdit.title,
                body: nextProps.postToEdit.contents,
                category: nextProps.postToEdit.category,
                subCategory: nextProps.postToEdit.subCategory
            });
        }
    }

    handleChangeField(key, event) {
        this.setState({
            [key]: event.target.value
        });
    }

    handleChangeCategory(event) {
        this.handleChangeField('category', event);
        this.state.subCategory = "";
    }

    handleSubmit() {
        const { onSubmit, postToEdit, onEdit } = this.props;
        const { title, body, category, subCategory } = this.state;

        const token = sessionStorage.getItem('jwtToken');

        if(!postToEdit) {
            return axios.post(API_SERVER_URL+'/api/post', {
                title: title,
                contents: body,
                category: category,
                subCategory: subCategory,
                token: token
            })
            .then((res) => onSubmit(res.data))
            .then(() => this.setState({ title: '', body: '' , category: '', subCategory: ''}));
        } else {
            return axios.put(`${API_SERVER_URL}/api/post/${postToEdit._id}`, {
                title: title,
                contents: body,
                category: category,
                subCategory: subCategory,
                token: token
            })
            .then((res) => onEdit(res.data))
            .then(() => this.setState({ title: '', body: '', category: '', subCategory: ''}));
        }
    }

    render() {
        const { title, body } = this.state;
        const { postToEdit, categoryList } = this.props;

        const mainCategoryList = categoryList ? 
            [...new Set(categoryList.map((item) => {
                return item.category
            }))] :
            [];
        const subCategoryList = categoryList ?
            [...new Set(categoryList.filter(item => this.state.category===item.category).map(item => item.subCategory))] :
            [];

        return (
            <div className="post-form-container">
                <div className="form-row post-form-category-container">
                    <div className="col-2">
                        <select 
                            onChange={(ev) => this.handleChangeCategory(ev)}
                            className="form-control" value={this.state.category}>

                            <option></option>
                            {mainCategoryList.map((item) => {
                                return (<option key={item}>{item}</option>);
                            })}
                        </select>
                    </div>
                    <div className="col-2">
                        <select 
                            onChange={(ev) => this.handleChangeField('subCategory', ev)}
                            className="form-control" value={this.state.subCategory}>

                            <option></option>
                            {subCategoryList.map((item) => {
                                return (<option key={item}>{item}</option>);
                            })}
                        </select>
                    </div>
                </div>

                <div className="post-form input-group input-group-lg">
                    <input 
                        onChange={(ev) => this.handleChangeField('title', ev)}
                        value={title}
                        placeholder="title" 
                        className="form-control"
                    />
                </div>
                <div className="post-form input-group input-group-lg">
                    <textarea 
                        onChange={(ev) => this.handleChangeField('body', ev)}
                        value={body}
                        placeholder="contents" 
                        className="form-control post-form-contents"
                    />
                </div>
                <button onClick={this.handleSubmit} className="btn btn-secondary float-right post-form-button">Submit</button>
                { (typeof postToEdit !== 'undefined') ? 
                    <button className="btn btn-danger float-right post-form-button" disabled>Editing</button>
                    : null }
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    postToEdit: state.admin.postToEdit,
    categoryList: state.admin.categoryList
});

const mapDispatchToProps = (dispatch) => ({
    onLoad: (data) => dispatch({ type: 'POST_FORM_LOAD', data }),
    onSubmit: (data) => dispatch({ type: 'SUBMIT_POST', data }),
    onEdit: (data) => dispatch({ type: 'EDIT_POST', data })
});

export default connect(mapStateToProps, mapDispatchToProps)(PostEditForm);
