import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import sessionStorage from 'sessionstorage';

class Form extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            title: '',
            body: ''
        };

        this.handleChangeField = this.handleChangeField.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.postToEdit) {
            this.setState({
                title: nextProps.postToEdit.title,
                body: nextProps.postToEdit.contents
            });
        }
    }

    handleChangeField(key, event) {
        this.setState({
            [key]: event.target.value
        });
    }

    handleSubmit() {
        const { onSubmit, postToEdit, onEdit } = this.props;
        const { title, body } = this.state;

        const token = sessionStorage.getItem('jwtToken');

        if(!postToEdit) {
            return axios.post(API_SERVER_URL+'/api/post', {
                title: title,
                contents: body,
                token: token
            })
            .then((res) => onSubmit(res.data))
            .then(() => this.setState({ title: '', body: '' }));
        } else {
            return axios.put(`${API_SERVER_URL}/api/post/${postToEdit._id}`, {
                title: title,
                contents: body,
                token: token
            })
            .then((res) => onEdit(res.data))
            .then(() => this.setState({ title: '', body: ''}));
        }
    }

    render() {
        const { title, body } = this.state;
        
        return (
            <div>
                <input 
                    onChange={(ev) => this.handleChangeField('title', ev)}
                    value={title}
                    placeholder="title" 
                />
                <textarea 
                    onChange={(ev) => this.handleChangeField('body', ev)}
                    value={body}
                    placeholder="contents" 
                />
                <button onClick={this.handleSubmit}>Submit</button>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    postToEdit: state.admin.postToEdit,
});

const mapDispatchToProps = (dispatch) => ({
    onSubmit: (data) => dispatch({ type: 'SUBMIT_POST', data }),
    onEdit: (data) => dispatch({ type: 'EDIT_POST', data })
});

export default connect(mapStateToProps, mapDispatchToProps)(Form);
