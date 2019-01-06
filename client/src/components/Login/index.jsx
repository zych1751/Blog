import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import sessionStorage from 'sessionstorage';
import { Link } from 'react-router-dom';
import './Login.scss';

class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: ''
    };

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
      console.log(err.response);
      if(err.response.data.code == 1) {
        // 아이디나 비밀번호가 틀렸습니다.
        alert("\uC544\uC774\uB514\uB098 \uBE44\uBC00\uBC88\uD638\uAC00 \uD2C0\uB838\uC2B5\uB2C8\uB2E4.");
      } else {
        // 메일 인증을 해주세요.
        alert('\uBA54\uC77C \uC778\uC99D\uC744 \uD574\uC8FC\uC138\uC694.');
      }
      alert("아이디나 비밀번호가 틀렸습니다.");
    });
  }
  render() {
    if(this.props.login) {
      return (<Redirect to="/" />);
    }

    const { username, password } = this.state;

    const preventEvent = (e) => {
      e.preventDefault();
    };

    return (
      <div className="container">
        <div className="row">
          <div className="col-lg-8 col-md-10 mx-auto">
            <p>로그인</p>
            <form onSubmit={preventEvent}>
              <div className="control-group">
                <div className="form-group floating-label-form-group controls">
                  <label>id</label>
                  <input
                    onChange={(ev) => this.handleChangeField('username', ev)}
                    value={username}
                    placeholder="id"
                    className="form-control"
                  />
                  <p className="help-block text-danger"></p>
                </div>
              </div>
              <div className="control-group">
                <div className="form-group floating-label-form-group controls">
                  <label>password</label>
                  <input
                    type="password"
                    onChange={(ev) => this.handleChangeField('password', ev)}
                    value={password}
                    placeholder="password"
                  />
                  <p className="help-block text-danger"></p>
                </div>
              </div>
              <br />
              <div className="form-group">
                <button className="btn btn-primary" onClick={()=>this.handleLogin()}>로그인</button>
              </div>
              <div className="login-register-container">
                처음이신가요? &nbsp;
                <Link to="/register">
                  회원가입
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return ({
    login: state.account.login,
    admin: state.account.admin
  });
};

const mapDispatchToProps = (dispatch) => {
  return ({
    handleLogin: (data) => {
      return dispatch({ type: 'LOGIN', data });
    },
  });
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
