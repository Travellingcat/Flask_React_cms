import React, { Component } from "react";
import {Layout, Menu} from 'antd';
import "antd/dist/antd.css";
import { UserOutlined, TrophyOutlined } from '@ant-design/icons';
import TeacherTable from "./tables/TeacherTable";
import RecordsTable from "./tables/RecordsTable";

const {Content, Sider } = Layout;

class TeacherHome extends Component {

    state = {
        menu_choice: 1,         // 当前功能选择
        t_info: [],
    }

    componentDidMount() {
        this.setState({
            t_info: this.props.login_data,
        })
    }

    render() {
        let Message
        // 根据当前的功能选择（menu_choice），来切换组件（TeacherTable、RecordsTable）
        if(this.state.menu_choice === 1){
            Message = (
                <div>
                    <TeacherTable username={this.props.username} t_info={this.props.login_data}/>
                </div>
            )
        }
        else if(this.state.menu_choice === 2){
            Message = (
                <div>
                    <RecordsTable u_cate='teacher' username={this.props.username}/>
                </div>
            )
        }
        return (
            <div>
                <Layout>
                    <Sider theme={"light"}>
                        <Menu theme="light" defaultSelectedKeys={['1']} mode="inline">
                            <Menu.Item key="1" icon={<UserOutlined />} onClick={()=>{
                                // 点击后，修改当前功能
                                this.setState({
                                    menu_choice: 1,
                                })
                            }}>
                                个人信息
                            </Menu.Item>
                            <Menu.Item key="2" icon={<TrophyOutlined />} onClick={()=>{
                                // 点击后，修改当前功能
                                this.setState({
                                    menu_choice: 2,
                                })
                            }}>
                                成绩管理
                            </Menu.Item>
                        </Menu>
                    </Sider>
                    <Content>
                        <div style={{ marginLeft: '40px', marginTop: '15px'}}>当前登录：教师 / {this.props.username}</div>
                        <div style={{ background: '#fff', padding: 24, minHeight: 580, marginLeft:'40px', marginTop: '15px', marginRight:'40px'}}>
                            {Message}
                        </div>
                    </Content>
                  </Layout>
            </div>
        );
    }
}

export default TeacherHome;