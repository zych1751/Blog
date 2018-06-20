import React from 'react';
import { NavLink, Link } from 'react-router-dom';
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

        axios.get('http://localhost:8000/api/account/info', {
            params: {
                token: sessionStorage.getItem('jwtToken')
            }
        }).then((res) => {
            onLoad(res.data);
        });
    }

    handleLogout() {
        const { logout } = this.props;

        axios.post('http://localhost:8000/api/account/logout').then(() => {
            sessionStorage.removeItem('jwtToken');
            logout();
        });
    }

    render() {
        const loginTab = 
            ((this.props.login) ? 
            (<li className="navbar-item">
                <div className="nav-link header-item-2" onClick={this.handleLogout}>Logout</div>
            </li>) :
            (<li className="navbar-item">
                <Link to="/login" className="nav-link header-item-2">Login</Link>
            </li>));
        const adminTab =
            ((this.props.admin) ?
            (<li className="navbar-item">
                <Link to="/admin" className="nav-link header-item-2">Admin</Link>
            </li>) :
            (null));

        return (
            <nav className="header navbar navbar-expand-lg navbar-dark bg-dark">
                <div className="collapse navbar-collapse w-100 order-1 order-md-0 dual-collapse2">
                    <ul className="navbar-nav mr-auto">
                        <li className="navbar-item">
                            <NavLink to="/" className="nav-link header-item">Blog</NavLink>
                        </li>
                    </ul>
                </div>
                <div className="collapse navbar-collapse w-100 order-3 dual-collapse2">
                    <ul className="navbar-nav ml-auto">
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
