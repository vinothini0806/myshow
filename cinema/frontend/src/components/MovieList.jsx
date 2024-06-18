import React, { useEffect, useState } from "react";
import '../App.css';
import {
    Button,
    Card,
    Flex,
    Typography,
    Image,
    Modal,
    Form,
    Input,
    Space,
    Upload,
    DatePicker,
    Select,
    message
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { getAllMovies, updateMovie,deleteMovieById} from "../services/MovieService";
import { useMovieContext } from '../context/MovieContext';
import dayjs from "dayjs";
const { Meta } = Card;
const { Option } = Select;

const MovieList = () => {
    const [sliceMovieData, setSliceMovieData] = useState([]);
    const [movieData, setMovieData] = useState([]);
    const [error, setError] = useState('');
    const [viewAllState, setViewAllState] = useState(false);
    const [viewMovie, setViewMovie] = useState(null);
    const [editMovie, setEditMovie] = useState(null);
    const [deleteMovie, setDeleteMovie] = useState(null);
    const [isUploaded, setIsUploaded] = useState(false);
    const [fileList, setFileList] = useState([]);
    const [form] = Form.useForm();
    const { movies } = useMovieContext();
    const language = ['English', 'Sinhala','Tamil']
    const dateFormat = 'YYYY/MM/DD';

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
    const minutes = [...Array(60).keys()].map(num => num + 1);
    const hours = [...Array(3).keys()].map(num => num + 1);

    const handleClickView = (movie) => {
        setViewMovie(movie);
    };

    const handleClickEdit = (movie) => {
        setEditMovie(movie);

        setFileList([
            {
                uid:'1',
                name: movie.fileName,
                thumbUrl: `data:image/jpeg;base64,${movie.imageData}`,
                originFileObj: movie.imageData
            }
        ]);


        form.setFieldsValue({
            name: movie.name,
            description: movie.description,
            releaseDate: movie.releaseDate ? dayjs(movie.releaseDate, dateFormat) : null,
            hours: movie.hours,
            minutes: movie.minutes,
            language: movie.language,
            imagedata: fileList.length > 0 ? [{  // Check if fileList is not empty
                name: fileList[0].name,  // Set the file name
                thumbUrl: fileList[0].thumbUrl // Set the file URL if available
            }] : null


        });


    }
    const handleClickDelete = (movie) => {
        setDeleteMovie(movie);
    };

    const handleCancel = () => {
        setEditMovie(null);
        setDeleteMovie(null);
        setViewMovie(null);
        form.resetFields();
        setIsUploaded(false);
    };
    const handleSave = async (values) => {
        if (!values) {
            console.log("No values to save");
            return;
        }

        try {
            const values = await form.validateFields();
            const { name, description, releaseDate, hours, minutes, language } = values;


            const movieDetails = {
                id: editMovie.id,
                name: name || editMovie.name,
                description: description || editMovie.description,
                releaseDate: releaseDate ? dayjs(releaseDate, dateFormat) : null,
                hours: hours || editMovie.hours,
                minutes: minutes || editMovie.minutes,
                language: language || editMovie.language
            };


            const formData = new FormData();
            console.log("fileList[0]",fileList[0])

            if (fileList.length > 0) {
                formData.append('image', fileList[0].originFileObj);
            }


            formData.append('metadata', JSON.stringify(movieDetails));


            const editedFields = Object.keys(values);


            form.validateFields(editedFields);


            const movieData = await updateMovie(formData);

            if (movieData) {
                message.success('Movie edited successfully');
                window.location.reload();
            } else {
                message.error('Movie editing failed');
            }
        } catch (error) {
            console.error('Movie editing failed:', error.message);
            message.error('Movie editing failed: ' + error.message);
        } finally {
            setEditMovie(null);
            form.resetFields();
            setIsUploaded(false);
        }
    };


    const handleSaveDelete = async () => {
        console.log("id",deleteMovie.id)
        try {
            const response = await deleteMovieById(deleteMovie.id);

            if (response) {
                message.success('Movie deleted successfully');
                window.location.reload();
            } else {
                message.error('Movie deleting failed');
            }
        } catch {
            console.error('Movie deleting failed:', error.message);
            message.error('This movie has shows, you cannot delete ' + error.message);
        } finally {
            setDeleteMovie(null);
            form.resetFields();
            setIsUploaded(false);
        }
    };

    const handleSaveView = () => {
        setViewMovie(null);
    };

    const handleImageUpload=({file,fileList})=>{
        setFileList(fileList); // This line was improved
        setIsUploaded(fileList.length > 0); // This line was improved


    }

    const onChange = (date, dateString) => {
        console.log(date, dateString);
    };

    const handleRemove = (file) => {
        setIsUploaded(false);
        setFileList((prevFileList) => {
            return prevFileList.filter((item) => item.uid !== file.uid);
        });
    };
    const renderFooter=()=> {

        if (isUploaded || (fileList.length !== 0)) {
            return (
                <Flex justify="center" style={{marginTop: "8rem"}}>
                    <Button key="submit" type='primary' style={{
                        backgroundColor: '#4f6f52',
                        borderColor: '#4f6f52',
                        color: '#ffffff',
                        // marginLeft: "150px",
                        marginRight: "20px",
                        // marginTop: "1rem"
                    }} onClick={() => form.submit()}>
                        Submit
                    </Button>
                    <Button key="back" onClick={handleCancel}>
                        Cancel
                    </Button>
                </Flex>
            );
        } else if(!isUploaded || fileList.length === 0){
            return (
                <Flex justify="center" style={{marginBottom: "2rem",marginTop: "4rem"}}>
                    <Button key="submit" type='primary' style={{
                        backgroundColor: '#4f6f52',
                        borderColor: '#4f6f52',
                        color: '#ffffff',
                        // marginLeft: "150px",
                        marginRight: "20px",
                        // marginTop: "1rem"
                    }} onClick={() => form.submit()}>
                        Submit
                    </Button>
                    <Button key="back" onClick={handleCancel}>
                        Cancel
                    </Button>
                </Flex>

            );
        }
    };

    const renderFooterDelete = () => {
        return (
            <Flex justify="center" style={{ marginTop: "5rem" }}>
                <Button key="submit" type='primary' style={{ backgroundColor: '#8B0000', borderColor: '#8B0000', color: '#ffffff', marginRight: "20px" }} onClick={handleSaveDelete}>
                    Delete
                </Button>
                <Button key="back" onClick={handleCancel}>
                    Cancel
                </Button>
            </Flex>
        );
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
                            <Flex gap="1rem">
                                <Button type="link" size="large" style={{
                                    backgroundColor: '#4f6f52',
                                    borderColor: '#4f6f52',
                                    color: '#ffffff',
                                    marginTop: '1rem',
                                    marginLeft: '33px'
                                }} onClick={() => handleClickEdit(movie)}>
                                    Edit Movie
                                </Button>
                                <Button type="link" size="large" style={{
                                    backgroundColor: '#8B0000',
                                    borderColor: '#8B0000',
                                    color: '#ffffff',
                                    marginTop: '1rem',
                                    marginLeft: '20px'
                                }} onClick={() => handleClickDelete(movie)}>
                                    Delete Movie
                                </Button>
                            </Flex>
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

            {editMovie && (
                <Modal title="Edit the Movie details" style={{ textAlign: "center", color: "#4f6f52" }} open={true} onOk={() => form.submit()} onCancel={handleCancel} footer={renderFooter()}>
                    <Flex justify="center">
                        <Form form={form} autoComplete="off" labelCol={{ span: 10 }} wrapperCol={{ span: 14 }} style={{ marginTop: "2rem", paddingLeft: "0px", height: "350px" }}
                              onFinish={handleSave}>
                            <Form.Item name="name" label="Movie name" rules={[{ required: true, message: "Please enter the movie name" }, { whitespace: true }]} hasFeedback>
                                <Input />
                            </Form.Item>
                            <Form.Item name="description" label="Description" rules={[{ required: true, message: "Please enter about the movie"}]} hasFeedback>
                                <Input />
                            </Form.Item>
                            <Form.Item name="imagedata" label="Image" rules={[{ required: true, message: 'Please input the movie poster' }]}>
                                <Space direction="vertical" style={{ width: '100%' }} size="large">
                                    <Upload listType="picture"
                                            maxCount={1}
                                            fileList={fileList}
                                            onChange={handleImageUpload}
                                            onRemove={handleRemove}
                                            >
                                        <Button icon={<UploadOutlined/>} >

                                                Upload (Max: 1)

                                        </Button>

                                    </Upload>
                                </Space>
                            </Form.Item>
                            <Form.Item name="releaseDate" label="Released Date" rules={[{required: true}]}
                                       hasFeedback>
                                {/* eslint-disable-next-line no-undef */}
                                <DatePicker />
                            </Form.Item>
                            <Form.Item name="hours" label="Duration in hours" rules={[{ required: true}]} hasFeedback>
                                <Select>
                                    {hours.map(num => (
                                        <Option key={num} value={num}>{num}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item name="minutes" label="Minutes" rules={[{ required: true}]}>
                                <Select>
                                    {minutes.map(num => (
                                        <Option key={num} value={num}>{num}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item
                                name="language"
                                label="Language"

                                rules={[
                                    {required: true,trigger: 'submit'}
                                ]}
                                hasFeedback
                            >
                                <Select>
                                    {language.map(lang => (
                                        // eslint-disable-next-line react/jsx-no-undef
                                        <Option key={lang} value={lang}>{lang}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Form>
                    </Flex>
                </Modal>
            )}

            {deleteMovie && (
                <Modal title="Do you want to delete a movie?" style={{ textAlign: "center", color: "#4f6f52" }} open={true} footer={renderFooterDelete()}>
                </Modal>
            )}
        </>
    );
};

export default MovieList;
