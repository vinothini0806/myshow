import {Button, Layout} from "antd";
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
const {Sider,Header,Content,Footer} = Layout;
const Profile = () =>{
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
                    <div className="left-column">
                        <ProfileHeader/>
                        <div className="spacer"></div>
                        <ProfileCard/>
                    </div>
                    <div className="spacer-vertical"></div>
                    <div className="right-column">
                        <TheatreProfileHeader/>
                        <div className="spacer"></div>
                        <TheatreProfileCard/>
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
}

export default Profile;