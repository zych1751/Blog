import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import sessionStorage from 'sessionstorage';
import { Link } from 'react-router-dom';
import './Login.scss';

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
            <div className="login-container">
                <div className="login-container2">
                    <div className="login-input-container">
                        id <br />
                        <input 
                            onChange={(ev) => this.handleChangeField('username', ev)}
                            value={username}
                            className="login-input"
                        />
                    </div>
                    <div className="login-input-container">
                        password <br />
                        <input 
                            type="password" 
                            onChange={(ev) => this.handleChangeField('password', ev)}
                            value={password}
                            className="login-input"
                        />
                    </div>
                    <button className="login-button" onClick={()=>this.handleLogin()}>로그인</button>

                    <div className="login-register-container">
                        처음이신가요? &nbsp;
                        <Link to="/register">
                            회원가입
                        </Link>
                    </div>
                </div>
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
