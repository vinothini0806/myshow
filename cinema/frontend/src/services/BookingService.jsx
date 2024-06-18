import axios from 'axios';

const API_URL = 'http://localhost:8080';

export const getBookingForShow = async (id) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No token found');
        }

        const response = await axios.get(`${API_URL}/viewbooking/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response.data;
    } catch (error) {
        console.error('Error response:', error.response);
        if (error.response && error.response.status === 404) {
            throw new Error('Bookings not found');
        }
        throw new Error(error.response?.data?.message || 'Failed to show Data');
    }
};