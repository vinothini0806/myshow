import React, { createContext, useState, useContext, useEffect } from 'react';
import { getAllMovies } from "../services/MovieService";

const MovieContext = createContext();

export const MovieProvider = ({ children }) => {
    const [movies, setMovies] = useState([]);

    const getAllMovie = async () => {
        try {
            const movieList = await getAllMovies();
            setMovies(movieList);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                getAllMovie();
            } catch (error) {
                console.error(error);
            }
        }
    }, []);

    return (
        <MovieContext.Provider value={{ movies, getAllMovie }}>
            {children}
        </MovieContext.Provider>
    );
};

export const useMovieContext = () => useContext(MovieContext);
