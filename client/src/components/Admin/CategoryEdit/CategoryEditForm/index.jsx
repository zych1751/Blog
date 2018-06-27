import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import sessionStorage from 'sessionstorage';
import './CategoryEditForm.scss';

class CategoryEditForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            category: '',
            subCategory: ''
        };

        this.handleChangeField = this.handleChangeField.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChangeField(key, event) {
        this.setState({
            [key]: event.target.value
        });
    }

    handleSubmit() {
        const { onSubmit, onEdit } = this.props;
        const { category, subCategory } = this.state;

        const token = sessionStorage.getItem('jwtToken');

        return axios.post(API_SERVER_URL+'/api/category', {
            category: category,
            subCategory: subCategory,
            token: token
        })
        .then((res) => onSubmit(res.data))
        .then(() => this.setState({ category: '', subCategory: ''}));
    }

    render() {
        const { category, subCategory } = this.state;

        return (
            <div className="category-form-container">
                <div className="category-form input-group input-group-lg">
                    <input 
                        onChange={(ev) => this.handleChangeField('category', ev)}
                        value={category}
                        placeholder="category" 
                        className="form-control"
                    />
                </div>
                <div className="category-form input-group input-group-lg">
                    <input
                        onChange={(ev) => this.handleChangeField('subCategory', ev)}
                        value={subCategory}
                        placeholder="subCategory" 
                        className="form-control"
                    />
                </div>
                <button onClick={this.handleSubmit} className="btn btn-secondary float-right category-form-button">Submit</button>
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch) => ({
    onSubmit: (data) => dispatch({ type: 'SUBMIT_CATEGORY', data }),
});

export default connect(null, mapDispatchToProps)(CategoryEditForm);
