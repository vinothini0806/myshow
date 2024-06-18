import {
    Button,
    Card,
    DatePicker,
    Flex,
    Form,
    Input,
    message,
    Modal, Select,
     TimePicker,
    Typography,

} from 'antd';
import React, {useEffect, useState} from 'react';
import dayjs from "dayjs";
import {createMovie, getAllMovies} from "../services/MovieService";
import {createShow, getShows} from "../services/ShowService";
import {format, parse} from 'date-fns';
import moment from "moment";

const ShowBanner= () => {
    const [form] = Form.useForm();
    const [addMovie,setAddMovie] = useState(false);
    const [movieList,setMovieList] = useState([]);
    const [error, setError] = useState('');
    const [movies, setMovies] = useState(['select']);
    const [showTimes, setShowTimes] = useState([]);
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const [disabledTimes, setDisabledTimes] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getAllMovies();
                setMovieList(data);
                console.log(data);

                const showData = await getShows();
                setShowTimes(showData);

            } catch (error) {
                setError('Error loading movie data.');
            }
        };

        fetchData();
    }, []);
    const extractFirstNumber = (str) => {
        const indexOfDash = str.indexOf('-');
        if (indexOfDash === -1) return null;
        const numberPart = str.substring(0, indexOfDash);
        return numberPart;
    };
    const handleClick=()=>{
        setAddMovie(true);
        const newMovies = movieList.map(movie => `${movie.id}-${movie.name}-${movie.description}`);
        setMovies([...movies, ...newMovies]);





    }

    const handleCancel=(file)=>{
        setAddMovie(false);
        form.resetFields();
        setMovies([]);
        console.log(movies);

    }
    const formatTime = (timeStr) => {
        const timeParts = timeStr.split(':');
        if (timeParts.length !== 3) {
            throw new Error('Invalid time format');
        }

        const [hours, minutes, seconds] = timeParts.map(part => {
            const intPart = parseInt(part, 10);
            if (isNaN(intPart) || intPart < 0 || intPart >= 60) {
                throw new Error('Invalid time value');
            }
            return part.padStart(2, '0');
        });

        return `${hours}:${minutes}:${seconds}`;
    };
    const handleSave=(values)=>{

        try {
            const { showDate, showTime, price, movieIdName } = values;
            const formattedDate = format(showDate.toDate(), 'yyyy-MM-dd');
            const formattedTime = showTime.format('HH:mm:ss');
            const movieId = extractFirstNumber(movieIdName);

            console.log("formattedTime",formattedTime);

            const showData =  createShow(formattedDate, formattedTime, price, parseInt(movieId, 10));

            if (showData) {

                message.success('Show created successfully');
                window.location.reload();
            } else {
                message.error('Show creation failed');
            }
        } catch (error) {
            console.error('Movie creation failed:', error.message);

        } finally {
            setAddMovie(false);
            form.resetFields();
            setMovies([]);
        }

    }
    const onDateChange = (date) => {
        if (date) {
            setSelectedDate(date);


            const newDisabledTimes = showTimes.reduce((acc, show) => {
                const showDate = moment(show.showDate).format('YYYY-MM-DD');
                console.log("show.showDate",showDate);
                if (showDate === date.format('YYYY-MM-DD')) {

                    return [...acc, show.showTime];
                }
                return acc;
            }, []);


            setDisabledTimes(newDisabledTimes);
        }
    }

    const disabledHours = () => {
        const disabledHoursSet = new Set();

        disabledTimes.forEach(time => {
            const hour = parseInt(time.split(':')[0], 10);
            disabledHoursSet.add(hour);
        });

        return Array.from(disabledHoursSet);

    };

    const disabledMinutes = (selectedHour) => {
        const disabledMinutesSet = new Set();
        disabledTimes.forEach(time => {
            const [hour, minute] = time.split(':').map(Number);
            if (hour === selectedHour) {
                disabledMinutesSet.add(minute);
            }
        });
        console.log("Array.from(disabledHoursSet)",Array.from(disabledMinutesSet));
        return Array.from(disabledMinutesSet);

    };

    const onChange=(date, dateString)=> {
        console.log(date, dateString);
    }

    const renderFooter=()=> {
        return(
        <Flex justify="center" style={{marginTop: "1rem"}}>
            <Button key="submit" type='primary' style={{
                backgroundColor: '#4f6f52',
                borderColor: '#4f6f52',
                color: '#ffffff',
                marginRight: "20px",
            }} onClick={() => form.submit()}>
                Submit
            </Button>
            <Button key="back" onClick={handleCancel}>
                Cancel
            </Button>
        </Flex>
        )

    };


    return (



        <Card style={{height:240,padding:'20px',width:"100%"}}>
            <Flex vertical gap="30px" >
                <Flex vertical aligh = "flex-start">
                    <Typography.Title level={2} strong>
                        Create and View Shows Details
                    </Typography.Title>
                    <Typography.Text type='secondary' strong>
                        View your shows details here!!
                        Add you new show details for the screening....
                    </Typography.Text>
                </Flex>

                <Flex gap="large">
                    <Button  size="large" style={{ backgroundColor: '#4f6f52', borderColor: '#4f6f52', color: '#ffffff' }} onClick={handleClick}>
                        Add Show
                    </Button>
                </Flex>
            </Flex>
            <Flex vertical gap="2rem" style={{width:"700px", height:"300px"}}>
                <Modal title="Add show details" style={{height:"300px",textAlign: "center", color:"#4f6f52"}} open={addMovie} onOk={() => form.submit()}
                       onCancel={handleCancel}
                       footer={renderFooter()}
                >


                    <Flex  justify="center">
                        <Form
                            form={form}
                            autoComplete="off"
                            labelCol={{span: 6}}
                            wrapperCol={{span: 18}}
                            style={
                                {
                                    marginTop: "2rem",
                                    paddingLeft: "0px",
                                    height:"230px",
                                    width:"500px"
                                }
                            }
                            onFinish={handleSave}
                        >
                            <Form.Item
                                name="showDate"
                                label="Show Date"
                                rules={[
                                    {required: true}
                                ]}
                                hasFeedback
                            >
                                <DatePicker
                                    onChange={onDateChange}
                                    disabledDate={(current) => {
                                    return current && current < moment().startOf('day');
                                }} />
                            </Form.Item>

                            <Form.Item
                                name="showTime"
                                label="Show Time"
                                rules={[
                                    {required: true}
                                ]}
                                hasFeedback
                            >
                            <TimePicker onChange={null} defaultOpenValue={dayjs('00:00:00', 'HH:mm:ss')}
                                        disabledHours={disabledHours}
                                        disabledMinutes={disabledMinutes}/>
                            </Form.Item>
                            <Form.Item
                                name="price"
                                label="Ticket cost"
                                rules={[
                                    {required: true, message: "Please enter the ticket cost"},

                                ]}
                                hasFeedback
                            >
                                <Input placeholder="Type the ticket price"/>
                            </Form.Item>

                            <Form.Item
                                name="movieIdName"
                                label="Movie"
                                rules={[
                                    {required: true},
                                ]}
                            >
                                <Select defaultValue={movies[0]}>
                                    {movies.map(num => (
                                        // eslint-disable-next-line react/jsx-no-undef
                                        <Option key={num} value={num}>{num}</Option>
                                    ))}
                                </Select>
                            </Form.Item>

                        </Form>
                    </Flex>

                </Modal>
            </Flex>
        </Card>

    )

}
export default ShowBanner;