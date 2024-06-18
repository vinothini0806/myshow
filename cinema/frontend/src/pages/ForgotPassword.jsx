import React, { useState } from 'react';
import '../styles/Login.css';
import { Form, Button, Input, Card, Alert } from 'antd';
import {  UserOutlined } from '@ant-design/icons';
import {useNavigate} from "react-router-dom";
import { forgotPassword } from '../services/UserService';


function ForgotPassword() {
    const navigate = useNavigate();
    const [error, setError] = useState(null);

    const onFinish = async (values) => {
        try {
            const userData = await forgotPassword(values.email);
            setError('Link sent to the email');
        } catch (error) {
            console.error('Failed to send an email:', error.message);
            setError('Failed to send an email');
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
                <Form
                    name="normal_login"
                    className="login-form"
                    initialValues={{
                        remember: true,
                    }}
                    onFinish={onFinish}
                >
                    <p style={{
                        marginLeft: '22px',
                        marginBottom: '17px',
                        fontSize: '20px',
                        fontWeight: 'bold',
                        Color: '#006400'
                    }} className="title">
                        Reset Password
                    </p>
                    <Form.Item
                        name="email"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your email!',
                            },
                        ]}
                    >
                        <Input prefix={<UserOutlined className="site-form-item-icon"/>} placeholder="Email"/>
                    </Form.Item>


                    <Form.Item style={{textAlign: 'center'}}>
                        <Button type="primary" htmlType="submit" className="login-form-button dark-green-button">
                            Reset Password
                        </Button>

                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
}

export default ForgotPassword;
