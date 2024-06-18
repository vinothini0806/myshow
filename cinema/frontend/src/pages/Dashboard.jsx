import {Button, Layout} from "antd";
import {useState} from "react";
import Sidebar from "../components/Sidebar";
import '../styles/Dashboard.css';
import {MenuFoldOutlined, MenuUnfoldOutlined} from "@ant-design/icons";
import CustomHeader from "../components/Header";
const {Sider,Header,Content} = Layout;
const Dashboard = () =>{
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
            <Content className='content'></Content>
        </Layout>
    </Layout>
    );
}

export default Dashboard;