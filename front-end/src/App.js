import React, {Component} from "react";
import 'antd/dist/antd.css';
import './App.css';
import {Layout} from "antd";
import Login from "./pages/Login";
import StuHome from "./pages/StuHome";
import TeacherHome from "./pages/TeacherHome";
import AdminHome from "./pages/AdminHome";

const { Header } = Layout;

class App extends Component{
    state = {
        loginIn: {
            username: '',       //当前登录用户名
            category: '',       //登录类别（学生、教师、admin）
            login_data: [],     //登录人的详细信息
        },
    }

    //修改当前登录信息（loginIn）
    switchLogin = (value)=>{
        this.setState({
            loginIn: {username: value.name, category: value.categ, login_data: value.udata},
        })
    }

    render() {
        //根据当前的登录信息来选择渲染哪个组件，默认是登录组件（Login）
        let Message
        if(this.state.loginIn.category === 'stu'){
            Message = (
                <StuHome username={this.state.loginIn.username} login_data={this.state.loginIn.login_data}/>
            )
        }
        else if(this.state.loginIn.category === 'teacher'){
            Message = (
                <TeacherHome username={this.state.loginIn.username} login_data={this.state.loginIn.login_data}/>
            )
        }
        else if(this.state.loginIn.category === 'admin'){
            Message = (
                <AdminHome username={this.state.loginIn.username}/>
            )
        }
        else {
            Message = (
                <Login switchLogin={this.switchLogin}/>
            )
        }
        return (
            <div>
                <Layout style={{minHeight: 720}}>
                    <Header style={{backgroundColor:"#40a9ff"}}>
                      <div style={{lineHeight:'64px', fontSize:"20px", color:"black", textAlign:"center"}}>
                        学生信息管理系统
                      </div>
                    </Header>

                    {Message}

              </Layout>
            </div>

        );
    }
}

export default App;
