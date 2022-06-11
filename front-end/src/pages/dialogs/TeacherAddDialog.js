import React, { Component } from "react";
import {Modal, Form, Input, InputNumber, Select, message} from "antd";
import HttpUtil from "../../Utils/HttpUtil";
import ApiUtil from "../../Utils/ApiUtil";

const { Option } = Select;

class TeacherAddDialog extends Component {
    state ={
        visible: false,
    }
    formRef = React.createRef();

    componentWillReceiveProps(newProps) {
        //可以传递父组件值进来
        if(this.state.visible !== newProps.visible){
            this.setState({
                visible: newProps.visible       //子组件和父组件一致
            });
        }
    }

    handleOk = () => {
        this.setState({
             visible: false,
        });
        this.formRef.current.validateFields().then(values => {
            HttpUtil.post(ApiUtil.API_TEA_ADD, {add_data: values}).then(re=>{
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
                    title="教师用户新增"
                    okText="保存"
                    cancelText="取消"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}>
                    <Form {...this.layout} name="t-messages" ref={this.formRef} onFinish={this.onFinish} validateMessages={this.validateMessages}>
                      <Form.Item name='t_id' label="工号" rules={[{required: true, message: '请输入工号!'}]}>
                        <Input disabled={this.state.login_bool}/>
                      </Form.Item>
                      <Form.Item name='t_name' label="姓名" rules={[{required: true, message: '请输入姓名!'}]}>
                        <Input/>
                      </Form.Item>
                      <Form.Item name='t_sex' label="性别" rules={[{required: true, message: '请输入性别!'}]}>
                          <Select>
                              <Option value="男">男</Option>
                              <Option value="女">女</Option>
                          </Select>
                      </Form.Item>
                      <Form.Item name='t_age' label="年龄" rules={[{type: 'number', min: 1, max: 99, required: true, message: '请输入年龄!'},]}>
                        <InputNumber/>
                      </Form.Item>
                      <Form.Item name='t_password' label="密码" rules={[{required: true, message: '请输入密码!'}]}>
                        <Input/>
                      </Form.Item>
                    </Form>
                </Modal>
            </div>
        );
    }
}


export default TeacherAddDialog;