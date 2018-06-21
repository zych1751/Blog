import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import sessionStorage from 'sessionstorage';

class Login extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: ''
        }

        this.handleChangeField = this.handleChangeField.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
    }

    handleChangeField(key, event) {
        this.setState({
            [key]: event.target.value
        });
    }

    handleLogin() {
        const { handleLogin } = this.props;

        axios.post(API_SERVER_URL+'/api/account/signin', {
            username: this.state.username,
            password: this.state.password
        }).then((res) => {
            sessionStorage.setItem('jwtToken', res.data.token);
            handleLogin(res.data);
        }).catch((err) => {
            alert("아이디나 비밀번호가 틀렸습니다.");
        });
    }

    render() {
        if(this.props.login) {
            return (<Redirect to="/" />);
        }

        const { username, password } = this.state;

        return (
            <div className="container">
                <div>
                    <input 
                        onChange={(ev) => this.handleChangeField('username', ev)}
                        value={username}
                        placeholder="id" 
                    />
                </div>
                <div>
                    <input 
                        type="password" 
                        onChange={(ev) => this.handleChangeField('password', ev)}
                        value={password}
                        placeholder="password" 
                    />
                </div>
                <button onClick={()=>this.handleLogin()}>로그인</button>
            </div>
        );
    }
};

const mapStateToProps = (state) => {
    return ({
        login: state.account.login,
        admin: state.account.admin
    });
}

const mapDispatchToProps = (dispatch) => {
    return ({
        handleLogin: (data) => {
            return dispatch({ type: 'LOGIN', data });
        },
    });
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
