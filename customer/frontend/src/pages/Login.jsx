import React from 'react';
import LoginForm from '../components/LoginForm';

const Login = () => {
    return (
        <div className="p-4" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: `url('/assets/background.jpg')`, backgroundSize: 'cover' }}>

            <LoginForm />
        </div>
    );
};

export default Login;
