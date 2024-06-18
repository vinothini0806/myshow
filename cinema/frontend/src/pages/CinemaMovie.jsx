import {Button, Flex, Layout} from "antd";
import {useState} from "react";
import Sidebar from "../components/Sidebar";
import '../styles/Dashboard.css';
import {MenuFoldOutlined, MenuUnfoldOutlined} from "@ant-design/icons";
import CustomHeader from "../components/Header";


import '../styles/Profile.css';

import CinemaMovieBanner from "../components/CinemaMovieBanner";
import CinemaMovieList from "../components/CinemaMovieList";
const {Sider,Header,Content,Footer} = Layout;
const CinemaMovie = () =>{
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
                    <div style={{flex: 1, padding: '5px'}}>
                        <Flex vertical gap="2.3rem">
                            <CinemaMovieBanner/>
                        </Flex>
                        <div style={{ padding: '0px'}}>
                            <CinemaMovieList/>
                        </div>
                    </div>


                </Content>
            </Layout>
        </Layout>
    );
}

export default CinemaMovie;