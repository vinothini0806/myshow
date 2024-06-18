
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserProvider } from './context/UserContext';
import React from 'react';
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Movie from "./pages/Movie";
import Artist from "./pages/Artist";
import {MovieProvider} from "./context/MovieContext";
import {useAuth} from "./context/UserContext";
import Show from "./pages/Show";
import AdminProfile from "./pages/AdminProfile";
import CinemaMovie from "./pages/CinemaMovie";
import Verify from "./pages/Verify";
import Sidebar from "./components/Sidebar";


function App() {
    // const currentUrl = window.location.href;
    //
    // // Check if the current URL matches the pattern
    // if (currentUrl.startsWith('http://localhost:3000/resetpassword?token=')) {
    //     // If it matches, render the ResetPassword component
    //     return <ResetPassword />;
    // }

    return (

      <UserProvider>
          <MovieProvider>
    <>
        <Router>
            <Routes>
                    <Route path='/' element={<Home />}/>
                    <Route path='/profile' element={<Profile />}/>
                    <Route path='/adminProfile' element={<AdminProfile />}/>
                    <Route path='/movie' element={<Movie />}/>
                    <Route path='/cinemamovie' element={<CinemaMovie />}/>
                    <Route path='/dashboard' element={<Dashboard />}/>
                    <Route path='/signup' element={<Signup />}/>
                    <Route path='/login' element={<Login />}/>
                    <Route path='/forgotpassword' element={<ForgotPassword />}/>
                    <Route path='/resetpassword/:token' element={<ResetPassword />} />
                    <Route path='/verify/:token' element={<Login />} />
                    <Route path='/profile' element={<Profile />}/>
                    <Route path='/show' element={<Show />}/>
            </Routes>
        </Router>
    </>
          </MovieProvider>
       </UserProvider>
  );
}

export default App;
