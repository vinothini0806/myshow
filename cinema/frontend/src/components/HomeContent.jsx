import React from 'react';
import {Button, Flex} from 'antd';

const HomeContent = () => {
    return (
        <Flex align='center' style={{ position: 'relative' }}>
            <img src="assets/water.jpeg" alt="Profile" className="full-width-image" style={{ width: '100%', height: 'auto' }} />
            <div className="overlay-text" style={{
                position: 'absolute',
                top: '40%',
                left: '40%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center',
                backgroundColor: 'rgba(0, 0, 0, 0.5)', // Adjust the opacity as needed
                color: '#ffffff',
                padding: '20px',
                borderRadius: '8px',
                maxWidth: '80%',
            }}>
                <h2 style={{ marginBottom: '36px', fontFamily: 'Arial, sans-serif' }}>Elevate Your Cinema Experience</h2>
                <p style={{ textAlign: 'left', fontFamily: 'Arial, sans-serif', fontSize: '20px', lineHeight: '1.6', marginBottom: '20px' }}>
                    Elevate your cinema experience with our state-of-the-art screening technology, featuring crystal-clear visuals and immersive sound systems. Our luxurious and comfortable seating options are designed to provide maximum comfort and relaxation, ensuring that every moviegoer enjoys their time. Combined with our unwavering commitment to exceptional customer service, we create a welcoming and enjoyable environment that attracts and delights moviegoers of all ages and preferences, making every visit to our cinema an unforgettable experience
                </p>
                <Button style={{
                    align:"left",
                    backgroundColor: '#ffffff',
                    color: '#006400',
                    border: '2px solid #ffffff',
                    paddingBottom: '30px',
                    borderRadius: '5px',
                    fontFamily: 'Arial, sans-serif',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s, color 0.3s, border-color 0.3s',
                    textDecoration: 'none',
                    display: 'inline-block'
                }}>
                    Explore more
                </Button>
            </div>
        </Flex>

    );
};

export default HomeContent;
