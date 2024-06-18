import {
    Button,
    Card,
    DatePicker,
    Flex,
    Form,
    Input,
    message,
    Modal, Select,
    Space,
    Typography,
    Upload
} from 'antd';
import React, {useContext, useState} from 'react';
import {UploadOutlined} from "@ant-design/icons";
import {createMovie} from "../services/MovieService";

const MovieBanner= () => {
    const [form] = Form.useForm();
    const [addMovie,setAddMovie] = useState(false);
    const [isUploaded,setIsUploaded] = useState(false);
    const [fileList, setFileList] = useState([]);
    const minutes = [...Array(60).keys()].map(num => num + 1);
    const hours = [...Array(3).keys()].map(num => num + 1);
    const language = ['English', 'Sinhala','Tamil']
    const [errorMessage, setErrorMessage] = useState(null);
    const handleClick=()=>{
        setAddMovie(true);

    }
    const handleCancel=(file)=>{
        setAddMovie(false);
        form.resetFields();
        setIsUploaded(false);

    }
    const handleSave=(values)=>{
        if(values){
            console.log(values.name,values.description)
        }else{
            console.log("No")
        }

        try {
            const { name, description, releaseDate, hours, minutes, language } = values;

            const formData = new FormData();
            if (fileList.length > 0) {
                formData.append('image', fileList[0].originFileObj); // Assuming the image is the first file in the list
            }
            formData.append('metadata', JSON.stringify({
                name,
                description,
                releaseDate: releaseDate.format('YYYY-MM-DD'),
                hours,
                minutes,
                language
            }));

            const movieData =  createMovie(formData);

            if (movieData) {

                message.success('Movie created successfully');
                window.location.reload();
            } else {
                message.error('Movie creation failed');
            }
        } catch (error) {
            console.error('Movie creation failed:', error.message);
            setErrorMessage('An error occurred during movie creation. Please try again.');
        } finally {
            setAddMovie(false);
            form.resetFields();
            setIsUploaded(false);
        }

    }
    const handleImageUpload=({file,fileList})=>{
        setFileList(fileList);
        setIsUploaded(fileList.length > 0);


    }
    const onChange=(date, dateString)=> {
        console.log(date, dateString);
    }
    const handleRemove = (file) => {
        setIsUploaded(false);

        setFileList((prevFileList) => {
            const newFileList = prevFileList.filter((item) => item.uid !== file.uid); // This line was improved

            return newFileList;
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
                        marginRight: "20px",
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
                        marginRight: "20px",
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



    return (
        <Card style={{height:220,padding:'20px',width:"100%"}}>
            <Flex vertical gap="30px" >
                <Flex vertical aligh = "flex-start">
                    <Typography.Title level={2} strong>
                        Create and View Movie
                    </Typography.Title>
                    <Typography.Text type='secondary' strong>
                        View your screening movies here!!
                        Add you new movie for the screening....
                    </Typography.Text>
                </Flex>

                <Flex gap="large">
                    <Button  size="large" style={{ backgroundColor: '#4f6f52', borderColor: '#4f6f52', color: '#ffffff' }} onClick={handleClick}>
                        Add Movie
                    </Button>
                </Flex>
            </Flex>
            <Flex vertical gap="2rem" style={{width:"100px", height:"500px"}}>
                <Modal title="Add New Movie" style={{textAlign: "center", color:"#4f6f52"}} open={addMovie} onOk={() => form.submit()}
                       onCancel={handleCancel}
                       footer={renderFooter()}
                >

                    <Flex  justify="center">
                        <Form
                            form={form}
                            autoComplete="off"
                            labelCol={{span: 10}}
                            wrapperCol={{span: 14}}
                            style={
                                {
                                    marginTop: "2rem",
                                    paddingLeft: "0px",
                                    height:"350px"

                                }
                            }
                            onFinish={handleSave}
                        >

                            <Form.Item
                                name="name"
                                label="Movie name"
                                rules={[
                                    {required: true, message: "Please enter the movie name"},
                                    {whitespace: true}
                                ]}
                                hasFeedback
                            >
                                <Input placeholder="Type the movie name"/>
                            </Form.Item>
                            <Form.Item
                                name="description"
                                label="Description"
                                rules={[
                                    {required: true, message: "Please enter about the movie"}
                                ]}
                                hasFeedback
                            >
                                <Input placeholder="Type the movie dexcription"/>
                            </Form.Item>
                            <Form.Item
                                name="imagedata"
                                label="Image"
                                rules={[
                                    {required: true, message: 'Please input the movie poster'}
                                ]}
                            >
                                <Space
                                    direction="vertical"
                                    style={{
                                        width: '100%',
                                    }}
                                    size="large"
                                >
                                    <Upload
                                        listType="picture"
                                        maxCount={1}
                                        fileList={fileList}
                                        onChange={handleImageUpload}
                                        onRemove={handleRemove}
                                    >
                                        <Button icon={<UploadOutlined />} >Upload (Max: 1)</Button>
                                    </Upload>
                                </Space>
                            </Form.Item>
                            <Form.Item
                                name="releaseDate"
                                label="Released Date"
                                rules={[
                                    {required: true}
                                ]}
                                hasFeedback
                            >
                                <DatePicker />
                            </Form.Item>
                            <Form.Item
                                name="hours"
                                label="Duration in hours"

                                rules={[
                                    {required: true}
                                ]}
                                hasFeedback
                            >
                                <Select defaultValue="1">
                                    {hours.map(num => (
                                        // eslint-disable-next-line react/jsx-no-undef
                                        <Option key={num} value={num}>{num}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item
                                name="minutes"
                                label="Minutes"
                                rules={[
                                    {required: true},
                                ]}
                            >
                                <Select defaultValue="1">
                                    {minutes.map(num => (
                                        // eslint-disable-next-line react/jsx-no-undef
                                        <Option key={num} value={num}>{num}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item
                                name="language"
                                label="Language"

                                rules={[
                                    {required: true}
                                ]}
                                hasFeedback
                            >
                                <Select defaultValue="select">
                                    {language.map(lang => (
                                        // eslint-disable-next-line react/jsx-no-undef
                                        <Option key={lang} value={lang}>{lang}</Option>
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
export default MovieBanner;