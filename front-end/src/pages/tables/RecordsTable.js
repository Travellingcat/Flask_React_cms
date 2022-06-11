import React, { Component } from "react";
import {message, Table} from 'antd';
import "antd/dist/antd.css";
import RecordUpdateDialog from "../dialogs/RecordUpdateDialog";
import HttpUtil from "../../Utils/HttpUtil";
import ApiUtil from "../../Utils/ApiUtil";


class RecordsTable extends Component {

    state = {
      showUpdateDialog: false,
      current_columns: [],
      edit_record: {},
      my_data: [],
    }

    columns = [
      {
        title: '记录编号',
        dataIndex: 'record_id',
        width: "150px",
      },
        {
        title: '学生',
        dataIndex: 'record_stu',
          width: "180px",
      },
      {
        title: '课程',
        dataIndex: 'record_course',
        width: "100px",
      },
      {
        title: '授课教师',
        dataIndex: 'record_teacher',
        width: "100px",
      },
      {
        title: '成绩',
        dataIndex: 'scores',
        width: "100px",
        defaultSortOrder: 'descend',
        sorter: (a, b) => a.scores - b.scores,
      },
      {
            title: '操作',
            width: "100px",
            render: (_, record)=>(
                <span>
                    <a onClick={()=>this.onUpdate(record)}>修改</a>
                </span>
            ),
       },
    ];

    componentDidMount() {
        if(this.props.u_cate === 'teacher'){
            this.setState({
                current_columns: this.columns,
            })
        }
        else {
            this.setState({
                current_columns: this.columns.slice(0,-1),
            })
        }
        this.getRecords()
    }

    getRecords = ()=>{
        HttpUtil.post(ApiUtil.API_RECORD_GET, {username: this.props.username, u_cate: this.props.u_cate}).then(re=>{
            console.log(re)
            this.setState({
                my_data: re.record_data,
            })
        }).catch(error=>{
            message.error(error.message)
        })
    }

    onChange(pagination, filters, sorter, extra) {
      console.log('params', pagination, filters, sorter, extra);
    }

    onUpdate = (item) => {
    this.setState({
        showUpdateDialog: true,
        edit_record: item,
      })
  }

    render() {
        return (
            <div>
                <Table
                columns={this.state.current_columns}
                dataSource={this.state.my_data}
                onChange={this.onChange}
                rowKey={item=>item.id}
                pagination={{pageSize: 10}}
                scroll={{ y: 340}} />

                <RecordUpdateDialog
                visible={this.state.showUpdateDialog}
                edit_record={this.state.edit_record}
                current_user={this.props.username}
                afterClose={()=>{
                        this.setState({
                            showUpdateDialog:false
                        });
                        setTimeout(()=>{this.getRecords();}, 100);
                    }} />
            </div>
        );
    }
}

export default RecordsTable;