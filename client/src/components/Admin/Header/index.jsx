import React from 'react';
import { Link } from 'react-router-dom';

import './Header.scss';

class Header extends React.Component {
    render() {
        return (
            <nav className="admin-header">
                <button className="btn btn-info admin-header-button">
                    <Link to="/admin"> PostEdit </Link>
                </button>
                <button className="btn btn-info admin-header-button">
                    <Link to="/admin/category"> CategoryEdit </Link>
                </button>
                <button className="btn btn-info admin-header-button">
                    <Link to="/admin/image-upload"> ImageUpload </Link>
                </button>
            </nav>
        );
    }
};

export default Header;
