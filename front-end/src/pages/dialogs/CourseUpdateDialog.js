import React, { Component } from "react";
import {Modal, Form, Input, InputNumber, message} from "antd";
import HttpUtil from "../../Utils/HttpUtil";
import ApiUtil from "../../Utils/ApiUtil";


class CourseUpdateDialog extends Component {
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
        // 表单回显
        setTimeout(()=>{this.formRef.current.setFieldsValue(this.props.edit_record);}, 100);
    }

    onReset = ()=>{
        this.formRef.current.resetFields();
    }

    handleOk = () => {
        this.setState({
            visible: false,
        });
        this.formRef.current.validateFields().then(values => {
            HttpUtil.post(ApiUtil.API_COURSE_UPDATE, {update_data: values, update_id: this.props.edit_record.c_id}).then(re=>{
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
                    title="课程编辑（修改前请确认相关选课信息已清理！）"
                    okText="保存"
                    cancelText="取消"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}>
                    <Form {...this.layout}
                          name="teacher-update-messages"
                          ref={this.formRef}
                          // initialValues={this.props.edit_record}
                          onFinish={this.onFinish}
                          onReset={this.onReset}                    // 表单回显
                          validateMessages={this.validateMessages}>
                      <Form.Item name='c_id' label="课程编号" rules={[{required: true, message: '请输入课程编号!'}]}>
                        <Input />
                      </Form.Item>
                      <Form.Item name='c_name' label="课程名" rules={[{required: true, message: '请输入课程名!'}]}>
                        <Input />
                      </Form.Item>
                      <Form.Item name='c_teacher' label="授课教师" rules={[{required: true, message: '请输入授课教师!'}]}>
                        <Input />
                      </Form.Item>
                      <Form.Item name='c_term' label="所属学期" rules={[{required: true, type: 'number', min: 1, max: 8, message: '请输入所属学期!'},]}>
                        <InputNumber />
                      </Form.Item>
                    </Form>
                </Modal>
            </div>
        );
    }
}


export default CourseUpdateDialog;