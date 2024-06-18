
import axios from 'axios';


const API_URL = 'http://localhost:8080';
export const signupUser = async (name,username,email, password,phone,address,role) => {
    try {
        const response = await axios.post(`${API_URL}/signup`,{
            name,
            email,
            username,
            password,
            phone,
            address,
            role
        });
        return response.data;

    } catch (error) {
        throw new Error(error.response.data.message || 'Registration failed');
    }
};
export const verifyEmail = async (name,username,email, password,phone,address,role) => {
    try {
        const response = await axios.post(`${API_URL}/verifyemail`,{
            name,
            email,
            username,
            password,
            phone,
            address,
            role
        });


        return response.data;
    } catch (error) {
        throw new Error(error.response.data.message || 'Verification failed');
    }
};



export const loginUser = async (username,password) => {
    try {
        const response = await axios.post(`${API_URL}/login`,{
            username,
            password,
        });

        return response.data;
    } catch (error) {
        throw new Error(error.response.data.message || 'Login failed');
    }
};

export const forgotPassword = async (email) => {
    try {
        const response = await axios.post(`${API_URL}/forgotpassword`,{
           email
        });

        return response.data;
    } catch (error) {
        throw new Error(error.response.data.message || 'Failed to do the forgot password');
    }
};

export const resetPassword = async (token,newPassword) => {
    try {
        const response = await axios.post(`${API_URL}/resetpassword`,{
            token,
            newPassword
        });

        return response.data;
    } catch (error) {
        throw new Error(error.response.data.message || 'Failed to do the reset password');
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


