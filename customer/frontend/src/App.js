import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProtectedRoute from './components/ProtectedRoute';
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import UserProfile from "./pages/UserProfile";
import CustomFooter from "./components/Footer";
import "./App.css";

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="app-container">
                    <Navbar/>
                    <div className="content-wrap">
                        <Routes>
                            <Route path="/" element={<Home/>}/>
                            <Route path="/login" element={<Login/>}/>
                            <Route path="/forgot" element={<ForgotPassword/>}/>
                            <Route path="/reset-password" element={<ResetPassword/>}/>
                            <Route path="/signup" element={<Signup/>}/>
                            <Route path="/user/profile" element={<ProtectedRoute><UserProfile/></ProtectedRoute>}/>

                        </Routes>
                    </div>
                    <CustomFooter className='footer'/>
                </div>
            </Router>

        </AuthProvider>
    );
}

export default App;
