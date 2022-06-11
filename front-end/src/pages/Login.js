import React, { Component } from "react";
import "antd/dist/antd.css";
import {Form, Input, Button, message} from 'antd';
import HttpUtil from "../Utils/HttpUtil";
import ApiUtil from "../Utils/ApiUtil";

class Login extends Component {

    state = {
    }

    // 登录表单提交后的处理函数
    onFinish = (values) => {
        //post方法，把表单提交的数据通过（ApiUtil.API_LOGIN）接口发送给后端处理，并接收返回结果re
        HttpUtil.post(ApiUtil.API_LOGIN, values).then(re=>{
            // 如果后端登录验证成功，且返回的用户类型是学生stu
            if(re.u_cate === 'stu'){
                // 修改父组件的登录信息
                this.props.switchLogin({name: values.username, categ: 'stu', udata: re.u_data});
            }
            // 如果后端登录验证成功，且返回的用户类型是教师teacher
            else if(re.u_cate === 'teacher'){
                // 修改父组件的登录信息
                this.props.switchLogin({name: values.username, categ: 'teacher', udata: re.u_data});
            }
            // 如果后端登录验证成功，且返回的用户类型是管理员admin
            else if(re.u_cate === 'admin'){
                // 修改父组件的登录信息
                this.props.switchLogin({name: values.username, categ: 'admin'});
            }
            // 后端登录验证失败
            else {
                message.error('用户名或密码错误！')
            }
        }).catch(error=>{
            message.error(error.message);
        });
    };

    onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    render() {

        return (
            <div>
                <div style={{margin:'10%'}}>
                        <Form
                            name="basic"
                            labelCol={{
                                span: 9,
                            }}
                            wrapperCol={{
                                span: 6,
                            }}
                            initialValues={{
                                remember: true,
                            }}
                            onFinish={this.onFinish}
                            onFinishFailed={this.onFinishFailed}
                            autoComplete="off"
                        >
                            <Form.Item label="用户名" name="username"
                                       rules={[{required: true, message: '请输入用户名!',},]}>
                                <Input/>
                            </Form.Item>

                            <Form.Item label="密码" name="password"
                                       rules={[{required: true, message: '请输入密码!',},]}>
                                <Input.Password/>
                            </Form.Item>

                            <Form.Item wrapperCol={{offset: 11, span: 16,}}>
                                <Button type="primary" htmlType="submit">
                                    登录
                                </Button>
                            </Form.Item>
                        </Form>
                </div>
            </div>
        );
    }
}

export default Login;