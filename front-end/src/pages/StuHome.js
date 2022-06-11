import React, { Component } from "react";
import {Layout, Menu, Button} from 'antd';
import "antd/dist/antd.css";
import { UserOutlined, TrophyOutlined, SolutionOutlined } from '@ant-design/icons';
import StuTable from "./tables/StuTable";
import CourseTable from "./tables/CourseTable";
import RecordsTable from "./tables/RecordsTable";

const {Content, Sider } = Layout;

class StuHome extends Component {
    state = {
        menu_choice: 1,         //功能选择
        stu_info: [],
    }

    componentDidMount() {
        this.setState({
            stu_info: this.props.login_data,
        })
    }

    render() {
        let Message
        // 根据当前的功能（menu_choice），来修改组件（StuTable、CourseTable、RecordsTable）
        if(this.state.menu_choice === 1){
            Message = (
                <div>
                    <StuTable username={this.props.username} stu_info={this.props.login_data}/>
                </div>
            )
        }
        else if(this.state.menu_choice === 2){
            Message = (
                <div>
                    <CourseTable username={this.props.username} stu_info={this.props.login_data}/>
                </div>
            )
        }
        else if(this.state.menu_choice === 3){
            Message = (
                <div>
                    <RecordsTable u_cate='stu' username={this.props.username}/>
                </div>
            )
        }
        return (
            <div>
                <Layout>
                    <Sider theme={"light"}>
                        <Menu theme="light" defaultSelectedKeys={['1']} mode="inline">
                            <Menu.Item key="1" icon={<UserOutlined />} onClick={()=>{
                                // 修改当前功能
                                this.setState({
                                    menu_choice: 1,
                                })
                            }}>
                                个人信息
                            </Menu.Item>
                            <Menu.Item key="2" icon={<SolutionOutlined />} onClick={()=>{
                                // 修改当前功能
                                this.setState({
                                    menu_choice: 2,
                                })
                            }}>
                                课程查询
                            </Menu.Item>
                            <Menu.Item key="3" icon={<TrophyOutlined />} onClick={()=>{
                                // 修改当前功能
                                this.setState({
                                    menu_choice: 3,
                                })
                            }}>
                                成绩查询
                            </Menu.Item>
                        </Menu>
                    </Sider>
                    <Content>
                        <div style={{ marginLeft: '40px', marginTop: '15px'}}>当前登录：学生 / {this.props.username}</div>
                        <div style={{ background: '#fff', padding: 24, minHeight: 580, marginLeft:'40px', marginTop: '15px', marginRight:'40px'}}>
                            {Message}
                        </div>
                    </Content>
                  </Layout>
            </div>
        );
    }
}

export default StuHome;