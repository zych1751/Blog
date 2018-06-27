import React from 'react';
import { Link } from 'react-router-dom';

class Header extends React.Component {
    render() {
        return (
            <nav>
                <ul>
                    <li>
                        <Link to="/admin"> PostEdit </Link>
                    </li>
                    <li>
                        <Link to="/admin/category"> CategoryEdit </Link>
                    </li>
                </ul>
            </nav>
        );
    }
};

export default Header;
