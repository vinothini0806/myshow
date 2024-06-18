import axios from 'axios';

const API_URL = 'http://localhost:8080';

export const getShows = async () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No token found');
        }

        const response = await axios.get(`${API_URL}/viewshows`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response.data;
    } catch (error) {
        console.error('Error response:', error.response);
        if (error.response && error.response.status === 404) {
            throw new Error('Shows not found');
        }
        throw new Error(error.response?.data?.message || 'Failed to show Data');
    }
};

export const createShow = async (showDate, showTime, price, movieId) => {

    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No token found');
        }

        const response = await axios.post(`${API_URL}/createshow`, {
            showDate,
            showTime,
            price,
            movieId

        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to create show');
    }
};
