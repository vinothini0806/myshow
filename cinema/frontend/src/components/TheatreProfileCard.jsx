import React, {useEffect, useState} from 'react';
import {Button, Card, Flex, Modal} from 'antd';
import '../styles/TheatreProfileCard.css';
import Seat from "./Seat";
import {getSeatMap} from "../services/SeatService";
import {useAuth} from "../context/UserContext";

const TheatreProfileCard = () => {
    const [seat,setSeat] = useState(false);
    const [seatMap,setSeatMap] = useState([]);
    const [error,setError] = useState('');
    const { user } = useAuth();
    const handleClick=(seatMap)=>{
        setSeat(true);
    }
    const handleCancel=(file)=>{
        setSeat(false);

    }
    const handleSave=(file)=>{
        setSeat(false);

    }
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getSeatMap(user);
                setSeatMap(data);

            } catch (error) {
                setError('Error loading seat map data.');
            }
        };
        fetchData();
    }, [user]);
    return (
        <Card className="theatre-profile-card">
            <div className="info-section-theatre">

                <h2>Theatre Seat Map</h2>
            </div>
            <div className="profile-card-details">
                <div className="profile-card-left">

                    <div>
                        Total Rows
                    </div>
                    <div>
                        Total Columns
                    </div>
                    <div>
                        Section Count
                    </div>
                    {seatMap.length > 0 ? (
                        seatMap.map(seat =>
                            <>
                                <div>
                                    columns in Section {seat.sectionId}
                                </div>
                            </>
                        )


                    ):(
                        <>
                            <div></div>
                        </>
                    )}
                    <div>
                        Total Seat Count
                    </div>

                </div>
                <div className="profile-card-center">

                    <div>
                        {seatMap.length > 0 ? seatMap[0].numRows : 'Loading...'}
                    </div>
                    <div>
                        {seatMap.length > 0 && seatMap.reduce((total, seat) => total + seat.columns, 0)}
                    </div>

                    <div>
                        {seatMap.length}
                    </div>
                    {seatMap.length > 0 ? (
                        seatMap.map(seat =>
                            <>
                                <div>
                                     {seat.columns}
                                </div>
                            </>
                        )


                    ):(
                        <>
                            <div></div>
                        </>
                    )}
                    <div>
                        {seatMap.length > 0 && seatMap.reduce((total, seat) => total + (seat.columns * seat.numRows), 0)}
                    </div>
                </div>

            </div>
            <div className="view-seats" >
                <Button className="custom-button" onClick={() => handleClick(seatMap)}>View Seats</Button>
                <div >
                <Modal title="Theatre seat format"  width="auto" style={{textAlign: "center", color:"#4f6f52", maxWidth: '900px', overflow: 'auto'}} open={seat} onOk={handleSave}
                       onCancel={handleCancel}

                >

                        <Seat seatMap={seatMap}/>

                </Modal>
                </div>
            </div>
        </Card>
    );
};

export default TheatreProfileCard;
