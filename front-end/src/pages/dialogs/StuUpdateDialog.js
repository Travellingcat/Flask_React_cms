import React, { Component } from "react";
import {Modal, Form, Input, InputNumber, Select, message} from "antd";
import HttpUtil from "../../Utils/HttpUtil";
import ApiUtil from "../../Utils/ApiUtil";

const { Option } = Select;

class StuUpdateDialog extends Component {
    state ={
        visible: false,             // 控制当前组件是否可见
        login_bool: true,           // 当前登录的是否是管理员admin
    }
    formRef = React.createRef();

    componentWillReceiveProps(newProps) {
        //可以传递父组件值进来
        if(this.state.visible !== newProps.visible){
            this.setState({
                visible: newProps.visible       //子组件和父组件一致
            });
        }
        if(newProps.current_user === 'admin'){
            this.setState({
                login_bool: false,
            })
        }
        // 表单回显
        setTimeout(()=>{this.formRef.current.setFieldsValue(this.props.edit_record);}, 100);
    }
    onReset = ()=>{
        this.formRef.current.resetFields();
    }

    // 学生信息修改表单，提交之后的处理函数
    handleOk = () => {
        // 将当前的修改对话框组件，变成不可见
        this.setState({
            visible: false,
        });
        // 处理表单
        this.formRef.current.validateFields().then(values => {
            console.log(values)
            // post方法，通过API_STU_UPDATE接口，向后端发送数据
            HttpUtil.post(ApiUtil.API_STU_UPDATE, {update_data: values, update_id: this.props.edit_record.stu_id}).then(re=>{
                message.info(re.message)
            }).catch(error=>{
                message.error(error.message)
            })
        }).catch(err => {
            message.info('失败！')
        });
        this.props.afterClose();
    };

    handleCancel = () => {
        this.setState({
            visible: false,
        })
        this.props.afterClose();
    };

    layout = {
      labelCol: {
        span: 8,
      },
      wrapperCol: {
        span: 16,
      },
    };

    validateMessages = {
      required: '${label} is required!',
      types: {
        email: '${label} is not a valid email!',
        number: '${label} is not a valid number!',
      },
      number: {
        range: '${label} must be between ${min} and ${max}',
      },
    };

    onFinish = (values) => {
        console.log(values);
      };

    render() {

        return(
            <div>
                <Modal
                    title="学生信息修改"
                    okText="保存"
                    cancelText="取消"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}>
                    <Form {...this.layout}
                          name="stu-messages"
                          ref={this.formRef}
                          // initialValues={this.props.edit_record}
                          onFinish={this.onFinish}
                          onReset={this.onReset}                    // 表单回显
                          validateMessages={this.validateMessages}>
                      <Form.Item name='stu_id' label="学号" rules={[{ required: true, message: '请输入学号!'}]}>
                        <Input disabled={this.state.login_bool}/>
                      </Form.Item>
                      <Form.Item name='stu_name' label="姓名" rules={[{required: true, message: '请输入姓名!'}]}>
                        <Input disabled={this.state.login_bool}/>
                      </Form.Item>
                      <Form.Item name='stu_sex' label="性别" rules={[{required: true, message: '请输入性别!'}]}>
                          <Select>
                              <Option value="男">男</Option>
                              <Option value="女">女</Option>
                          </Select>
                      </Form.Item>
                      <Form.Item name='stu_age' label="年龄" rules={[{required: true, type: 'number', min: 1, max: 99, message: '请输入年龄!'},]}>
                        <InputNumber/>
                      </Form.Item>
                      <Form.Item name='stu_address' label="家庭住址" rules={[{required: true, message: '请输入家庭住址!'}]}>
                        <Input/>
                      </Form.Item>
                      <Form.Item name='stu_class' label="所在班级" rules={[{required: true, message: '请输入所在班级!'}]}>
                        <Input  disabled={this.state.login_bool}/>
                      </Form.Item>
                      <Form.Item name='stu_term' label="当前学期" rules={[{required: true, type: 'number', min: 1, max: 8, message: '请输入当前学期!'}]}>
                        <InputNumber disabled={this.state.login_bool}/>
                      </Form.Item>
                      <Form.Item name='stu_password' label="密码" rules={[{required: true, message: '请输入密码!'}]}>
                        <Input/>
                      </Form.Item>
                    </Form>
                </Modal>
            </div>
        );
    }
}


export default StuUpdateDialog;