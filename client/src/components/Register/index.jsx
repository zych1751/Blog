import React from 'react';
import axios from 'axios';
import './Register.scss';

class Register extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: '',
            passwordCheck: '',
            email: '',

            usernameFail: '',
            passwordFail: '',
            passwordCheckFail: '',
            emailFail: ''
        }

        this.handleChangeField = this.handleChangeField.bind(this);
        this.handleRegister = this.handleRegister.bind(this);
    }

    handleChangeField(key, event) {
        this.setState({
            [key]: event.target.value
        });
    }

    handleRegister() {
        let frontCheck = true;
        const { username, password, passwordCheck, email } = this.state;

        if(username.length > 12 || username.length == 0) {
            // 아이디는 12자 이내로 비우지 말고 작성해주세요.
            this.setState({usernameFail: '\uC544\uC774\uB514\uB294 12\uC790\uC774\uB0B4\uB85C \uBE44\uC6B0\uC9C0 \uB9D0\uACE0 \uC791\uC131\uD574\uC8FC\uC138\uC694.'});
            frontCheck = false;
        } else {
            this.setState({usernameFail: ''});
        }

        if(password.length < 8 || password.length > 20) {
            // 비밀번호는 8~20자로 작성해주세요.
            this.setState({passwordFail: '\uBE44\uBC00\uBC88\uD638\uB294 8~20\uC790\uB85C \uC791\uC131\uD574\uC8FC\uC138\uC694.'});
            frontCheck = false;
        } else {
            this.setState({passwordFail: ''});
        }

        if(password !== passwordCheck) {
            // 비밀번호가 같지 않습니다.
            this.setState({passwordCheckFail: '\uBE44\uBC00\uBC88\uD638\uAC00 \uAC19\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4.'});
            frontCheck = false;
        } else {
            this.setState({passwordCheckFail: ''});
        }

        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if(!re.test(email.toLowerCase())) {
            // 이메일 형식을 다시 확인해주세요.
            this.setState({emailFail: '\uC774\uBA54\uC77C \uD615\uC2DD\uC744 \uB2E4\uC2DC \uD655\uC778\uD574\uC8FC\uC138\uC694.'});
            frontCheck = false;
        } else {
            this.setState({emailFail: ''});
        }

        if(!frontCheck)
            return;

        axios.post(API_SERVER_URL+'/api/account/signup', {
            username: username,
            password: password,
            email: email
        }).then((res) => {
            console.log(res);
            // 회원가입이 완료되었습니다! 이메일 인증을 완료하신 후 로그인을 해주세요
            alert('\uD68C\uC6D0\uAC00\uC785\uC774 \uC644\uB8CC\uB418\uC5C8\uC2B5\uB2C8\uB2E4! \uC774\uBA54\uC77C \uC778\uC99D\uC744 \uC644\uB8CC\uD558\uC2E0 \uD6C4 \uB85C\uADF8\uC778\uC744 \uD574\uC8FC\uC138\uC694');
            this.props.history.push('/login');
        }).catch((err) => {
            // USERNAME EXISTS
            if(err.response.data.code === 4) {
                // 아이디가 중복됩니다.
                this.setState({usernameFail: '\uC544\uC774\uB514\uAC00 \uC911\uBCF5\uB429\uB2C8\uB2E4.'});
            } else if(err.response.data.code === 5) {
                // 이메일이 중복됩니다.
                this.setState({emailFail: '\uC774\uBA54\uC77C\uC774 \uC911\uBCF5\uB429\uB2C8\uB2E4.'});
            }
        });

    }

    render() {
        const { username, password, passwordCheck, email } = this.state;
        const { usernameFail, passwordFail, passwordCheckFail, emailFail } = this.state;

        return (
            <div className="register-container">
                <div className="register-container2">
                    <div className="register-input-container">
                        id <br />
                        <input 
                            onChange={(ev) => this.handleChangeField('username', ev)}
                            value={username}
                            className="register-input"
                        />
                    </div>
                    { usernameFail ? (
                        <div className="register-warning-container">
                            {usernameFail}
                        </div>) :
                        null
                    }
                    <div className="register-input-container">
                        password <br />
                        <input 
                            type="password" 
                            onChange={(ev) => this.handleChangeField('password', ev)}
                            value={password}
                            className="register-input"
                        />
                    </div>
                    { passwordFail ? (
                        <div className="register-warning-container">
                            {passwordFail}
                        </div>) :
                        null
                    }
                    <div className="register-input-container">
                        password check<br />
                        <input 
                            type="password" 
                            onChange={(ev) => this.handleChangeField('passwordCheck', ev)}
                            value={passwordCheck}
                            className="register-input"
                        />
                    </div>
                    { passwordCheckFail ? (
                        <div className="register-warning-container">
                            {passwordCheckFail}
                        </div>) :
                        null
                    }
                    <div className="register-input-container">
                        email <br />
                        <input 
                            onChange={(ev) => this.handleChangeField('email', ev)}
                            value={email}
                            className="register-input"
                        />
                    </div>
                    { emailFail ? (
                        <div className="register-warning-container">
                            {emailFail}
                        </div>) :
                        null
                    }
                    <button className="register-button" onClick={()=>this.handleRegister()}>회원가입</button>
                </div>
            </div>
        );
    }
};

export default Register;
