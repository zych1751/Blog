import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';
import sessionStorage from 'sessionstorage';
import './header.scss';

class Header extends React.Component {

    constructor(props) {
        super(props);

        this.handleLogout = this.handleLogout.bind(this);
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

    handleLogout() {
        const { logout } = this.props;

        axios.post(API_SERVER_URL+'/api/account/logout').then(() => {
            sessionStorage.removeItem('jwtToken');
            logout();
        });
    }

    render() {
        const loginTab = 
            ((this.props.login) ? 
            (<li className="navbar-item active">
                <div className="nav-link header-item2" onClick={this.handleLogout}>Logout</div>
            </li>) :
            (<li className="navbar-item active">
                <Link to="/login" className="nav-link header-item2">Login</Link>
            </li>));
        const adminTab =
            ((this.props.admin) ?
            (<li className="navbar-item active">
                <Link to="/admin" className="nav-link header-item2">Admin</Link>
            </li>) :
            (null));

        return (
            <nav className="header navbar navbar-expand-lg navbar-dark bg-dark">
                <div className="collapse navbar-collapse w-100 order-1 order-md-0 dual-collapse2">
                    <ul className="navbar-nav mr-auto">
                        <li className="navbar-item active">
                            <Link to="/blog" className="nav-link header-item">Blog</Link>
                        </li>
                    </ul>
                </div>
                <div className="collapse navbar-collapse w-100 order-3 dual-collapse2">
                    <ul className="navbar-nav ml-auto header-item2-container">
                        {loginTab}
                        {adminTab}
                    </ul>
                </div>
            </nav>
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
        onLoad: (data) => {
            return dispatch({ type: 'HEADER_LOADED', data });
        }, logout: () => {
            return dispatch({ type: 'LOGOUT' });
        }
    });
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);
