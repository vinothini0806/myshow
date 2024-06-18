import axios from 'axios';

const API_URL = 'http://localhost:8080';

export const getAllMovies = async () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No token found');
        }

        const response = await axios.get(`${API_URL}/getAllmovies`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to fetch Movies Data');
    }
};

export const createMovie = async (formData) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No token found');
        }

        const response = await axios.post(`${API_URL}/createmovie`, formData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        });

        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to create movie');
    }
};

export const updateMovie = async (formData) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No token found');
        }

        const response = await axios.put(`${API_URL}/updatemovie`, formData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        });

        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to update movie');
    }
};
export const deleteMovieById = async (id) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No token found');
        }

        const response = await axios.delete(`${API_URL}/deletemovie/${id}`,{
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to delete movie');
    }
};

