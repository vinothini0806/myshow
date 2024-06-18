import {Button, Flex, Layout} from "antd";
import {useState} from "react";
import Sidebar from "../components/Sidebar";
import '../styles/Dashboard.css';
import {MenuFoldOutlined, MenuUnfoldOutlined} from "@ant-design/icons";
import CustomHeader from "../components/Header";

import '../styles/Profile.css';
import ShowBanner from "../components/ShowBanner";
const {Sider,Header,Content,Footer} = Layout;
const Artist = () =>{
    const [collapsed, setCollapsed] = useState(false)
    return(
        <Layout>
            <Sider theme="light" trigger={null} collapsable collapsed={collapsed} className={'sider'}>
                <Sidebar/>
                <Button
                    type="text"
                    icon={collapsed? <MenuUnfoldOutlined/> : <MenuFoldOutlined/>}
                    onClick={()=> setCollapsed(!collapsed)}
                    className="trigger-btn"
                />
            </Sider>
            <Layout>
                <Header className='header'>
                    <CustomHeader/>
                </Header>
                <Content className='content'>
                    <div style={{flex: 1, padding: '20px'}}>
                        <Flex vertical gap="2.3rem">
                            <ShowBanner/>
                        </Flex>
                    </div>


                </Content>
            </Layout>
        </Layout>
    );
}

export default Artist;