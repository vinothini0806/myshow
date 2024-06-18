import {Button, Flex, Layout} from "antd";
import {useState} from "react";
import '../styles/Dashboard.css';
import {MenuFoldOutlined, MenuUnfoldOutlined} from "@ant-design/icons";
import CustomHeader from "../components/Header";


import '../styles/Profile.css';
import AdminProfileCard from "../components/AdminProfileCard";
import AdminSidebar from "../components/AdminSidebar";
const {Sider,Header,Content,Footer} = Layout;
const AdminProfile = () =>{
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
                <Content >
                        <Flex justify="center" align="center" >
                            <div style={{marginTop:"90px"}}>
                            <AdminProfileCard/>
                            </div>
                        </Flex>


                </Content>
            </Layout>
        </Layout>
    );
}

export default AdminProfile;