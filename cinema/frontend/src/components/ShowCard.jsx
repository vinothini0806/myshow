import React, {useState, useEffect, useContext} from 'react';
import '../styles/ShowCard.css'

import {Card, DatePicker, Modal, Button, Typography, Flex, Image, Alert} from 'antd';
import moment from 'moment';
import {getShows} from "../services/ShowService";
import dayjs from "dayjs";

import {getSeatMap} from "../services/SeatService";
import {getBookingForShow} from "../services/BookingService";
import BookedSeat from "./BookedSeat";

const { Meta } = Card;

const ShowCard = () => {

    const [showTimes, setShowTimes] = useState([]);
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const [viewMovie, setViewMovie] = useState(null);
    const [viewBooking, setViewBooking] = useState(null);
    const [bookingData, setBookingData] = useState([]);
    const [seatData, setSeatData] = useState([]);
    const [filteredShows, setFilteredShows] = useState([]);
    const [error,setError] = useState();
    // const user = useContext(UserContext);
    const user = {sub: localStorage.getItem("user")}

    useEffect(() => {
        const fetchShowTimes = async () => {
            try {
                const data = await getShows();
                setShowTimes(data);
                const seat = await getSeatMap(user);
                setSeatData(seat);
                setError(null);
                if (selectedDate) {
                    const formattedSelectedDate = dayjs(selectedDate).format('YYYY-MM-DD');
                    const filtered = showTimes.filter(show => {
                        const formattedShowDate = dayjs(show.showDate).format('YYYY-MM-DD');
                        return formattedShowDate === formattedSelectedDate;
                    });
                    setFilteredShows(filtered);
                } else {
                    setFilteredShows([]);
                }
                if(viewBooking){
                    const data = await getBookingForShow(viewBooking.showId);
                    setBookingData(data);
                }
            } catch (err) {
                console.error('Failed to fetch shows:', err.message);
                setError(err.message);
            }
        };

        fetchShowTimes();
    }, [selectedDate, viewBooking, viewMovie]);


    const onDateChange = (date) => {
        if (date) {
            setSelectedDate(date);
        }
    };

    const handleClickView = (show) => {
        setViewMovie(show);

    };

    const handleSaveView = () => {
        setViewMovie(null);

    };
    const handleClickViewBooking =  (show) => {
        setViewBooking(show);
    };


    const handleSaveBooking = () => {
        setViewBooking(null);

    };

    const renderFooterView = () => {
        return (
            <Flex justify="center" style={{ marginTop: "5rem" }}>
                <Button key="submit" type='primary' style={{ backgroundColor: '#4f6f52', borderColor: '#4f6f52', color: '#ffffff', marginRight: "20px" }} onClick={handleSaveView}>
                    Ok
                </Button>
            </Flex>
        );
    };
    const renderFooterBooking = () => {
        return (
            <Flex justify="center" style={{ marginTop: "5rem" }}>
                <Button key="submit" type='primary' style={{ backgroundColor: '#4f6f52', borderColor: '#4f6f52', color: '#ffffff', marginRight: "20px" }} onClick={handleSaveBooking}>
                    Ok
                </Button>
            </Flex>
        );
    };





    return (
        <>
            <Flex align="center" style={{width: '100%', paddingBottom: '10px', paddingTop: '20px'}}
                  justify={"space-between"}>
                <Typography.Title level={3} strong className="primary--color">
                    My Shows
                </Typography.Title>

                <DatePicker
                    defaultValue={moment()}
                    value={selectedDate}
                    onChange={onDateChange}
                    disabledDate={(current) => {
                        return current && current < moment().startOf('day');
                    }}
                />

            </Flex>

            {error ? (
                // <Alert message="Error" description="There is no shows available" type="error" showIcon />
                <h2>Shows are not available for this date</h2>
            ) : (
                <div className="showtime-container">
                    {filteredShows.map((show) => (
                        <Card key={show.id} className="showtime-card">
                            <div className="showtime-info">
                                <h2>{show.showTime.split(':').slice(0, 2).join(':')} show</h2>
                                <div className="showtimes">
                                    <Button type="link" type='primary' style={{ backgroundColor: '#4f6f52', borderColor: '#4f6f52', color: '#ffffff', marginRight: "20px" }}
                                            onClick={() => handleClickView(show)}>
                                        Movie info
                                    </Button>
                                    <Button type="link" type='primary' style={{ backgroundColor: '#555', borderColor: '#555', color: '#ffffff', marginRight: "20px" }}
                                            onClick={() => handleClickViewBooking(show)}>
                                        Booking info
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {viewMovie && (
                <Modal title={viewMovie.movieName + " Movie"} style={{ height:"auto",textAlign: "center", color: "#4f6f52"}} open={true} footer={renderFooterView()}>
                    <Flex gap="1rem" justify="center">
                        <Image src={`data:image/jpeg;base64,${viewMovie.imageData}`}
                               style={{width: '100%', padding: '0px'}}/>
                    </Flex>
                </Modal>
            )}
            {viewBooking && (

                <Modal title="Booked Seats" width="auto" style={{ height:"auto",textAlign: "center", color: "#4f6f52" ,maxWidth:"1000px" }} open={true} footer={renderFooterBooking()}>
                <BookedSeat seatMap={seatData} BookedSeats={bookingData}/>

                </Modal>
            )}

        </>
    );
};


export default ShowCard;
