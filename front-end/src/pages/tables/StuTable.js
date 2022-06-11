import React, { Component } from "react";
import {Table, Button, Layout, message, Space} from 'antd';
import "antd/dist/antd.css";
import StuUpdateDialog from "../dialogs/StuUpdateDialog";
import HttpUtil from "../../Utils/HttpUtil";
import ApiUtil from "../../Utils/ApiUtil";
import StuAddDialog from "../dialogs/StuAddDialog";
import StuDelDialog from "../dialogs/StuDelDialog";


class StuTable extends Component {

    state = {
      showUpdateDialog: false,          // 是否展示信息修改功能的对话框
      edit_record: {},                  // 当前要修改的那条记录的具体内容
      current_column: [],               // 当前要展示的表格的 列 的属性是哪些，如果是学生登录，列里面没有‘密码‘，如果是admin登录，列应该有’密码‘
      my_data: [],                      // 当前要展示的用户的详细数据
      showAddStu: false,
      showDelStu: false,
    }

    // 学生对应的表格的列
  //   columns = [
  //   {
  //     title: '学号',
  //     dataIndex: 'stu_id',
  //     width: "150px",
  //   },
  //     {
  //     title: '姓名',
  //     dataIndex: 'stu_name',
  //     width: "150px",
  //   },
  //   {
  //     title: '性别',
  //     dataIndex: 'stu_sex',
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
  //     onFilter: (value, record) => record.stu_sex.indexOf(value) === 0,
  //     // sorter: (a, b) => a.name.length - b.name.length,
  //     // sortDirections: ['descend'],
  //   },
  //   {
  //     title: '年龄',
  //     dataIndex: 'stu_age',
  //     width: "100px",
  //     defaultSortOrder: 'descend',
  //     sorter: (a, b) => a.stu_age - b.stu_age,
  //   },
  //   {
  //     title: '家庭住址',
  //     dataIndex: 'stu_address',
  //   },
  //   {
  //     title: '所在班级',
  //     dataIndex: 'stu_class',
  //     width: "180px",
  //   },
  //   {
  //     title: '当前学期',
  //     dataIndex: 'stu_term',
  //     width: "100px",
  //   },
  //   {
  //     title: '操作',
  //     render: (_, record)=>(
  //         <span>
  //             <a onClick={()=>this.onUpdate(record)}>修改</a>
  //         </span>
  //     ),
  //   },
  // ];
    // admin对应的表格的列
    columns = [
    {
      title: '学号',
      dataIndex: 'stu_id',
      width: "150px",
    },
      {
      title: '姓名',
      dataIndex: 'stu_name',
      width: "150px",
    },
    {
      title: '性别',
      dataIndex: 'stu_sex',
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
      onFilter: (value, record) => record.stu_sex.indexOf(value) === 0,
      // sorter: (a, b) => a.name.length - b.name.length,
      // sortDirections: ['descend'],
    },
    {
      title: '年龄',
      dataIndex: 'stu_age',
      width: "100px",
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.stu_age - b.stu_age,
    },
    {
      title: '家庭住址',
      dataIndex: 'stu_address',
    },
    {
      title: '所在班级',
      dataIndex: 'stu_class',
      width: "180px",
    },
    {
      title: '当前学期',
      dataIndex: 'stu_term',
      width: "100px",
    },
    {
      title: '密码',
      dataIndex: 'stu_password',
      width: "100px",
    },
    {
      title: '操作',
      render: (_, record)=>(
          <span>
              <a onClick={()=>this.onUpdate(record)}>修改</a>
          </span>
      ),
    },
  ];

    //当前这个组件挂载到页面上的时候，执行的函数
  componentDidMount() {
      //根据当前登录的用户名，来修改表格的列属性
     if(this.props.username === 'admin'){
        this.setState({
            current_column: this.columns,
        })
         // 执行获取用户数据的函数
         this.getData();
     }
     else {
         this.setState({
             current_column: this.columns
         })
         // 执行获取用户数据的函数
         this.getData();
     }
  }

  // 从后端获取用户的信息
  getData = ()=> {
      //通过post方法，通过（API_STU_GET）接口，来向后端请求用户数据，接收返回结果re
      HttpUtil.post(ApiUtil.API_STU_GET, {username: this.props.username}).then(re=>{
          // 修改当前要展示的用户的详细数据（my_data），修改成后端返回的结果re
          this.setState({
              my_data: re.u_data,
          })
      }).catch(error=>{
          // message.error(error.message);
      })
  }

    onChange(pagination, filters, sorter, extra) {
    console.log('params', pagination, filters, sorter, extra);
  }

    //点击修改之后，要执行的操作，同时把点击的那一行记录的具体内容传进来
    onUpdate = (item)=>{
      // 把是否展示信息修改功能的对话框（showUpdateDialog），修改成’是‘
      // 把当前要修改的那条记录的具体内容（edit_record）修改成传进来的参数（item）
      this.setState({
        showUpdateDialog: true,
        edit_record: item,
      })
    }

    onAddStu = ()=>{
      this.setState({
        showAddStu: true,
      })
    }

    onDelStu = ()=>{
        this.setState({
            showDelStu: true,
        })
    }

    render() {
      let Message
      if(this.props.username === 'admin'){
          Message = (
              <div>
                    <Space>
                        <Button type='primary' onClick={this.onAddStu}>新增</Button>
                        <Button onClick={this.onDelStu}>删除</Button>
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

                <StuUpdateDialog
                visible={this.state.showUpdateDialog}
                edit_record={this.state.edit_record}
                current_user={this.props.username}
                afterClose={()=>{
                        this.setState({
                            showUpdateDialog:false
                        });
                        setTimeout(()=>{this.getData();}, 100);
                    }} />

                 <StuAddDialog
                    visible={this.state.showAddStu}
                    afterClose={()=>{
                            this.setState({
                                showAddStu:false
                            });
                            setTimeout(()=>{this.getData();}, 100);
                        }}/>

                  <StuDelDialog
                     visible={this.state.showDelStu}
                     afterClose={()=>{
                            this.setState({
                                showDelStu:false
                            });
                            setTimeout(()=>{this.getData();}, 100);
                        }}/>

            </div>
        );
    }
}

export default StuTable;