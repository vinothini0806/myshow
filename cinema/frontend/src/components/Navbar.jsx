import React from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'antd';
import { useAuth } from '../context/UserContext';
import UserIcon from './UserIcon';
import Search from "antd/es/input/Search";
import '../styles/Navbar.css';  // Import the CSS file

const Navbar = () => {
    const { user, logout } = useAuth();

    return (
        <>
            <style>
                {`
                    @import url('https://fonts.googleapis.com/css2?family=Poetsen+One&display=swap');
                    /* google font import */
                `}
            </style>

            <Menu mode="horizontal" className="navbar-menu">
                <div className="navbar-logo">
                    MyShow.lk
                </div>
                <div className="navbar-search">
                    <Search placeholder="Search " style={{ width: '15%' }} />
                </div>
                <Menu.Item key="home" className="navbar-item">
                    <Link to="/" className="navbar-link">Home</Link>
                </Menu.Item>
                {user ? (
                    <Menu.SubMenu key="user" title={<UserIcon user={user} />} className="navbar-item">
                        <Menu.Item key="logout" onClick={logout}>
                            Logout
                        </Menu.Item>
                    </Menu.SubMenu>
                ) : (
                    <>
                        <Menu.Item key="login" className="navbar-item">
                            <Link to="/login" className="navbar-link">Login</Link>
                        </Menu.Item>
                        <Menu.Item key="signup" className="navbar-item">
                            <Link to="/signup" className="navbar-link">Sign Up</Link>
                        </Menu.Item>
                    </>
                )}
            </Menu>
        </>
    );
};

export default Navbar;