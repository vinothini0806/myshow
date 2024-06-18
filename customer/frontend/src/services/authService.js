import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

export const registerUser = async (username, email, password) => {
    try {
        const response = await axios.post(`${API_URL}/auth/register`,{
            username,
            email,
            password,
        });


        return response.data;
    } catch (error) {
        throw new Error(error.response.data.message || 'Registration failed');
    }
};

export const loginUser = async (email,password) => {
    try {
        const response = await axios.post(`${API_URL}/auth/login`,{
            email,
            password,
        });
        console.log(response.data);
        return response.data;
    } catch (error) {
        throw new Error(error.response.data.message || 'Login failed');
    }
};
export const sendPasswordResetEmail = async (email) => {
    try {
        const response = await axios.post(`${API_URL}/auth/forgot`,{
            email
        });

        return response.data;
    } catch (error) {
        throw new Error(error.response.data.message || 'User not found');
    }
};
export const resetPassword = async (token,newPassword) => {
    try {
        const response = await axios.post(`${API_URL}/auth/reset`,{
            token,
            newPassword
        });

        return response.data;
    } catch (error) {
        throw new Error(error.response.data.message || 'Failed');
    }
};

export const logout = async (token) => {
    try {
        await axios.post(`${API_URL}/logout`, {}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    } catch (error) {
        console.error('Failed to logout:', error);
        throw error; // Re-throw the error to handle it in the calling function
    }
};



