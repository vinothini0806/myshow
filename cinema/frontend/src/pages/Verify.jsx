import { Card, message} from "antd";
import React, {useEffect} from "react";
import '../styles/Dashboard.css';
import {signupUser} from "../services/UserService";
import { useNavigate} from "react-router-dom";
import '../styles/Profile.css';

import {jwtDecode} from "jwt-decode";
const Verify = () =>{
    const navigate = useNavigate();
    const currentUrl = window.location.href;
    const token =  currentUrl.split('=')[1];

    useEffect(() => {
        console.log("hello");
        if(token){
            const payload = jwtDecode(token);
            const decodedUser = JSON.parse(atob(payload.userJsonBase64));
            console.log(decodedUser);
            console.log(decodedUser.name,decodedUser.username, decodedUser.email, decodedUser.password,decodedUser.phone,decodedUser.address,decodedUser.role);
            const userData = signupUser(decodedUser.name,decodedUser.username, decodedUser.email, decodedUser.password,decodedUser.phone,decodedUser.address,decodedUser.role);
            if (userData.token) {
                navigate('/login');
            } else {
                navigate('/signup');
            }
        }
    }, [token, navigate]);
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
                style={{width: 400, backgroundColor: 'white', borderRadius: '8px'}}
            >
                {message.success('Email verified successfully, please login...')}
                {navigate("/login")}
            </Card>
        </div>
    );
}

export default Verify;