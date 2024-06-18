import axios from 'axios';

const API_URL = 'http://localhost:8080';

export const getSeatMap = async (user) => {
    const username = user.sub;
    console.log("userId",user.sub)
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No token found');
        }

        const response = await axios.get(`${API_URL}/viewseats`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to fetch Seat map Data');
    }
};

export const createSeatMap = async (columns,numRows,startColumnNumber,endColumnNumber,startRowNumber, endRowNumber) => {

    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No token found');
        }

        const response = await axios.post(`${API_URL}/createseat`, {
            columns,
            numRows,
            startColumnNumber,
            endColumnNumber,
            startRowNumber,
            endRowNumber
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to fetch Seat map Data');
    }
};
