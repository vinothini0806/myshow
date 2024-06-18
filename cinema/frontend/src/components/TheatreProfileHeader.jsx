import React, {useState} from 'react';
import {Button, Card, Flex, Form, Input, message, Modal, Select, Space, Typography, Upload} from 'antd';
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import '../styles/TheaterProfileHeader.css';
import {createSeatMap} from "../services/SeatService";

const TheatreProfileHeader = () => {
    const[addSeatMap,setAddSeatMap] = useState(false);
    const [form] = Form.useForm();
    const [errorMessage, setErrorMessage] = useState(null);
    const handleClick=()=>{
        setAddSeatMap(true);

    }
    const handleCancel=(file)=>{
        setAddSeatMap(false);
        form.resetFields();

    }
    const handleSave=(values)=>{

        const { sections } = values;
        console.log("sections",sections);
        try {
                for(var i = 0;i<sections.length;i++){
                    console.log(" sections[i]", sections[i]);
                    const seatData = createSeatMap(
                        sections[i].columns,
                        sections[i].numRows,
                        sections[i].startColumnNumber,
                        sections[i].endColumnNumber,
                        sections[i].startRowNumber,
                        sections[i].endRowNumber
                    );
                    if (seatData) {
                        message.success('Seat Map created successfully');
                        window.location.reload();
                    } else {
                        message.error('Movie creation failed');
                    }
                }



        } catch (error) {
            console.error('Movie creation failed:', error.message);
            setErrorMessage('An error occurred during movie creation. Please try again.');
        } finally {
            setAddSeatMap(false);
            form.resetFields();
        }

    }
    const renderFooter=()=> {
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

    };
    const order = {
        po_number: "123abc",
        carrier: "Fastway",
        items: [
            {
                item_code: "dnh75n",
                quantity: "10",
                special_requirements: "Add picture of happy dog"
            },
            {
                item_code: "456def",
                quantity: "4",
                special_requirements: "Do not include lids"
            }
        ]
    };

    const itemInputs = order.items
    return (
        <Card className="theatre-profile-header" style={{ padding: '20px' }}>
            <Flex vertical gap="30px" >
                <Flex vertical aligh = "flex-start">
                    <Typography.Title level={2} strong>
                        Create and Edit the Seat Map
                    </Typography.Title>
                    <Typography.Text type='secondary' strong>
                        Design and allocate optimal seating for your cinema to enhance viewer experience.
                    </Typography.Text>
                </Flex>

                <Flex gap="large">
                    <Button  size="large" style={{ backgroundColor: '#4f6f52', borderColor: '#4f6f52', color: '#ffffff' }}
                             onClick={handleClick}
                    >
                        Add Seat Map
                    </Button>
                    <Button  size="large" className="gray--color"

                    >
                        Edit Seat Map
                    </Button>
                </Flex>
            </Flex>
            <Flex vertical gap="2rem" style={{width:"400px", height:"500px"}}>
                <Modal title="Add Seat Map" bodyStyle={{ maxHeight: '80vh', overflow: 'auto' }} // Set maxHeight and overflow for the modal body
                       style={{textAlign: "center", color:"#4f6f52",minWidth: "300px", minHeight: "300px"}} open={addSeatMap} onOk={() => form.submit()}
                       onCancel={handleCancel}
                       footer={renderFooter()}
                >


                    <Flex  justify="center" style={{width:"400px", height:"500px"}}>
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


                            <Form.List name="sections">
                                {(fields, { add, remove }) => (
                                    <>
                                        {fields.map((field) => (
                                            <div key={field.key}>
                                                <Form.Item
                                                    {...field}
                                                    label="Number of columns"
                                                    name={[field.name, "columns"]}
                                                >
                                                    <Input />
                                                </Form.Item>
                                                <Form.Item
                                                    {...field}
                                                    label="Number of rows"
                                                    name={[field.name, "numRows"]}
                                                >
                                                    <Input />
                                                </Form.Item>
                                                <Form.Item
                                                    {...field}
                                                    label="Start column number"
                                                    name={[field.name, "startColumnNumber"]}
                                                >
                                                    <Input />
                                                </Form.Item>
                                                <Form.Item
                                                    {...field}
                                                    label="End column number"
                                                    name={[field.name, "endColumnNumber"]}
                                                >
                                                    <Input />
                                                </Form.Item>
                                                <Form.Item
                                                    {...field}
                                                    label="Start Row letter"
                                                    name={[field.name, "startRowNumber"]}
                                                >
                                                    <Input />
                                                </Form.Item>
                                                <Form.Item
                                                    {...field}
                                                    label="End row number"
                                                    name={[field.name, "endRowNumber"]}
                                                >
                                                    <Input />
                                                </Form.Item>
                                                <MinusCircleOutlined onClick={() => remove(field.name)} />
                                            </div>
                                        ))}
                                        <Form.Item style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                            <Button
                                                type="dashed"
                                                size="large"
                                                justify="center"
                                                onClick={() => add()}
                                                // block
                                                style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                                                icon={<PlusOutlined />}
                                            >
                                                Add Section
                                            </Button>
                                        </Form.Item>
                                    </>
                                )}
                            </Form.List>





                        </Form>
                    </Flex>

                </Modal>
            </Flex>
        </Card>
    );
};

export default TheatreProfileHeader;
