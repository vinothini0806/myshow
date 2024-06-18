import React, {useState} from 'react';
import '../styles/Signup.css';
import {Form, Button, Checkbox, Input, Select, Card, Alert} from "antd";
import {useNavigate} from "react-router-dom";
import { verifyEmail} from "../services/UserService";
const { Option } = Select;




function Signup() {

    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState(null);
    const [error, setError] = useState(null);

    const onFinish = async (values) => {
        try {
            const userData = await verifyEmail(values.name,values.username, values.email, values.password,values.phone,values.address,'Cinema');
            if (userData.token) {
                console.log('email sent:', userData);
                setError('Link sent to the email');
            } else {
                setErrorMessage(userData.message);
            }
        } catch (error) {
            console.error('Signup failed:', error.message);
            setErrorMessage('An error occurred during signup. Please try again.');
        }
    };
    return (
        <div className="signup-container" style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            background: `url('/assets/movie_theme.jpg')`,
            backgroundSize: 'cover',
        }}>
            <Card className="signup-card" style={{ width: 500, backgroundColor: 'white', borderRadius: '8px' }}>
                {error && <Alert message={error} type="success" showIcon className="login-alert" />}
                <Form
                    autoComplete="off"
                    labelCol={{ span: 10 }}
                    wrapperCol={{ span: 14 }}
                    onFinish={onFinish}
                    onFinishFailed={(error) => {
                        console.log({ error });
                    }}

                    className="signup-form"
                >
                    <p style={{ marginLeft: '26px' ,marginBottom: '17px',fontSize: '30px',fontWeight:'bold',Color:'#006400'}} className="title">
                        Sign Up
                    </p>
                    {errorMessage && (
                        <Form.Item>
                            <Alert message={errorMessage} type="error" showIcon/>
                        </Form.Item>
                    )}

                    <Form.Item
                        name="name"
                        label="Cinema name"
                        rules={[
                            { required: true, message: "Please enter the cinema name" },
                            { whitespace: true },
                            { min: 3 }
                        ]}
                        hasFeedback
                    >
                        <Input placeholder="Type the cinema name" />
                    </Form.Item>
                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                            { required: true, message: "Please enter your email" },
                            { type: "email", message: "Please enter valid email" }
                        ]}
                        hasFeedback
                    >
                        <Input placeholder="Type your email" />
                    </Form.Item>
                    <Form.Item
                        name="username"
                        label="Username"
                        rules={[
                            { required: true, message: 'Please input the username', whitespace: true },
                            {
                                validator: (_, value) => {
                                    if (value && value.toLowerCase() === 'admin') {
                                        return Promise.reject(new Error('The username "admin" is not allowed.'));
                                    }
                                    return Promise.resolve();
                                }
                            }
                        ]}

                    >
                        <Input placeholder="Type the username" />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        label="Password"
                        rules={[
                            { required: true },
                            { min: 8 },
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
                        <Input.Password placeholder="Type your password" />
                    </Form.Item>
                    <Form.Item
                        name="confirmPassword"
                        label="Confirm Password"
                        dependencies={["password"]}
                        rules={[
                            { required: true },
                            ({ getFieldValue }) => ({
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
                        <Input.Password placeholder="Confirm your password" />
                    </Form.Item>
                    <Form.Item
                        name="phone"
                        label="Telephone No"
                        rules={[
                            { required: true},
                            ({ getFieldValue }) => ({
                                validator: (_, value) => {
                                    if (!value) {
                                        return Promise.reject("Phone number is required");
                                    }
                                    if (!/^0/.test(value)) {
                                        return Promise.reject("Phone number must starts with 0");
                                    }
                                    if (!/^0\d{9}$/.test(value)) {
                                        return Promise.reject("Phone number must contains 10 numbers");
                                    }
                                    return Promise.resolve();
                                }
                        })


                        ]}
                    >
                        <Input
                            placeholder="Type your phone number"
                            // addonBefore={prefixSelector}
                            style={{ width: '100%' }}
                        />
                    </Form.Item>
                    <Form.Item
                        name="address"
                        label="Address"
                        rules={[
                            { required: true, message: 'Please enter the cinema address', whitespace: true }
                        ]}
                    >
                        <Input placeholder="Type the cinema address" />
                    </Form.Item>
                    <Form.Item
                        name="agreement"
                        wrapperCol={{ span: 24 }}
                        valuePropName="checked"
                        rules={[
                            {
                                validator: (_, value) =>
                                    value ? Promise.resolve() : Promise.reject("To proceed, you need to agree with our terms and conditions")
                            }
                        ]}
                    >
                        <Checkbox>Agree to our <a href='#' className="custom-link">Terms and conditions</a></Checkbox>
                    </Form.Item>
                    <Form.Item wrapperCol={{ span: 24 }}>
                        <Button block type='primary' htmlType='submit' className="signup-form-button dark-green-button">Register</Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
}

export default Signup;
