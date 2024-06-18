import React, {useContext, useEffect, useState} from 'react';
import { Flex, Menu } from 'antd';
import { FaFilm } from 'react-icons/fa';
import { UserOutlined, VideoCameraOutlined, ProfileOutlined, LogoutOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/UserContext';


const Sidebar = () => {
    const [selectedKey, setSelectedKey] = useState('4');
    const navigate = useNavigate();
    const user = {sub: localStorage.getItem("user")};
    const {logout} = useAuth()
    useEffect(() => {
        console.log("User role:", user.sub);
    }, [user]);
    const handleMenuClick = (e) => {
        const { key } = e;
        setSelectedKey(key);
            if (key === '4') {
                logout();
                // localStorage.removeItem("user");
                navigate('/');
            } else if (key === '1') {
                navigate('/cinemamovie');
            } else if (key === '2') {
                navigate('/show');
            } else if (key === '3') {
                navigate('/profile');
            }


    };

    return (
        <>
            <Flex align="center" justify="center">
                <div className="logo" style={{display: 'flex', alignItems: 'center'}}>
                    <FaFilm style={{fontSize: '24px', marginRight: '8px'}}/>
                    <h4 style={{margin: 0}}>MyShow.lk</h4>
                </div>
            </Flex>
            {(user && user.sub === "Admin") ? (

                <Menu
                    mode="inline"
                    className="menu-bar"
                    selectedKeys={[selectedKey]}
                    onClick={handleMenuClick}
                    style={{fontSize: '20px'}}
                    items={[

                        {
                            key: '1',
                            icon: <VideoCameraOutlined />,
                            label: 'Movies',
                        },
                        {
                            key: '2',
                            icon: <ProfileOutlined />,
                            label: 'Profile',
                        },
                        {
                            key: '3',
                            icon: <LogoutOutlined />,
                            label: 'Logout',
                        },


                    ]}
                />
                ):(

                <Menu
                    mode="inline"
                    defaultSelectedKeys={['1']}
                    className="menu-bar"
                    selectedKeys={[selectedKey]}
                    onClick={handleMenuClick}
                    items={[

                        {
                            key: '1',
                            icon: <VideoCameraOutlined />,
                            label: 'Movies',
                        },
                        {
                            key: '2',
                            icon: <VideoCameraOutlined />,
                            label: 'Shows',
                        },
                        {
                            key: '3',
                            icon: <ProfileOutlined />,
                            label: 'Profile',
                        },
                        {
                            key: '4',
                            icon: <LogoutOutlined />,
                            label: 'Logout',
                        },
                    ]} />

            )}

        </>
    );
};

export default Sidebar;
