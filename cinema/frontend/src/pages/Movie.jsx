import {Button, Flex, Layout} from "antd";
import {useState} from "react";
import '../styles/Dashboard.css';
import {MenuFoldOutlined, MenuUnfoldOutlined} from "@ant-design/icons";
import CustomHeader from "../components/Header";
import '../styles/Profile.css';
import MovieList from "../components/MovieList";
import MovieBanner from "../components/MovieBanner";
import AdminSidebar from "../components/AdminSidebar";
const {Sider,Header,Content,Footer} = Layout;
const Movie = () =>{
    const [collapsed, setCollapsed] = useState(false)
    return(
        <Layout>
            <Sider theme="light" trigger={null} collapsable collapsed={collapsed} className={'sider'}>
                <AdminSidebar/>
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
                            <MovieBanner/>
                        </Flex>
                        <div style={{ padding: '0px'}}>
                            <MovieList/>
                        </div>
                        </div>


                </Content>
            </Layout>
        </Layout>
    );
}

export default Movie;