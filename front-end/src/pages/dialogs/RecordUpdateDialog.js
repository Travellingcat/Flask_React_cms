import React, { Component } from "react";
import {Modal, Form, Input, InputNumber, message} from "antd";
import HttpUtil from "../../Utils/HttpUtil";
import ApiUtil from "../../Utils/ApiUtil";


class RecordUpdateDialog extends Component {
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
            HttpUtil.post(ApiUtil.API_RECORD_UPDATE, {update_data: values, update_id: this.props.edit_record.record_id}).then(re=>{
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
                    title="成绩录入"
                    okText="保存"
                    cancelText="取消"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}>
                    <Form {...this.layout}
                          name="record-messages"
                          ref={this.formRef}
                          // initialValues={this.props.edit_record}
                          onFinish={this.onFinish}
                          validateMessages={this.validateMessages}>
                      {/*<Form.Item name='record_id' label="记录编号" rules={[{ message: '请输入编号!'}]}>*/}
                      {/*  <Input disabled='true'/>*/}
                      {/*</Form.Item>*/}
                      {/*<Form.Item name='record_stu' label="学生" rules={[{ message: '请输入姓名!'}]}>*/}
                      {/*  <Input disabled='true'/>*/}
                      {/*</Form.Item>*/}
                      {/*<Form.Item name='record_course' label="课程" rules={[{ message: '请输入课程!'}]}>*/}
                      {/*    <Input disabled='true'/>*/}
                      {/*</Form.Item>*/}
                      {/*<Form.Item name='record_teacher' label="授课教师" rules={[{ message: '请输入教师!'}]}>*/}
                      {/*    <Input disabled='true'/>*/}
                      {/*</Form.Item>*/}
                      <Form.Item name='scores' label="成绩" rules={[{type: 'number', min: 0, max: 100, required: true, message: '请输入成绩!'},]}>
                        <InputNumber/>
                      </Form.Item>
                    </Form>
                </Modal>
            </div>
        );
    }
}


export default RecordUpdateDialog;