import React from 'react';
import '../styles/Home.css'
import TopMovieBar from "../components/Movie/TopMovieBar";

const Home = () => {
    return (
        <div className='main-container'>
            <TopMovieBar/>

            <div className='all-movie-bar'>

            </div>

        </div>
    );
};

export default Home;
