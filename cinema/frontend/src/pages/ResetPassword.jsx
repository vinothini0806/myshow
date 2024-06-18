import React, { useState } from 'react';

import '../styles/Login.css';
import { Form, Button, Input, Card, Alert } from 'antd';

import {useNavigate} from "react-router-dom";
import { resetPassword } from '../services/UserService';

function ResetPassword() {
    const currentUrl = window.location.href;
    // const params = new URLSearchParams(currentUrl.split('=')[1]);
    const token =  currentUrl.split('=')[1];

    const navigate = useNavigate();
    const [error, setError] = useState(null);

    const onFinish = async (values) => {
        try {
            const userData = await resetPassword(token,values.password);
            console.log(values.password)
            if(userData){
                navigate('/login');
                setError('new password changed successfully');
            }

        } catch (error) {
            console.error('rest password failed :', error.message);
            setError('rest password failed :');
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
                        name="password"
                        label="Password"
                        rules={[
                            {required: true},
                            {min: 8},
                            {
                                validator: (_, value) => {
                                    if (!value) {
                                        return Promise.reject("Password is required");
                                    }
                                    if (!/[A-Z]/.test(value)) {
                                        return Promise.reject("Password must contain at least one uppercase letter");
                                    }
                                    if (!/[a-z]/.test(value)) {
                                        return Promise.reject("Password must contain at least one lowercase letter");
                                    }
                                    if (!/\d/.test(value)) {
                                        return Promise.reject("Password must contain at least one number");
                                    }
                                    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(value)) {
                                        return Promise.reject("Password must contain at least one special character");
                                    }
                                    return Promise.resolve();
                                }
                            }
                        ]}
                        hasFeedback
                    >
                        <Input.Password placeholder="Type your password"/>
                    </Form.Item>
                    <Form.Item
                        name="confirmPassword"
                        label="Confirm Password"
                        dependencies={["password"]}
                        rules={[
                            {required: true},
                            ({getFieldValue}) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue("password") === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject("The two passwords that you entered doesn't match");
                                }
                            })
                        ]}
                        hasFeedback
                    >
                        <Input.Password placeholder="Confirm your password"/>
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

export default ResetPassword;
