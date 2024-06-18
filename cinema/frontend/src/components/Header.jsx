
import {Avatar, Flex, Typography} from 'antd';
import Search from "antd/es/input/Search";
import {MessageOutlined, NotificationOutlined, UserOutlined} from "@ant-design/icons";

const CustomHeader = () => {
    const user = {sub: localStorage.getItem("user")};

    return (
        <Flex align='center' justify='space-between'>
            <Typography.Title level={3} type="secondary">
                Welcome back {user.sub}
            </Typography.Title>
            <Flex align="center" gap="3rem">
                <Search placeholder="Search Dashboard" allowClear/>
            <Flex align="center" gap="10px">
                <Avatar icon={<UserOutlined/>}/>
            </Flex>
        </Flex>
        </Flex>

    );
};
export default CustomHeader;