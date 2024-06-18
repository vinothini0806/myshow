import {
    Card,
    Flex,
    Typography,
} from 'antd';
import React, {useContext, useState} from 'react';

const MovieBanner= () => {
    return (
        <Card style={{height:220,padding:'20px',width:"100%"}}>
            <Flex vertical gap="30px" >
                <Flex vertical aligh = "flex-start">
                    <Typography.Title level={2} strong>
                        View the the screening movies
                    </Typography.Title>
                    <Typography.Text type='secondary' strong>
                        View new movie here!!
                    </Typography.Text>
                </Flex>

            </Flex>

        </Card>

    )

}
export default MovieBanner;