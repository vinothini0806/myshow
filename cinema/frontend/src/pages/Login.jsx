import React, {useEffect, useState} from 'react';
import '../styles/Login.css';
import {Form, Button, Checkbox, Input, Card, Alert, message} from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { useAuth } from '../context/UserContext';
import {loginUser, signupUser} from '../services/UserService';
import {useNavigate} from "react-router-dom";
import {jwtDecode} from "jwt-decode";

function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [error, setError] = useState(null);
    const [verified, setVerified] = useState(null);
    const currentUrl = window.location.href;
    const token =  currentUrl.split('=')[1];
    useEffect(() => {
        console.log("hello");
        if(token){
            const payload = jwtDecode(token);
            const decodedUser = JSON.parse(atob(payload.userJsonBase64));
            console.log(decodedUser.name,decodedUser.username, decodedUser.email, decodedUser.password,decodedUser.phone,decodedUser.address,decodedUser.role);
            const userData = signupUser(decodedUser.name,decodedUser.username, decodedUser.email, decodedUser.password,decodedUser.phone,decodedUser.address,decodedUser.role);
            if (userData) {
                setVerified(userData);
                message.success('Email verified successfully');
            } else {
                message.error('Email verification failed');
            }
        }
    }, [token, navigate]);
    const onFinish = async (values) => {
        try {
            const userData = await loginUser(values.username, values.password);
            login(userData);
            console.log("userData.username",userData)
            if(values.username === "Admin"){
                navigate('/movie');
            }else{
                navigate('/profile');
            }

        } catch (error) {
            console.error('Login failed:', error.message);
            setError('Invalid username or password');
        }
    };

    return (
        <div
            className="login-container"
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                background: `url('/assets/movie_theme.jpg')`,
                backgroundSize: 'cover',
            }}
        >
            <Card
                className="login-card"
                style={{ width: 400, backgroundColor: 'white', borderRadius: '8px' }}
            >
                {error && <Alert message={error} type="error" showIcon className="login-alert" />}
                {/*{verified && <Alert message={verified} type="error" showIcon className="login-alert" />}*/}
                <Form
                    name="normal_login"
                    className="login-form"
                    initialValues={{
                        remember: true,
                    }}
                    onFinish={onFinish}
                >
                    <p style={{
                        marginLeft: '26px',
                        marginBottom: '17px',
                        fontSize: '30px',
                        fontWeight: 'bold',
                        Color: '#006400'
                    }} className="title">
                        Login
                    </p>

                    <Form.Item
                        name="username"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your Username!',
                            },
                        ]}
                    >
                        <Input prefix={<UserOutlined className="site-form-item-icon"/>} placeholder="Username"/>
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your Password!',
                            },
                        ]}
                    >
                        <Input
                            prefix={<LockOutlined className="site-form-item-icon"/>}
                            type="password"
                            placeholder="Password"
                        />
                    </Form.Item>
                    <Form.Item style={{textAlign: 'center'}}>
                        <Form.Item name="remember" valuePropName="checked" noStyle>
                            <Checkbox>Remember me</Checkbox>
                        </Form.Item>
                        <a className="login-form-forgot custom-link" href="/forgotpassword"
                           style={{marginLeft: '10px'}}>
                            Forgot password
                        </a>
                    </Form.Item>
                    <Form.Item style={{textAlign: 'center'}}>
                        <Button type="primary" htmlType="submit" className="login-form-button dark-green-button">
                            Log in
                        </Button>
                        <div>
                            Or <a className="custom-link" href="/signup">
                            register now!
                        </a>
                        </div>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
}

export default Login;
