import React, { useEffect, useState } from "react";
import '../App.css';
import {
    Button,
    Card,
    Flex,
    Typography,
    Image,
    Modal,

} from "antd";

import {getAllMovies} from "../services/MovieService";


const CinemaMovieList = () => {
    const [sliceMovieData, setSliceMovieData] = useState([]);
    const [movieData, setMovieData] = useState([]);
    const [error, setError] = useState('');
    const [viewAllState, setViewAllState] = useState(false);
    const [viewMovie, setViewMovie] = useState(null);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getAllMovies();
                setMovieData(data);
                setSliceMovieData(data.slice(0, 4));

            } catch (error) {
                setError('Error loading movie data.');
            }
        };
        fetchData();
    }, []);

    const handleClickViewAll = () => {
        setViewAllState(prevState => !prevState);

        if (!viewAllState) {
            setSliceMovieData(movieData);
        } else {
            setSliceMovieData(movieData.slice(0, 4));
        }
    }


    const handleClickView = (movie) => {
        setViewMovie(movie);
    };
    const handleSaveView = () => {
        setViewMovie(null);
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

    return (
        <>
            <Flex align="center" style={{ width: '100%', paddingBottom: '20px', paddingTop: '30px' }} justify={"space-between"}>
                <Typography.Title level={3} strong className="primary--color">
                    Movies
                </Typography.Title>
                {viewAllState ? (
                    <>
                        <Button type="link" className="gray--color" onClick={() => handleClickViewAll()}>
                            View less
                        </Button>
                    </>
                ):(
                    <>
                        <Button type="link" className="gray--color" onClick={() => handleClickViewAll()}>
                            View All
                        </Button>
                    </>
                )

                }

            </Flex>

            <Flex align="center" gap="large">
                <div className="movie-grid">
                    {sliceMovieData.map((movie) => (
                        <Card key={movie.id} hoverable className='movie-card'>
                            <Image src={`data:image/jpeg;base64,${movie.imageData}`}
                                   style={{width: '100%', padding: '0px'}}/>
                            <Button size="large" style={{
                                backgroundColor: '#ffffff',
                                borderColor: '#ffffff',
                                color: '#4f6f52',
                                fontSize: '20px',
                                marginTop: '1rem',
                                fontWeight: 'bold'
                            }} onClick={() => handleClickView(movie)}>
                                {movie.name}
                            </Button>
                        </Card>
                    ))}
                </div>
            </Flex>

            {viewMovie && (
                <Modal title={viewMovie.name + " Movie"} style={{ textAlign: "center", color: "#4f6f52" }} open={true} footer={renderFooterView()}>
                    <Flex gap="1rem" justify="center">
                        <div className="movie-details">
                            <div className="movie-card-left">
                                <div>Description</div>
                                <div>Language</div>
                                <div>Release Date</div>
                                <div>Duration</div>
                            </div>
                            <div className="movie-card-right">
                                <div>{viewMovie.description}</div>
                                <div>{viewMovie.language}</div>
                                <div>{viewMovie.releaseDate}</div>
                                <div>{viewMovie.hours + "hr " + viewMovie.minutes + "min"}</div>
                            </div>
                        </div>
                    </Flex>
                </Modal>
            )}




        </>
    );
};

export default CinemaMovieList;
