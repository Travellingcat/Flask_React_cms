import React, { Component } from "react";
import {Modal, Form, Input, message} from "antd";
import HttpUtil from "../../Utils/HttpUtil";
import ApiUtil from "../../Utils/ApiUtil";


class TeacherDelDialog extends Component {
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
            HttpUtil.post(ApiUtil.API_TEA_DEL, {del_id: values}).then(re=>{
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
                    title="教师用户注销"
                    okText="保存"
                    cancelText="取消"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}>
                    <Form {...this.layout} name="t-messages" ref={this.formRef} onFinish={this.onFinish} validateMessages={this.validateMessages}>
                      <Form.Item name='t_id' label="工号" rules={[{required: true, message: '请输入工号!'}]}>
                        <Input placeholder='删除前请确认该用户相关信息已清理！'/>
                      </Form.Item>
                    </Form>
                </Modal>
            </div>
        );
    }
}


export default TeacherDelDialog;