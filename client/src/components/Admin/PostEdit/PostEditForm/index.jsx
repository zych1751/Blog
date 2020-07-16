import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import sessionStorage from 'sessionstorage';
import ReactMarkdown from 'react-markdown';
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
        this.handleChangeCategoryId = this.handleChangeCategoryId.bind(this);
        this.onUnload = this.onUnload.bind(this);

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

    componentDidMount() {
        window.addEventListener("beforeunload", this.onUnload);
    }

    componentWillUnmount() {
        window.removeEventListener("beforeunload", this.onUnload);
    }

    onUnload(event) {
        if(this.state.title !== '' || this.state.body !== '' || this.state.category !== '')
            event.returnValue = "";
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

    handleChangeCategoryId(subCategoryList, event) {
        subCategoryList.filter((item) => item.name === event.target.value);
        if(subCategoryList.length > 0) {
            this.setState({
                categoryId: subCategoryList[0].id
            });
        }
    }

    handleSubmit() {
        const { onSubmit, postToEdit, onEdit } = this.props;
        const { title, body, categoryId } = this.state;

        const token = sessionStorage.getItem('jwtToken');

        if(!postToEdit) {
            return axios.post(API_SERVER_URL+'/api/post', {
                title: title,
                contents: body,
                categoryId: categoryId,
                token: token
            })
            .then((res) => {
                alert("작성되었습니다!");
                this.setState({ title: '', body: '' , category: '', subCategory: ''});
                onSubmit(res.data.post);
            });
        } else {
            return axios.put(`${API_SERVER_URL}/api/post/${postToEdit.id}`, {
                title: title,
                contents: body,
                token: token
            })
            .then((res) => {
                alert("수정되었습니다!");
                this.setState({ title: '', body: '', category: '', subCategory: ''})
                onEdit(res.data)
            });
        }
    }

    render() {
        const { title, body } = this.state;
        const { postToEdit, categoryList } = this.props;

        if(typeof categoryList === 'undefined') {
            return null;
        }

        const mainCategoryList = [...new Set(categoryList.map((item) => {
            return item.category
        }))];
        let subCategoryList = categoryList
            .filter((item) => { return item.category.name === this.state.category})
            .map((item) => item.subCategoryList);
        if(subCategoryList.length > 0)
            subCategoryList = subCategoryList[0];
        else
            subCategoryList = [];

        return (
            <div className="post-form-container">
                <div className="form-row post-form-category-container">
                    <div className="col-2">
                        <select 
                            onChange={(ev) => this.handleChangeCategory(ev)}
                            className="form-control" value={this.state.category}>

                            <option></option>
                            {mainCategoryList.map((item) => {
                                return (<option key={item.id}>{item.name}</option>);
                            })}
                        </select>
                    </div>
                    <div className="col-2">
                        <select 
                            onChange={(ev) => {
                                this.handleChangeField('subCategory', ev)
                                this.handleChangeCategoryId(subCategoryList, ev)
                            }}
                            className="form-control" value={this.state.subCategory}>

                            <option></option>
                            {subCategoryList.map((item) => {
                                return (<option key={item.id}>{item.name}</option>);
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
                <div className="post-form input-group input-group-lg post-form-preview">
                    <ReactMarkdown source={body}/>
                </div>
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
