import React, {useEffect, useState} from 'react';
import {Card, message, Spin} from 'antd';
import '../styles/ProfileCard.css';
import 'react-international-phone/style.css';
import 'react-phone-input-2/lib/style.css';
import { FacebookOutlined, TwitterOutlined, InstagramOutlined,EditOutlined} from '@ant-design/icons';
import { PhoneNumberUtil } from 'google-libphonenumber';
import {getUserProfile, updateUserProfile} from "../services/ProfileService";
const AdminProfileCard = () => {
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');

    const [editedName, setEditedName] = useState('');
    const [editedPhone, setEditedPhone] = useState('');
    const [editedEmail, setEditedEmail] = useState('');
    const [editedAddress, setEditedAddress] = useState('');
    const [error, setError] = useState(null);

    const isPhoneValid = (phoneNumber) => {
        return /^0\d{9}$/.test(phoneNumber);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getUserProfile();
                setUserData(data);
                setName(data.name);
                setPhone(data.phone);
                setEmail(data.email);
                setAddress(data.address);

                setEditedName(data.name);
                setEditedEmail(data.email);
                setEditedPhone(data.phone);
                setEditedAddress(data.address);
                setLoading(false);
            } catch (error) {
                setError('Error loading user data.');
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleSave = async () => {
        try {

            setName(editedName);
            setEmail(editedEmail);
            setPhone(editedPhone);
            setAddress(editedAddress);
            if (!isPhoneValid(editedPhone)) {
                message.error('Invalid phone number');
                return;
            }
            const updatedData = await updateUserProfile(editedName,editedPhone,editedEmail,editedAddress );
            setUserData({ ...userData, editedName,editedPhone,editedEmail,editedAddress });


            setIsEditing(false);


            message.success('Changes saved successfully');
        } catch (error) {
            setError('Error updating user data.');
            message.success('Changes are not saved');
        }
    };

    const handleCancel = () => {

        setEditedName(name);
        setEditedEmail(email);
        setEditedPhone(phone);
        setEditedAddress(address);

        setIsEditing(false);
    };

    return (
        <Card className="profile-card" style={{width:"700px"}} >
            <div className="info-section">

                <img src="assets/cinema.jpg" alt="Profile"/>


                <h2>{name} Profile</h2>
            </div>
            <div className="profile-card-details">
                <div className="profile-card-left">
                    <div>
                        Name
                    </div>
                    <div>
                        Phone Number
                    </div>
                    <div>
                        Address
                    </div>
                </div>
                <div className="profile-card-center">
                    {isEditing ? (
                        <>
                            <input value={editedName} onChange={(e) => setEditedName(e.target.value)} />
                            <input value={editedPhone} onChange={(e) => setEditedPhone(e.target.value)} />
                            <input value={editedAddress} onChange={(e) => setEditedAddress(e.target.value)} />
                        </>
                    ) : (
                        <>
                            <div>{name || 'N/A'}</div>
                            <div>{phone || 'N/A'}</div>
                            <div>{address || 'N/A'}</div>
                        </>
                    )}
                </div>
                <div className="profile-card-right">
                    <div className='edit-links'>
                        {!isEditing && (
                            <>
                                <EditOutlined className="edit-icon" onClick={() => setIsEditing(true)} />
                                <EditOutlined className="edit-icon" onClick={() => setIsEditing(true)} />
                                <EditOutlined className="edit-icon" onClick={() => setIsEditing(true)} />
                            </>
                        )}
                    </div>

                </div>

            </div>
            {isEditing && (
                <div className="edit-buttons">
                    <button className="save-button" onClick={handleSave}>Save</button>
                    <button className="cancel-button" onClick={handleCancel}>Cancel</button>
                </div>
            )}
            <div className="social-links">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                    <FacebookOutlined/>
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                    <TwitterOutlined/>
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                    <InstagramOutlined/>
                </a>
            </div>


        </Card>
    );
};

export default AdminProfileCard;
