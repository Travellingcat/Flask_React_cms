import React, { Component } from "react";
import {Layout, Menu, Button,Space} from 'antd';
import "antd/dist/antd.css";
import {TeamOutlined, TableOutlined, TrophyOutlined } from '@ant-design/icons';
import StuTable from "./tables/StuTable";
import TeacherTable from "./tables/TeacherTable";
import CourseTable from "./tables/CourseTable";
import RecordsTable from "./tables/RecordsTable";

const {Content, Sider } = Layout;

class AdminHome extends Component {

    state = {
        menu_choice: 1,         // 当前功能选择
    }

    render() {
        let Message
        //根据当前的功能选择（menu_choice），切换组件（StuTable、TeacherTable、CourseTable、RecordsTable）
        if(this.state.menu_choice === 1){
            Message = (
                <div>
                    <StuTable  username='admin'/>
                </div>
            )
        }
        else if(this.state.menu_choice === 2){
            Message = (
                <div>
                    <TeacherTable username='admin'/>
                </div>
            )
        }
        else if(this.state.menu_choice === 3){
            Message = (
                <div>
                    <CourseTable username='admin'/>
                </div>
            )
        }
        else if(this.state.menu_choice === 4){
            Message = (
                <div>
                    <RecordsTable username='admin'/>
                </div>
            )
        }
        return (
            <div>
                <Layout>
                    <Sider theme={"light"}>
                        <Menu theme="light" defaultSelectedKeys={['1']} mode="inline">
                            <Menu.Item key="1" icon={<TeamOutlined />} onClick={()=>{
                                //点击后，修改当前功能
                                this.setState({
                                    menu_choice: 1
                                })
                            }}>
                                学生管理
                            </Menu.Item>
                            <Menu.Item key="2" icon={<TeamOutlined />} onClick={()=>{
                                //点击后，修改当前功能
                                this.setState({
                                    menu_choice: 2
                                })
                            }}>
                                教师管理
                            </Menu.Item>
                            <Menu.Item key="3" icon={<TableOutlined />} onClick={()=>{
                                //点击后，修改当前功能
                                this.setState({
                                    menu_choice: 3
                                })
                            }}>
                                课程管理
                            </Menu.Item>
                            <Menu.Item key="4" icon={<TrophyOutlined />} onClick={()=>{
                                //点击后，修改当前功能
                                this.setState({
                                    menu_choice: 4
                                })
                            }}>
                                成绩查询
                            </Menu.Item>
                        </Menu>
                    </Sider>
                    <Content>
                        <div style={{ marginLeft: '40px', marginTop: '15px'}}>当前登录：管理员</div>
                        <div style={{ background: '#fff', padding: 24, minHeight: 580, marginLeft:'40px', marginTop: '15px', marginRight:'40px'}}>
                            {Message}
                        </div>
                    </Content>
                  </Layout>
            </div>
        );
    }
}

export default AdminHome;