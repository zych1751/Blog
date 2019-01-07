import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';
import sessionStorage from 'sessionstorage';
import headerBackground from '../../clean-blog-templage/img/home-bg.jpg';

class Header extends React.Component {

  constructor(props) {
    super(props);

    this.handleLogout = this.handleLogout.bind(this);
    this.postListInit = this.postListInit.bind(this);
  }

  componentDidMount() {
    const { onLoad } = this.props;

    axios.get(API_SERVER_URL+'/api/account/info', {
      params: {
        token: sessionStorage.getItem('jwtToken')
      }
    }).then((res) => {
      onLoad(res.data);
    });
  }

  handleLogout(e) {
    e.preventDefault();

    const { logout } = this.props;

    axios.post(API_SERVER_URL+'/api/account/logout').then(() => {
      sessionStorage.removeItem('jwtToken');
      logout();
    });
  }

  postListInit() {
    const { postListInit } = this.props;
    axios.get(API_SERVER_URL+'/api/post/list')
      .then((res) => {
        postListInit(res.data);
      });
  }

  render() {
    const loginTab =
      ((this.props.login) ?
        (<li className="nav-item">
          <a className="nav-link" href="#" onClick={this.handleLogout}>Logout</a>
        </li>) :
        (<li className="nav-item">
          <Link to="/login" className="nav-link">Login</Link>
        </li>));
    const adminTab =
      ((this.props.admin) ?
        (<li className="nav-item">
          <Link to="/admin" className="nav-link">Admin</Link>
        </li>) :
        (null));

    const headerStyle = {
      backgroundImage: "url(" + headerBackground + ")"
    };

    return (
      <div>
        <nav className="navbar navbar-expand-lg navbar-light fixed-top" id="mainNav">
          <div className="container">
            <Link to="/blog" className="navbar-brand" onClick={() => this.postListInit()}>Blog</Link>
            <button className="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse"
                    data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false"
                    aria-label="Toggle navigation">
              Menu
              <i className="fas fa-bars" />
            </button>
            <div className="collapse navbar-collapse" id="navbarResponsive">
              <ul className="navbar-nav ml-auto">
                {loginTab}
                {adminTab}
              </ul>
            </div>
          </div>
        </nav>
        <header className="masthead" style={headerStyle}>
          <div className="overlay"></div>
          <div className="container">
            <div className="row">
              <div className="col-lg-8 col-md-10 mx-auto">
                <div className="site-heading">
                  <h1>ZychSpace</h1>
                  <span className="subheading">잡다한 개발, 게임, 일상 이야기</span>
                </div>
              </div>
            </div>
          </div>
        </header>
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
    onLoad: (data) => {
      return dispatch({ type: 'HEADER_LOADED', data });
    }, logout: () => {
      return dispatch({ type: 'LOGOUT' });
    }, postListInit: (data) => {
      return dispatch({ type: 'POST_LIST_LOADED', data});
    }
  });
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
