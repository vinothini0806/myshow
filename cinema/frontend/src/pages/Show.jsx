import {Button, Flex, Layout} from "antd";
import {useState} from "react";
import Sidebar from "../components/Sidebar";
import '../styles/Dashboard.css';
import {MenuFoldOutlined, MenuUnfoldOutlined} from "@ant-design/icons";
import CustomHeader from "../components/Header";
import ProfileCard from "../components/ProfileCard";
import ProfileHeader from "../components/ProfileHeader";

import '../styles/Profile.css';
import TheatreProfileHeader from "../components/TheatreProfileHeader";
import TheatreProfileCard from "../components/TheatreProfileCard";
import MovieList from "../components/MovieList";
import MovieBanner from "../components/MovieBanner";
import ShowBanner from "../components/ShowBanner";
import ShowCard from "../components/ShowCard";
const {Sider,Header,Content,Footer} = Layout;
const Show = () =>{
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
                            <ShowCard/>
                        </Flex>
                    </div>


                </Content>
            </Layout>
        </Layout>
    );
}

export default Show;