import React, { Component } from "react";
import {Button, message, Space, Table} from 'antd';
import "antd/dist/antd.css";
import TeacherUpdateDialog from "../dialogs/TeacherUpdateDialog";
import HttpUtil from "../../Utils/HttpUtil";
import ApiUtil from "../../Utils/ApiUtil";
import TeacherAddDialog from "../dialogs/TeacherAddDialog";
import TeacherDelDialog from "../dialogs/TeacherDelDialog";


class TeacherTable extends Component {

  state = {
      showUpdateDialog: false,
      edit_record: {},
      current_column: [],
      my_data: [],
      showAddTeacher: false,
      showDelTeacher: false,
  }

  // columns2 = [
  //   {
  //     title: '工号',
  //     dataIndex: 't_id',
  //     width: "150px",
  //   },
  //     {
  //     title: '姓名',
  //     dataIndex: 't_name',
  //       width: "180px",
  //   },
  //   {
  //     title: '性别',
  //     dataIndex: 't_sex',
  //     width: "100px",
  //     filters: [
  //       {
  //         text: '男',
  //         value: '男',
  //       },
  //       {
  //         text: '女',
  //         value: '女',
  //       },
  //     ],
  //     // specify the condition of filtering result
  //     // here is that finding the name started with `value`
  //     onFilter: (value, record) => record.t_sex.indexOf(value) === 0,
  //     // sorter: (a, b) => a.name.length - b.name.length,
  //     // sortDirections: ['descend'],
  //   },
  //   {
  //     title: '年龄',
  //     dataIndex: 't_age',
  //     width: "100px",
  //     defaultSortOrder: 'descend',
  //     sorter: (a, b) => a.t_age - b.t_age,
  //   },
  //   {
  //       title: '操作',
  //       width: "100px",
  //       render: (_, record)=>(
  //           <span>
  //               <a onClick={()=>this.onUpdate(record)}>修改</a>
  //           </span>
  //       ),
  //     },
  // ];
  columns = [
    {
      title: '工号',
      dataIndex: 't_id',
      width: "150px",
    },
      {
      title: '姓名',
      dataIndex: 't_name',
        width: "180px",
    },
    {
      title: '性别',
      dataIndex: 't_sex',
      width: "100px",
      filters: [
        {
          text: '男',
          value: '男',
        },
        {
          text: '女',
          value: '女',
        },
      ],
      // specify the condition of filtering result
      // here is that finding the name started with `value`
      onFilter: (value, record) => record.t_sex.indexOf(value) === 0,
      // sorter: (a, b) => a.name.length - b.name.length,
      // sortDirections: ['descend'],
    },
    {
      title: '年龄',
      dataIndex: 't_age',
      width: "100px",
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.t_age - b.t_age,
    },
    {
      title: '密码',
      dataIndex: 't_password',
      width: "100px",
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
      if(this.props.username === 'admin'){
        this.setState({
            current_column: this.columns,
        })
         this.getData();
     }
     else {
         this.setState({
             current_column: this.columns
         })
         this.getData();
     }
  }

    getData = ()=>{
        HttpUtil.post(ApiUtil.API_TEA_GET, {username: this.props.username}).then(re=>{
            // console.log(re)
            this.setState({
              my_data: re.u_data,
          })
        }).catch(errpr=>{
            // message.error(errpr.message)
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
      // console.log(this.state.edit_record);
  }

  onAddTeacher = ()=>{
        this.setState({
            showAddTeacher: true,
        })
    }

    onDelTeacher = ()=>{
        this.setState({
            showDelTeacher: true,
        })
    }

    render() {
      let Message
      if(this.props.username === 'admin'){
          Message = (
              <div>
                    <Space>
                        <Button type='primary' onClick={this.onAddTeacher}>新增</Button>
                        <Button onClick={this.onDelTeacher}>删除</Button>
                    </Space>
              </div>
          )
      }
        return (
            <div>
                {Message}
                <Table
                columns={this.state.current_column}
                dataSource={this.state.my_data}
                onChange={this.onChange}
                rowKey={item=>item.id}
                pagination={{pageSize: 10}}
                scroll={{ y: 340}} />

                <TeacherUpdateDialog
                visible={this.state.showUpdateDialog}
                edit_record={this.state.edit_record}
                current_user={this.props.username}
                afterClose={()=>{
                        this.setState({
                            showUpdateDialog:false
                        });
                        setTimeout(()=>{this.getData();}, 100);
                    }} />

                 <TeacherAddDialog
                    visible={this.state.showAddTeacher}
                    afterClose={()=>{
                            this.setState({
                                showAddTeacher:false
                            });
                            setTimeout(()=>{this.getData();}, 100);
                        }}/>

                 <TeacherDelDialog
                     visible={this.state.showDelTeacher}
                     afterClose={()=>{
                            this.setState({
                                showDelTeacher:false
                            });
                            setTimeout(()=>{this.getData();}, 100);
                        }}/>
            </div>
        );
    }
}

export default TeacherTable;